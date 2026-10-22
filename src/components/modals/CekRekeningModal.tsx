import React from 'react';
import { HelpCircle, X } from 'lucide-react';
import { getStoredRekening } from '../../services/storage';

interface CekRekeningModalProps {
  isOpen: boolean;
  userEmail: string;
  onClose: () => void;
  onOpenBuatRekening: () => void;
  onNavigateToBank: () => void;
}

export const CekRekeningModal: React.FC<CekRekeningModalProps> = ({
  isOpen,
  userEmail,
  onClose,
  onOpenBuatRekening,
  onNavigateToBank,
}) => {
  if (!isOpen) return null;

  const handleAnswer = (sudahPunya: boolean) => {
    onClose();
    if (sudahPunya) {
      const list = getStoredRekening();
      const approvedRek = list.find(
        (r) => r.status === 'approved' && r.email.toLowerCase() === userEmail.toLowerCase()
      );

      if (approvedRek) {
        alert('Anda sudah memiliki rekening Sanabil Bank yang disetujui. Membuka perbankan...');
        onNavigateToBank();
      } else {
        alert('Rekening Anda belum disetujui atau belum terdaftar. Silakan isi formulir pembuatan rekening.');
        onOpenBuatRekening();
      }
    } else {
      onOpenBuatRekening();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-4">
          <HelpCircle className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Pertanyaan Wajib</h3>
        <p className="text-gray-600 text-sm text-center mb-6 leading-relaxed">
          Apakah Anda sudah memiliki Rekening Arab Saudi resmi (<strong>Sanabil Bank</strong>)?
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleAnswer(true)}
            className="bg-emerald-800 text-white font-bold py-2.5 px-4 rounded-xl hover:bg-emerald-900 transition shadow-sm"
          >
            Sudah Punya
          </button>
          <button
            onClick={() => handleAnswer(false)}
            className="bg-red-600 text-white font-bold py-2.5 px-4 rounded-xl hover:bg-red-700 transition shadow-sm"
          >
            Belum Punya
          </button>
        </div>
      </div>
    </div>
  );
};
