import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, ShieldCheck, CheckCircle2, Upload, AlertCircle } from 'lucide-react';
import { Member, Rekening } from '../../types';
import { CURRENCY, getStoredRekening, saveRekening } from '../../services/storage';

interface BuatRekeningModalProps {
  isOpen: boolean;
  currentMember?: Member;
  onClose: () => void;
  onSuccess: () => void;
}

const COUNTRIES = [
  'Indonesia',
  'Arab Saudi',
  'Malaysia',
  'Singapura',
  'Brunei',
  'Thailand',
  'Filipina',
  'Vietnam',
  'Mesir',
  'Yaman',
  'Pakistan',
  'Bangladesh',
  'India',
  'Sudan',
  'Turki',
  'Uni Emirat Arab',
  'Qatar',
  'Kuwait',
  'Oman',
  'Bahrain',
  'Yordania',
  'Maroko',
  'Tunisia',
  'Aljazair',
  'Amerika Serikat',
  'Inggris',
  'Australia',
  'Lainnya',
];

export const BuatRekeningModal: React.FC<BuatRekeningModalProps> = ({
  isOpen,
  currentMember,
  onClose,
  onSuccess,
}) => {
  const [nama, setNama] = useState('');
  const [umur, setUmur] = useState('28');
  const [alamat, setAlamat] = useState('');
  const [negara, setNegara] = useState('Indonesia');
  const [wajahData, setWajahData] = useState('');
  const [ktpData, setKtpData] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isOpen && currentMember) {
      setNama(currentMember.nama || '');
      setAlamat(currentMember.alamat || '');
      setNegara(currentMember.negara || 'Indonesia');
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, currentMember]);

  const startCamera = async () => {
    setCameraError('');
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraActive(true);
      }
    } catch (err) {
      console.warn('Camera access unavailable or denied:', err);
      setCameraError('Kamera tidak dapat diakses atau izin ditolak. Anda dapat mengunggah foto wajah.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const captureFace = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 320;
    canvas.height = videoRef.current.videoHeight || 240;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      setWajahData(dataUrl);
    }
  };

  const handleFaceFallbackUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setWajahData(ev.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleKtpUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setKtpData(ev.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMember) {
      alert('Silakan login terlebih dahulu.');
      return;
    }

    if (!wajahData) {
      alert('Harap lakukan rekam foto wajah terlebih dahulu.');
      return;
    }

    if (!ktpData) {
      alert('Harap unggah foto KTP atau tanda pengenal Anda.');
      return;
    }

    const list = getStoredRekening();
    const existingApproved = list.find(
      (r) => r.email.toLowerCase() === currentMember.email.toLowerCase() && r.status === 'approved'
    );

    if (existingApproved) {
      alert('Anda sudah memiliki rekening Sanabil Bank yang aktif.');
      handleClose();
      return;
    }

    const randomNum = Math.floor(Math.random() * 900000000 + 100000000);
    const newRekening: Rekening = {
      id: Date.now(),
      email: currentMember.email,
      nama,
      umur,
      alamat,
      negara,
      matauang: CURRENCY,
      wajah: wajahData,
      ktp: ktpData,
      status: 'pending',
      saldo: 0,
      noRek: `SNB-${randomNum}`,
      tanggal: new Date().toLocaleString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      transaksi: [],
    };

    list.push(newRekening);
    saveRekening(list);

    alert(
      'Permohonan rekening berhasil dikirim!\n\nNomor Pengajuan: ' +
        newRekening.noRek +
        '\nStatus: MENUNGGU PERSETUJUAN ADMIN.\n\nTim verifikasi Sanabil Bank akan meninjau data Anda segera.'
    );

    stopCamera();
    onClose();
    onSuccess();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl my-8 relative animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Formulir Rekening Sanabil Bank</h3>
              <p className="text-xs text-gray-500">Bank Resmi Suudiyyah Arab Saudi</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Notice */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 mb-4 text-xs text-emerald-900">
          <p className="font-bold mb-0.5 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            Bank Resmi Suudiyyah Arab Saudi (Khusus Pekerja Imigran)
          </p>
          <p className="leading-relaxed text-emerald-800">
            Rekening dapat digunakan seumur hidup selama Anda bekerja di Arab Saudi. Berlaku hingga batas akhir pendaftaran loker: <strong>26 Oktober 2026</strong>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Lengkap *</label>
              <input
                required
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Umur *</label>
              <input
                required
                type="number"
                min="17"
                max="99"
                value={umur}
                onChange={(e) => setUmur(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Alamat Lengkap *</label>
            <textarea
              required
              rows={2}
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Kewarganegaraan *</label>
              <select
                required
                value={negara}
                onChange={(e) => setNegara(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Mata Uang Utama</label>
              <input
                type="text"
                value="SAR - Riyal Arab Saudi"
                disabled
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-100 text-gray-600 font-medium"
              />
              <p className="text-[11px] text-gray-500 mt-1">Semua rekening Sanabil Bank beroperasi dalam mata uang SAR.</p>
            </div>
          </div>

          {/* Biometric Face Verification */}
          <div className="border border-emerald-200 rounded-xl p-4 bg-emerald-50/60">
            <h4 className="font-bold text-gray-900 mb-1 text-sm flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-emerald-800" />
              <span>Verifikasi Rekam Wajah (Biometrik) *</span>
            </h4>
            <p className="text-xs text-gray-600 mb-3">
              Wajah harus menghadap lurus ke kamera, pencahayaan cukup, tanpa masker atau kacamata hitam.
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              {cameraActive && (
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="video-preview w-44 h-32 object-cover border-2 border-emerald-700 rounded-lg shadow-sm"
                  />
                  <span className="absolute top-2 left-2 bg-red-600 text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider animate-pulse">
                    Live
                  </span>
                </div>
              )}

              <div className="space-y-2">
                {cameraActive && (
                  <button
                    type="button"
                    onClick={captureFace}
                    className="bg-emerald-800 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-emerald-900 transition flex items-center gap-1.5 shadow"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Ambil Foto Wajah</span>
                  </button>
                )}

                {!cameraActive && (
                  <button
                    type="button"
                    onClick={startCamera}
                    className="bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-emerald-800 transition"
                  >
                    Aktifkan Kamera
                  </button>
                )}

                {cameraError && (
                  <div className="text-[11px] text-amber-800 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{cameraError}</span>
                  </div>
                )}

                {/* Fallback upload */}
                <div>
                  <label className="text-[11px] text-gray-600 font-medium block">
                    Atau unggah foto wajah:
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFaceFallbackUpload}
                    className="text-xs text-gray-500 mt-1"
                  />
                </div>
              </div>

              {wajahData && (
                <div className="text-center">
                  <img
                    src={wajahData}
                    alt="Preview Wajah"
                    className="w-28 h-28 object-cover rounded-lg border-2 border-emerald-600 shadow-md mx-auto"
                  />
                  <p className="text-xs mt-1 text-emerald-800 font-semibold flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Foto Wajah Siap
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* KTP / ID Card Verification */}
          <div className="border border-amber-200 rounded-xl p-4 bg-amber-50/50">
            <h4 className="font-bold text-gray-900 mb-1 text-sm flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-brand-gold" />
              <span>Verifikasi KTP / Paspor / ID Negara *</span>
            </h4>
            <p className="text-xs text-gray-600 mb-2">
              Unggah foto KTP asli atau identitas resmi yang masih berlaku dengan tulisan terbaca jelas.
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleKtpUpload}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
            />
            {ktpData && (
              <div className="mt-3">
                <p className="text-xs font-semibold text-gray-700 mb-1">Preview Dokumen Identitas:</p>
                <img
                  src={ktpData}
                  alt="Preview KTP"
                  className="w-44 h-28 object-cover rounded-lg border-2 border-emerald-700 shadow"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-brand-gold text-white font-bold py-3 rounded-lg hover:bg-yellow-700 transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Kirim Permohonan Rekening Sanabil</span>
          </button>
          <p className="text-xs text-gray-500 text-center">
            Permohonan rekening akan ditinjau dan diverifikasi oleh Administrator Sanabil Bank.
          </p>
        </form>
      </div>
    </div>
  );
};
