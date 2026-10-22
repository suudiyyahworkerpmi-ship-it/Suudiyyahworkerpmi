import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { Member } from '../../types';
import { getStoredMembers, saveMembers, ADMIN_EMAIL } from '../../services/storage';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
  onRegisterSuccess: (email: string) => void;
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

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onOpenLogin,
  onRegisterSuccess,
}) => {
  const [nama, setNama] = useState('');
  const [alamat, setAlamat] = useState('');
  const [telepon, setTelepon] = useState('');
  const [negara, setNegara] = useState('Indonesia');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim().toLowerCase();

    if (trimmedEmail === ADMIN_EMAIL.toLowerCase()) {
      setError('Email ini dialokasikan untuk administrator.');
      return;
    }

    const members = getStoredMembers();

    if (members.some((m) => m.email.toLowerCase() === trimmedEmail)) {
      setError('Email ini sudah terdaftar. Silakan login ke akun Anda.');
      return;
    }

    const newMember: Member = {
      id: Date.now(),
      nama,
      alamat,
      telepon,
      negara,
      email: trimmedEmail,
      password,
      avatar: '',
      tglLahir: '',
      status: 'Bekerja',
      lulusan: '',
      institusi: '',
      riwayat: '',
      dokumen: {},
    };

    members.push(newMember);
    saveMembers(members);

    alert('Registrasi member berhasil! Silakan masuk dengan email dan password Anda.');
    onClose();
    onRegisterSuccess(trimmedEmail);
    onOpenLogin();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl my-8 relative animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Registrasi Member PMI</h3>
              <p className="text-xs text-gray-500">Pendaftaran resmi calon pekerja migran</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Nama Lengkap Sesuai KTP/Paspor *
            </label>
            <input
              required
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent"
              placeholder="Contoh: Muhammad Syarif"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Alamat Domisili *</label>
            <textarea
              required
              rows={2}
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent"
              placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota/Kabupaten"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Nomor Telepon / WhatsApp (tanpa 0/+62) *
              </label>
              <input
                required
                type="tel"
                pattern="[0-9]+"
                value={telepon}
                onChange={(e) => setTelepon(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent"
                placeholder="Contoh: 81234567890"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Negara *</label>
              <select
                required
                value={negara}
                onChange={(e) => setNegara(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent bg-white"
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email Aktif *</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent"
              placeholder="nama@email.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Kata Sandi / Password (minimal 6 karakter) *
            </label>
            <input
              required
              type="password"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-800 text-white font-bold py-2.5 rounded-lg hover:bg-emerald-900 transition mt-2 shadow-md cursor-pointer"
          >
            Daftar Sekarang
          </button>

          <p className="text-xs text-gray-500 text-center pt-2">
            Sudah memiliki akun?{' '}
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenLogin();
              }}
              className="text-emerald-800 font-bold hover:underline"
            >
              Masuk di sini
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};
