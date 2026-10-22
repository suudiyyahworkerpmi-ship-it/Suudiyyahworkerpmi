import React, { useState } from 'react';
import { X, QrCode, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Rekening, AntrianDeposit } from '../../types';
import {
  getStoredAntrian,
  saveAntrian,
  formatIDR,
  formatMoney,
  generateRefCode,
  getStoredRekening,
  saveRekening,
} from '../../services/storage';

interface DepositModalProps {
  isOpen: boolean;
  rekening: Rekening | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  rekening,
  onClose,
  onSuccess,
}) => {
  const [jumlah, setJumlah] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !rekening) return null;

  const numJumlah = parseFloat(jumlah) || 0;
  const estimasiIDR = numJumlah * 4300;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numJumlah <= 0) {
      alert('Jumlah deposit tidak valid.');
      return;
    }

    setIsSubmitting(true);

    const txId = `TX-DEP-${Date.now()}`;
    const refCode = generateRefCode('DEP');
    const nowStr = new Date().toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const antrian = getStoredAntrian();
    const newEntry: AntrianDeposit = {
      id: Date.now(),
      rekId: rekening.id,
      email: rekening.email,
      nama: rekening.nama,
      noRek: rekening.noRek,
      jumlah: numJumlah,
      status: 'pending',
      tanggal: nowStr,
      jenis: 'deposit',
      txId,
      refCode,
    };

    antrian.unshift(newEntry);
    saveAntrian(antrian);

    // Record pending transaction in member's account history
    const list = getStoredRekening();
    const currentRek = list.find((r) => r.id === rekening.id);
    if (currentRek) {
      currentRek.transaksi = currentRek.transaksi || [];
      currentRek.transaksi.unshift({
        id: txId,
        tanggal: nowStr,
        jenis: 'Deposit',
        nama: rekening.nama,
        ket: 'Setoran Tunai QRIS (Menunggu Persetujuan Admin)',
        jumlah: `+ ${formatMoney(numJumlah)}`,
        amountNumeric: numJumlah,
        tipe: 'kredit',
        status: 'pending',
        refCode,
      });
      saveRekening(list);
    }

    setIsSubmitting(false);
    setJumlah('');
    onClose();
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl my-8 relative animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Deposit via QRIS Resmi</h3>
              <p className="text-xs text-gray-500">Sanabil Bank Syariah Gateway</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QRIS Image display */}
        <div className="bg-white border-2 border-emerald-700/20 rounded-xl p-3 mb-4 shadow-sm text-center">
          <img
            src="https://i.ibb.co.com/ZRTSs6r0/Kode-QRIS-windah-ananda-Pulsa-Internet.jpg"
            alt="Kode QRIS Resmi"
            className="w-full max-h-[300px] object-contain rounded-lg mx-auto"
          />
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 mb-4 text-xs text-gray-600 leading-relaxed space-y-1">
          <p className="font-semibold text-gray-900 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            Petunjuk Pembayaran:
          </p>
          <p>1. Pindai (scan) QRIS di atas melalui BCA, Mandiri, BRI, BNI, GoPay, OVO, Dana, atau ShopeePay.</p>
          <p>2. Masukkan nominal rupiah sesuai estimasi di bawah.</p>
          <p>3. Masukkan jumlah nominal SAR dan klik "Pembayaran Selesai".</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Jumlah Deposit (SAR) *
            </label>
            <input
              required
              type="number"
              min="1"
              step="0.01"
              value={jumlah}
              onChange={(e) => setJumlah(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
              placeholder="Contoh: 3000 atau 3999.80"
            />
            <p className="text-[11px] text-gray-500 mt-1">Kurs Konversi: 1 SAR = 4.300 IDR</p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 font-semibold flex items-center justify-between">
            <span>Estimasi Pembayaran Rupiah:</span>
            <span className="text-sm font-extrabold text-emerald-800">{formatIDR(estimasiIDR)}</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || numJumlah <= 0}
            className="w-full bg-emerald-800 text-white font-bold py-3 rounded-lg hover:bg-emerald-900 transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Pembayaran Selesai</span>
          </button>
        </form>
      </div>
    </div>
  );
};

interface NotifDepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotifDepositModal: React.FC<NotifDepositModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl text-center relative animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4 text-3xl font-extrabold shadow-inner">
          !
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">Deposit Sedang Diajukan</h3>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          Silakan tunggu beberapa saat. Tim verifikator Sanabil Bank sedang memverifikasi setoran deposit Anda.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 mb-6 text-left leading-relaxed">
          <p className="font-semibold mb-1">Status Antrian Sistem:</p>
          <p>
            Deposit Anda saat ini sedang dalam antrian verifikasi. Karena tingginya volume ribuan transaksi harian pendaftaran loker Madinah, mohon tunggu beberapa saat hingga admin menyetujui mutasi saldo Anda.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-emerald-800 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-emerald-900 transition shadow cursor-pointer"
        >
          Mengerti & Lihat Rekening
        </button>
      </div>
    </div>
  );
};

interface TutupAkunModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const TutupAkunModal: React.FC<TutupAkunModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4 text-3xl font-extrabold shadow-inner">
          !
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Tutup Akun Sanabil Bank</h3>
        <p className="text-sm text-gray-600 mb-4 text-center leading-relaxed">
          Apakah Anda yakin ingin menutup rekening Sanabil Bank Anda? Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
        </p>

        <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 text-xs text-red-900 mb-6 leading-relaxed">
          <p className="font-bold mb-1">Konsekuensi penutupan akun:</p>
          <ul className="list-disc ml-4 space-y-1">
            <li>Saldo di dalam rekening akan dibekukan / dikosongkan.</li>
            <li>Seluruh riwayat mutasi transaksi akan dihapus dari sistem perbankan.</li>
            <li>Anda harus mendaftar rekening baru dari awal untuk memenuhi syarat melamar loker.</li>
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            className="bg-gray-100 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-200 transition"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white font-bold py-2.5 rounded-lg hover:bg-red-700 transition shadow"
          >
            Ya, Tutup Akun
          </button>
        </div>
      </div>
    </div>
  );
};
