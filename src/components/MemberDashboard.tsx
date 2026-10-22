import React, { useState, useRef } from 'react';
import {
  User,
  ShieldCheck,
  CreditCard,
  Briefcase,
  LogOut,
  ArrowLeft,
  Camera,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  LayoutDashboard,
  ExternalLink,
} from 'lucide-react';
import { Member, Rekening, AntrianDeposit, Lamaran } from '../types';
import {
  formatMoney,
  getStoredMembers,
  saveMembers,
  getStoredRekening,
  getStoredAntrian,
  getStoredLamaran,
  setCurrentLoginEmail,
  updateMemberEmailInAllStores,
} from '../services/storage';
import { FlagIndonesia, FlagSaudiArabia } from './Flags';

interface MemberDashboardProps {
  currentMember: Member;
  onLogout: () => void;
  onNavigateHome: () => void;
  onNavigateBank: () => void;
  onOpenCekRekening: () => void;
  onRefreshData: () => void;
}

export const MemberDashboard: React.FC<MemberDashboardProps> = ({
  currentMember,
  onLogout,
  onNavigateHome,
  onNavigateBank,
  onOpenCekRekening,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'rekening' | 'lamaran'>('overview');

  // Profile Form state
  const [nama, setNama] = useState(currentMember.nama || '');
  const [email, setEmail] = useState(currentMember.email || '');
  const [telepon, setTelepon] = useState(currentMember.telepon || '');
  const [negara, setNegara] = useState(currentMember.negara || 'Indonesia');
  const [tglLahir, setTglLahir] = useState(currentMember.tglLahir || '');
  const [statusKerja, setStatusKerja] = useState(currentMember.status || '');
  const [alamat, setAlamat] = useState(currentMember.alamat || '');
  const [lulusan, setLulusan] = useState(currentMember.lulusan || '');
  const [institusi, setInstitusi] = useState(currentMember.institusi || '');
  const [riwayat, setRiwayat] = useState(currentMember.riwayat || '');

  // Profile Camera State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const profileVideoRef = useRef<HTMLVideoElement>(null);
  const profileStreamRef = useRef<MediaStream | null>(null);

  // Fetch current rekening and antrian for this user
  const rekenings = getStoredRekening();
  const userRekening = rekenings.find(
    (r) => r.email.toLowerCase() === currentMember.email.toLowerCase()
  );

  const antrianList = getStoredAntrian();
  const pendingDeposits = userRekening
    ? antrianList.filter((a) => a.rekId === userRekening.id && a.status === 'pending')
    : [];

  const lamaranList = getStoredLamaran().filter(
    (l) => l.email.toLowerCase() === currentMember.email.toLowerCase()
  );

  // Profile Camera Handlers
  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 320 }, height: { ideal: 240 } },
        });
        profileStreamRef.current = stream;
        if (profileVideoRef.current) {
          profileVideoRef.current.srcObject = stream;
        }
        setIsCameraActive(true);
      }
    } catch {
      alert('Kamera tidak dapat diakses atau izin ditolak.');
    }
  };

  const capturePhoto = () => {
    if (!profileVideoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = profileVideoRef.current.videoWidth || 320;
    canvas.height = profileVideoRef.current.videoHeight || 240;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(profileVideoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      updateMemberAvatar(dataUrl);
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (profileStreamRef.current) {
      profileStreamRef.current.getTracks().forEach((t) => t.stop());
      profileStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const updateMemberAvatar = (avatarData: string) => {
    const members = getStoredMembers();
    const idx = members.findIndex((m) => m.id === currentMember.id);
    if (idx !== -1) {
      members[idx].avatar = avatarData;
      saveMembers(members);
      onRefreshData();
    }
  };

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        updateMemberAvatar(ev.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDocUpload = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const members = getStoredMembers();
    const idx = members.findIndex((m) => m.id === currentMember.id);
    if (idx !== -1) {
      if (!members[idx].dokumen) members[idx].dokumen = {};
      members[idx].dokumen![key] = file.name;
      saveMembers(members);
      onRefreshData();
      alert(`Dokumen ${key.toUpperCase()} berhasil disimpan.`);
    }
  };

  React.useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const members = getStoredMembers();
    const idx = members.findIndex((m) => m.id === currentMember.id);
    if (idx !== -1) {
      const oldEmail = members[idx].email;
      const newEmail = email.trim().toLowerCase();

      members[idx].nama = nama;
      members[idx].email = newEmail;
      members[idx].telepon = telepon;
      members[idx].negara = negara;
      members[idx].tglLahir = tglLahir;
      members[idx].status = statusKerja;
      members[idx].alamat = alamat;
      members[idx].lulusan = lulusan;
      members[idx].institusi = institusi;
      members[idx].riwayat = riwayat;

      saveMembers(members);
      if (oldEmail !== newEmail) {
        updateMemberEmailInAllStores(oldEmail, newEmail);
        setCurrentLoginEmail(newEmail);
      }
      onRefreshData();
      alert('Data profil Anda berhasil disimpan.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="bg-white md:w-64 border-r border-gray-200 md:min-h-screen shrink-0 shadow-sm flex flex-col">
        {/* User Badge */}
        <div className="p-5 border-b border-gray-200 bg-gray-50/50">
          <div className="flex items-center gap-3">
            {currentMember.avatar ? (
              <img
                src={currentMember.avatar}
                alt={currentMember.nama}
                className="w-12 h-12 rounded-full object-cover border-2 border-emerald-600 shadow"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-lg shadow">
                {currentMember.nama ? currentMember.nama.charAt(0).toUpperCase() : 'M'}
              </div>
            )}
            <div className="overflow-hidden">
              <p className="font-bold text-sm text-gray-900 truncate">{currentMember.nama}</p>
              <p className="text-xs text-gray-500 truncate">{currentMember.email}</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3" />
                  Terverifikasi
                </span>
                <div className="flex items-center gap-0.5 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                  <FlagIndonesia className="w-3.5 h-2 rounded-xs" />
                  <FlagSaudiArabia className="w-3.5 h-2 rounded-xs" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="p-3 space-y-1 flex-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-2.5 ${
              activeTab === 'overview'
                ? 'bg-emerald-800 text-white shadow'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Ringkasan</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-2.5 ${
              activeTab === 'profile'
                ? 'bg-emerald-800 text-white shadow'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profil Saya</span>
          </button>

          <button
            onClick={() => setActiveTab('rekening')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-2.5 ${
              activeTab === 'rekening'
                ? 'bg-emerald-800 text-white shadow'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Rekening Sanabil</span>
            {pendingDeposits.length > 0 && (
              <span className="ml-auto w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('lamaran')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-2.5 ${
              activeTab === 'lamaran'
                ? 'bg-emerald-800 text-white shadow'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Lamaran Saya</span>
            {lamaranList.length > 0 && (
              <span className="ml-auto bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full font-bold">
                {lamaranList.length}
              </span>
            )}
          </button>
        </nav>

        {/* Footer actions in sidebar */}
        <div className="p-3 border-t border-gray-200 space-y-1">
          <button
            onClick={onNavigateHome}
            className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Halaman Utama Lowongan</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar dari Akun</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-black text-gray-900">Ringkasan Akun Member</h2>
              <p className="text-sm text-gray-500">
                Selamat datang kembali, <strong>{currentMember.nama}</strong>. Kelola profil dan rekening kerja Anda.
              </p>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Status Akun</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <p className="text-xl font-bold text-gray-900">Aktif & Terdaftar</p>
                </div>
                <p className="text-xs text-gray-400 mt-1">Terhubung ke database SISKOP2MI</p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  Rekening Sanabil Bank
                </p>
                <div className="mt-1">
                  {userRekening ? (
                    userRekening.status === 'approved' ? (
                      <span className="text-xl font-bold text-emerald-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        Aktif ({userRekening.noRek})
                      </span>
                    ) : userRekening.status === 'pending' ? (
                      <span className="text-xl font-bold text-amber-600 flex items-center gap-1.5">
                        <Clock className="w-5 h-5" />
                        Menunggu Persetujuan
                      </span>
                    ) : (
                      <span className="text-xl font-bold text-red-600">Ditolak</span>
                    )
                  ) : (
                    <span className="text-xl font-bold text-gray-400">Belum Ada Rekening</span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">Syarat wajib pendaftaran kerja Madinah</p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Saldo Rekening</p>
                <p className="text-2xl font-black text-emerald-800 mt-1">
                  {userRekening ? formatMoney(userRekening.saldo || 0) : formatMoney(0)}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Minimal syarat loker: <strong>SAR 3.999,80</strong>
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
              <h3 className="font-bold text-base text-gray-900 mb-2">Aksi Cepat</h3>
              <p className="text-xs text-gray-500 mb-4">
                Pilih tindakan yang ingin Anda lakukan selanjutnya:
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveTab('profile')}
                  className="bg-emerald-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-900 transition shadow-sm"
                >
                  Lengkapi Profil & Dokumen
                </button>
                {userRekening && userRekening.status === 'approved' ? (
                  <button
                    onClick={onNavigateBank}
                    className="bg-brand-gold text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-yellow-700 transition shadow-sm flex items-center gap-1.5"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Buka Sanabil Bank</span>
                  </button>
                ) : (
                  <button
                    onClick={onOpenCekRekening}
                    className="bg-brand-gold text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-yellow-700 transition shadow-sm flex items-center gap-1.5"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Buat Rekening Sanabil</span>
                  </button>
                )}
                <button
                  onClick={() => setActiveTab('lamaran')}
                  className="bg-gray-100 text-gray-800 border border-gray-300 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-200 transition"
                >
                  Status Lamaran Saya
                </button>
                <button
                  onClick={onNavigateHome}
                  className="bg-gray-50 text-emerald-800 border border-emerald-200 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-50 transition"
                >
                  Cari Lowongan Posisi Lain
                </button>
              </div>
            </div>

            {/* Application notice */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-emerald-950 text-sm">
              <p className="font-bold mb-1 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                Informasi Penempatan Anwar Al Madinah Mövenpick
              </p>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Pastikan Anda telah mengisi kelengkapan paspor dan sertifikat medis GAMCA. Pembekalan pra-pemberangkatan (Orientasi Pra-Pemberangkatan / OPP) dikoordinasikan langsung oleh kantor perwakilan BP2MI wilayah masing-masing.
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: PROFILE */}
        {activeTab === 'profile' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-black text-gray-900">Profil & Berkas Saya</h2>
              <p className="text-sm text-gray-500">
                Kelola data diri, riwayat kerja, foto profil, dan dokumen pendukung lamaran.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Profile Photo & Webcam Capture */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h3 className="font-bold text-sm text-gray-900 mb-4 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-emerald-800" />
                  <span>Foto Profil</span>
                </h3>

                <div className="flex flex-wrap items-center gap-5">
                  {currentMember.avatar ? (
                    <img
                      src={currentMember.avatar}
                      alt={currentMember.nama}
                      className="w-24 h-24 rounded-full object-cover border-4 border-emerald-600 shadow"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-3xl shadow">
                      {currentMember.nama ? currentMember.nama.charAt(0).toUpperCase() : 'M'}
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <label className="bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer hover:bg-emerald-900 transition flex items-center gap-1.5 shadow">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Unggah Foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarFileUpload}
                        />
                      </label>

                      <button
                        type="button"
                        onClick={startCamera}
                        className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-50 transition flex items-center gap-1.5"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Ambil dari Kamera</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-gray-500">
                      Format JPG atau PNG. Pastikan wajah terlihat jelas dengan pencahayaan memadai.
                    </p>
                  </div>
                </div>

                {isCameraActive && (
                  <div className="mt-4 p-4 border border-emerald-300 rounded-xl bg-emerald-50/50 max-w-sm">
                    <p className="text-xs font-bold text-emerald-950 mb-2">Pratinjau Kamera Langsung:</p>
                    <video
                      ref={profileVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-44 object-cover rounded-lg border border-emerald-700 video-preview"
                    />
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={capturePhoto}
                        className="bg-emerald-800 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-900 transition"
                      >
                        Ambil Foto
                      </button>
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-gray-300 transition"
                      >
                        Tutup Kamera
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Personal Data */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-gray-900">Data Pribadi</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Lengkap</label>
                    <input
                      type="text"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Nomor Telepon / WA
                    </label>
                    <input
                      type="tel"
                      value={telepon}
                      onChange={(e) => setTelepon(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Negara</label>
                    <input
                      type="text"
                      value={negara}
                      onChange={(e) => setNegara(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Tanggal Lahir</label>
                    <input
                      type="date"
                      value={tglLahir}
                      onChange={(e) => setTglLahir(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Status Pekerjaan Saat Ini
                    </label>
                    <select
                      value={statusKerja}
                      onChange={(e) => setStatusKerja(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                    >
                      <option value="">Pilih Status</option>
                      <option value="Bekerja">Bekerja</option>
                      <option value="Tidak Bekerja">Tidak Bekerja</option>
                      <option value="Pelajar / Mahasiswa">Pelajar / Mahasiswa</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Alamat Rumah Sesuai KTP</label>
                  <textarea
                    rows={2}
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              {/* Education & Work Experience */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-gray-900">Pendidikan & Pengalaman Kerja</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Jenjang Pendidikan Terakhir
                    </label>
                    <select
                      value={lulusan}
                      onChange={(e) => setLulusan(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                    >
                      <option value="">Pilih Jenjang</option>
                      <option value="SD">SD</option>
                      <option value="SMP">SMP</option>
                      <option value="SMA / SMK">SMA / SMK</option>
                      <option value="D3">Diploma 3 (D3)</option>
                      <option value="S1">Sarjana (S1)</option>
                      <option value="S2">Magister (S2)</option>
                      <option value="S3">Doktor (S3)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Nama Sekolah / Universitas
                    </label>
                    <input
                      type="text"
                      value={institusi}
                      onChange={(e) => setInstitusi(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                      placeholder="Contoh: Universitas Indonesia"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Deskripsi Ringkas Riwayat Pengalaman Kerja
                  </label>
                  <textarea
                    rows={3}
                    value={riwayat}
                    onChange={(e) => setRiwayat(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    placeholder="Contoh: 2021-2023 Staff Hospitality Hotel Bintang 4 di Jakarta, menangani check-in jemaah"
                  />
                </div>
              </div>

              {/* Upload Dokumen Pendukung */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-gray-900">Dokumen Pendukung Tersimpan</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {['cv', 'ijazah', 'paspor', 'sertifikat'].map((key) => {
                    const savedFile = currentMember.dokumen?.[key];
                    const label =
                      key === 'cv'
                        ? 'Curriculum Vitae (PDF)'
                        : key === 'ijazah'
                        ? 'Ijazah Terakhir'
                        : key === 'paspor'
                        ? 'Paspor Asli'
                        : 'Sertifikat Kompetensi';
                    return (
                      <div key={key} className="border border-gray-200 rounded-xl p-3.5 bg-gray-50/50">
                        <label className="block text-xs font-semibold text-gray-800 mb-1">
                          {label}
                        </label>
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          onChange={(e) => handleDocUpload(key, e)}
                          className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs bg-white"
                        />
                        <p className="text-xs mt-1.5 flex items-center gap-1">
                          {savedFile ? (
                            <span className="text-emerald-700 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Tersimpan: {savedFile}
                            </span>
                          ) : (
                            <span className="text-gray-400">Belum ada file terunggah</span>
                          )}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="bg-emerald-800 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-emerald-900 transition shadow-md cursor-pointer flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Simpan Perubahan Profil</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: REKENING SANABIL */}
        {activeTab === 'rekening' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-black text-gray-900">Rekening Sanabil Bank</h2>
              <p className="text-sm text-gray-500">
                Kelola rekening bank resmi Kerajaan Arab Saudi untuk penerimaan gaji & deposit.
              </p>
            </div>

            {/* If no account */}
            {!userRekening && (
              <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center shadow-sm max-w-xl mx-auto">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Anda Belum Memiliki Rekening Sanabil Bank
                </h3>
                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                  Semua calon pekerja di Anwar Al Madinah Mövenpick Hotel diwajibkan memiliki rekening resmi Sanabil Bank berstatus aktif dengan saldo minimum SAR 3.999,80.
                </p>
                <button
                  onClick={onOpenCekRekening}
                  className="bg-emerald-800 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-emerald-900 transition shadow-md"
                >
                  Buat Rekening Sanabil Sekarang
                </button>
              </div>
            )}

            {/* Pending account */}
            {userRekening && userRekening.status === 'pending' && (
              <div className="bg-amber-50 border border-amber-300 rounded-2xl p-6 text-center max-w-xl mx-auto shadow-sm">
                <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-amber-950 mb-1">
                  Permohonan Rekening Sedang Ditinjau
                </h3>
                <p className="text-xs text-amber-800 mb-2 font-mono">
                  No. Pengajuan: <strong>{userRekening.noRek}</strong>
                </p>
                <p className="text-sm text-amber-800 leading-relaxed mb-4">
                  Data biometrik rekam wajah dan foto identitas KTP Anda saat ini sedang dalam antrian persetujuan admin pusat. Mohon periksa kembali secara berkala.
                </p>
                <span className="inline-block bg-amber-200 text-amber-900 font-bold px-3 py-1 rounded-full text-xs">
                  STATUS: MENUNGGU VERIFIKASI ADMIN
                </span>
              </div>
            )}

            {/* Rejected account */}
            {userRekening && userRekening.status === 'rejected' && (
              <div className="bg-red-50 border border-red-300 rounded-2xl p-6 text-center max-w-xl mx-auto shadow-sm">
                <div className="w-14 h-14 rounded-full bg-red-100 text-red-700 flex items-center justify-center mx-auto mb-3">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-red-950 mb-2">Permohonan Rekening Ditolak</h3>
                <p className="text-sm text-red-800 mb-4 leading-relaxed">
                  Maaf, permohonan rekening sebelumnya belum memenuhi kelengkapan verifikasi biometrik atau identitas. Silakan ajukan ulang permohonan Anda.
                </p>
                <button
                  onClick={onOpenCekRekening}
                  className="bg-emerald-800 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-900 transition"
                >
                  Ajukan Ulang Rekening
                </button>
              </div>
            )}

            {/* Approved account */}
            {userRekening && userRekening.status === 'approved' && (
              <div className="space-y-5">
                {/* Pending deposit notification if any */}
                {pendingDeposits.length > 0 && (
                  <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-amber-900 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-xs leading-relaxed">
                      <p className="font-bold text-sm">Deposit Sedang Dalam Antrian Verifikasi</p>
                      <p>
                        Anda memiliki <strong>{pendingDeposits.length} deposit</strong> yang menunggu verifikasi admin. Saldo Anda akan otomatis bertambah setelah disetujui.
                      </p>
                    </div>
                  </div>
                )}

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-900">
                  <p className="font-bold">Bank Resmi Suudiyyah Arab Saudi</p>
                  <p className="text-emerald-800 mt-0.5">
                    Khusus pekerja imigran terdaftar SISKOP2MI. Rekening dapat digunakan seumur hidup selama bekerja di Arab Saudi. Berlaku hingga 26 Oktober 2026.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                        Saldo Rekening Utama
                      </p>
                      <p className="text-4xl font-black text-emerald-800 mt-1">
                        {formatMoney(userRekening.saldo || 0)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Nomor Rekening: <strong className="text-gray-900">{userRekening.noRek}</strong>
                      </p>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full border border-green-300">
                      STATUS: AKTIF & TERVERIFIKASI
                    </span>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-3">
                    <button
                      onClick={onNavigateBank}
                      className="bg-emerald-800 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-emerald-900 transition shadow flex items-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Buka Aplikasi Sanabil Bank</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: LAMARAN SAYA */}
        {activeTab === 'lamaran' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-black text-gray-900">Lamaran Pekerjaan Saya</h2>
              <p className="text-sm text-gray-500">
                Pantau progres dan status lamaran kerja yang telah Anda kirimkan.
              </p>
            </div>

            {lamaranList.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center shadow-sm">
                <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-base font-bold text-gray-700 mb-1">Belum Ada Lamaran Terkirim</p>
                <p className="text-xs text-gray-500 mb-4">
                  Pilih posisi lowongan yang tersedia dan kirimkan dokumen Anda.
                </p>
                <button
                  onClick={onNavigateHome}
                  className="bg-emerald-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-900 transition"
                >
                  Lihat Daftar Lowongan
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {lamaranList.map((lamaran) => (
                  <div
                    key={lamaran.id}
                    className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-emerald-950">{lamaran.posisi}</h3>
                        <p className="text-xs text-gray-500">
                          Tanggal Pengajuan: {lamaran.tanggal} • Domisili: {lamaran.statusDomisili}
                        </p>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-300">
                        Dalam Proses Review Tim Seleksi
                      </span>
                    </div>

                    <div className="border-t border-gray-100 pt-3 text-xs text-gray-600 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-emerald-700" />
                        <span>
                          {lamaran.dokumenList?.length || 0} Dokumen Berkas Terverifikasi Sistem
                        </span>
                      </div>
                      <p className="text-gray-500">Kontak: {lamaran.telepon}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
