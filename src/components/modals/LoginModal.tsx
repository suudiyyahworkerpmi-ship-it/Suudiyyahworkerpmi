import React, { useState } from 'react';
import { X, LogIn, KeyRound, ShieldAlert } from 'lucide-react';
import { ADMIN_EMAIL, ADMIN_PASSWORD, getStoredMembers, setCurrentLoginEmail } from '../../services/storage';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRegister: () => void;
  onLoginSuccess: (email: string, role: 'admin' | 'member') => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onOpenRegister,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmed = email.trim().toLowerCase();

    // Check Admin login
    if (trimmed === ADMIN_EMAIL.toLowerCase()) {
      if (password !== ADMIN_PASSWORD) {
        setError('Password admin salah. Silakan periksa kembali.');
        return;
      }
      setCurrentLoginEmail(ADMIN_EMAIL);
      onClose();
      onLoginSuccess(ADMIN_EMAIL, 'admin');
      return;
    }

    // Check Member login
    const members = getStoredMembers();
    const member = members.find((m) => m.email.toLowerCase() === trimmed);

    if (!member) {
      setError('Email tidak terdaftar. Silakan registrasi terlebih dahulu.');
      return;
    }

    if (member.password && member.password !== password) {
      setError('Password salah. Silakan coba lagi.');
      return;
    }

    setCurrentLoginEmail(member.email);
    onClose();
    onLoginSuccess(member.email, 'member');
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <LogIn className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Masuk Akun</h3>
              <p className="text-xs text-gray-500">Portal Member & Administrasi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
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
            <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-800 text-white font-bold py-2.5 rounded-lg hover:bg-emerald-900 transition mt-2 shadow-md cursor-pointer flex items-center justify-center gap-1.5"
          >
            <KeyRound className="w-4 h-4" />
            <span>Masuk ke Akun</span>
          </button>

          <p className="text-xs text-gray-500 text-center pt-2">
            Belum punya akun?{' '}
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenRegister();
              }}
              className="text-emerald-800 font-bold hover:underline cursor-pointer"
            >
              Daftar di sini
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};
