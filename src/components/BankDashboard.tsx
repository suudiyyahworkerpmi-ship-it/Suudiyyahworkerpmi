import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Download,
  AlertTriangle,
  Building,
  CheckCircle2,
  Clock,
  ShieldCheck,
  CreditCard,
  FileText,
  Printer,
  XCircle,
} from 'lucide-react';
import { Rekening, BankTransaction } from '../types';
import {
  formatMoney,
  saveRekening,
  getStoredRekening,
  getStoredAntrian,
  saveAntrian,
  generateRefCode,
  getMemberByEmail,
} from '../services/storage';
import { DepositModal, NotifDepositModal, TutupAkunModal } from './modals/BankingModals';
import { RekeningKoranModal } from './modals/RekeningKoranModal';
import { FlagIndonesia, FlagSaudiArabia } from './Flags';

interface BankDashboardProps {
  currentEmail: string;
  onBackToMember: () => void;
  onAccountClosed: () => void;
  onRefreshData: () => void;
}

export const BankDashboard: React.FC<BankDashboardProps> = ({
  currentEmail,
  onBackToMember,
  onAccountClosed,
  onRefreshData,
}) => {
  const [depositOpen, setDepositOpen] = useState(false);
  const [notifDepositOpen, setNotifDepositOpen] = useState(false);
  const [tutupAkunOpen, setTutupAkunOpen] = useState(false);
  const [rekeningKoranOpen, setRekeningKoranOpen] = useState(false);

  // Transfer Modal Dialog state
  const [transferOpen, setTransferOpen] = useState(false);
  const [targetBank, setTargetBank] = useState('Sanabil Bank');
  const [targetRek, setTargetRek] = useState('');
  const [targetName, setTargetName] = useState('');
  const [transferNotes, setTransferNotes] = useState('');
  const [transferAmount, setTransferAmount] = useState('');

  // Exchange Modal Dialog state
  const [exchangeOpen, setExchangeOpen] = useState(false);
  const [exchangeAmount, setExchangeAmount] = useState('');
  const [targetCurrency, setTargetCurrency] = useState<'USD' | 'IDR'>('IDR');

  const rekenings = getStoredRekening();
  const rekening = rekenings.find(
    (r) => r.email.toLowerCase() === currentEmail.toLowerCase() && r.status === 'approved'
  );

  const member = rekening ? getMemberByEmail(rekening.email) : undefined;

  const antrian = getStoredAntrian();
  const pendingDeposits = rekening
    ? antrian.filter((a) => a.rekId === rekening.id && a.status === 'pending')
    : [];

  if (!rekening) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
          <p className="text-base font-bold text-gray-800 mb-2">Rekening Belum Disetujui</p>
          <p className="text-xs text-gray-500 mb-4">
            Anda belum memiliki rekening Sanabil Bank yang berstatus aktif atau rekening sedang dalam proses verifikasi.
          </p>
          <button
            onClick={onBackToMember}
            className="bg-emerald-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer"
          >
            Kembali ke Dashboard Member
          </button>
        </div>
      </div>
    );
  }

  const updateRekeningState = (updated: Rekening) => {
    const list = getStoredRekening();
    const idx = list.findIndex((x) => x.id === updated.id);
    if (idx !== -1) {
      list[idx] = updated;
      saveRekening(list);
      onRefreshData();
    }
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(transferAmount);
    const trimmedTarget = targetRek.trim();
    if (!trimmedTarget) {
      alert('Masukkan nomor rekening tujuan.');
      return;
    }
    if (targetBank === 'Sanabil Bank' && trimmedTarget.toUpperCase() === rekening.noRek.toUpperCase()) {
      alert('Tidak dapat melakukan transfer ke nomor rekening sendiri.');
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      alert('Jumlah transfer tidak valid.');
      return;
    }
    if (amount > (rekening.saldo || 0)) {
      alert('Saldo rekening Anda tidak mencukupi untuk transfer ini.');
      return;
    }

    const newSaldo = (rekening.saldo || 0) - amount;
    const nowStr = new Date().toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const txId = `TX-TRF-${Date.now()}`;
    const refCode = generateRefCode('TRF');

    const newTx: BankTransaction = {
      id: txId,
      tanggal: nowStr,
      jenis: 'Transfer Keluar',
      nama: targetName ? `${targetName} (${trimmedTarget})` : trimmedTarget,
      ket: `Transfer ke ${targetBank} ${trimmedTarget} a.n ${targetName || trimmedTarget} - ${transferNotes || 'Pengiriman Dana'} (Menunggu Persetujuan Admin)`,
      jumlah: `- ${formatMoney(amount)}`,
      amountNumeric: amount,
      tipe: 'debit',
      status: 'pending',
      refCode,
      bankTujuan: targetBank,
      rekeningTujuan: trimmedTarget,
    };

    // Hold/deduct balance and record pending transaction in sender account
    const list = getStoredRekening();
    const senderIdx = list.findIndex((x) => x.id === rekening.id);
    if (senderIdx !== -1) {
      list[senderIdx].saldo = newSaldo;
      list[senderIdx].transaksi = [newTx, ...(list[senderIdx].transaksi || [])];
    }
    saveRekening(list);

    // Add to unified admin verification queue
    const queue = getStoredAntrian();
    queue.unshift({
      id: Date.now(),
      rekId: rekening.id,
      email: rekening.email,
      nama: rekening.nama,
      noRek: rekening.noRek,
      jumlah: amount,
      status: 'pending',
      tanggal: nowStr,
      jenis: 'transfer',
      bankTujuan: targetBank,
      rekTujuan: trimmedTarget,
      namaPenerima: targetName || trimmedTarget,
      berita: transferNotes || 'Pengiriman Dana',
      txId,
      refCode,
    });
    saveAntrian(queue);

    onRefreshData();
    setTransferOpen(false);
    setTargetRek('');
    setTargetName('');
    setTransferNotes('');
    setTransferAmount('');
    alert(
      `Pengajuan transfer berhasil dikirim!\n\nJumlah: ${formatMoney(amount)}\nTujuan: ${targetBank} - ${trimmedTarget} (a.n ${targetName || trimmedTarget})\nStatus: Menunggu Persetujuan Admin\n\nSaldo Anda telah dipotong sementara dan akan dibukukan sah ke mutasi rekening setelah disetujui oleh Administrator.`
    );
  };

  const handleExchangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(exchangeAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Jumlah penukaran tidak valid.');
      return;
    }
    if (amount > (rekening.saldo || 0)) {
      alert('Saldo rekening Anda tidak mencukupi untuk penukaran ini.');
      return;
    }

    const hasil =
      targetCurrency === 'IDR'
        ? amount * 4300
        : targetCurrency === 'USD'
        ? amount / 3.75
        : amount;

    const newSaldo = (rekening.saldo || 0) - amount;
    const nowStr = new Date().toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const refCode = generateRefCode('EXC');
    const newTx: BankTransaction = {
      id: `TX-EXC-${Date.now()}`,
      tanggal: nowStr,
      jenis: 'Exchange',
      nama: rekening.nama,
      ket: `Konversi Valas ke ${targetCurrency} (${targetCurrency} ${hasil.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`,
      jumlah: `- ${formatMoney(amount)}`,
      amountNumeric: amount,
      tipe: 'debit',
      status: 'approved',
      refCode,
      saldoBerjalan: newSaldo,
      disetujuiOleh: 'Sistem Valuta Sanabil Bank',
      waktuPersetujuan: nowStr,
    };

    const updated: Rekening = {
      ...rekening,
      saldo: newSaldo,
      transaksi: [newTx, ...(rekening.transaksi || [])],
    };

    updateRekeningState(updated);
    setExchangeOpen(false);
    setExchangeAmount('');
    alert(
      `Exchange berhasil!\nSumber: ${formatMoney(amount)}\nHasil Penukaran: ${targetCurrency} ${hasil.toLocaleString(
        'id-ID',
        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
      )}`
    );
  };

  const handleConfirmCloseAccount = () => {
    const list = getStoredRekening();
    const filtered = list.filter((x) => x.id !== rekening.id);
    saveRekening(filtered);
    setTutupAkunOpen(false);
    alert('Rekening Sanabil Bank Anda telah ditutup.\nAnda harus membuat rekening baru untuk melamar kerja.');
    onAccountClosed();
  };

  return (
    <div className="py-8 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        {/* Top Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-900 text-brand-gold flex items-center justify-center font-bold text-xl shadow-md border border-emerald-700">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black text-gray-900">
                  Sanabil Bank Syariah
                </h1>
                <div className="hidden sm:flex items-center gap-1 bg-emerald-900/10 px-2 py-0.5 rounded border border-emerald-900/20">
                  <FlagIndonesia className="w-3.5 h-2.5 rounded-xs" />
                  <FlagSaudiArabia className="w-3.5 h-2.5 rounded-xs" />
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Layanan Perbankan Ketenagakerjaan Resmi Anwar Al Madinah Mövenpick Hotel
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setRekeningKoranOpen(true)}
              className="bg-brand-gold hover:bg-yellow-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Rekening Koran Resmi</span>
            </button>

            <button
              onClick={onBackToMember}
              className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Akun</span>
            </button>
          </div>
        </div>

        {/* Pending Deposit Notification Banner */}
        {pendingDeposits.length > 0 && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-start gap-3 shadow-xs">
            <Clock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900">
              <p className="font-bold text-sm">
                Ada {pendingDeposits.length} Transaksi Menunggu Persetujuan Admin
              </p>
              <p className="mt-0.5">
                Pengajuan setoran deposit QRIS / transfer Anda saat ini sedang diverifikasi oleh Administrator Sanabil Bank. Saldo dan bukti mutasi akan aktif sah setelah disetujui.
              </p>
            </div>
          </div>
        )}

        {/* Digital Bank Card & Account Info */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Virtual ATM Card */}
          <div className="md:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-tr from-emerald-950 via-emerald-900 to-black p-6 md:p-8 text-white shadow-xl border border-brand-gold/40">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-44 h-44 rounded-full bg-brand-gold/10 blur-2xl pointer-events-none" />

            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-gold text-emerald-950 flex items-center justify-center font-bold text-lg shadow">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-extrabold text-sm tracking-wider uppercase text-white">
                    SANABIL BANK
                  </p>
                  <p className="text-[10px] text-brand-gold font-semibold">
                    Anwar Al Madinah Mövenpick
                  </p>
                </div>
              </div>

              {/* Bilateral flags badge on card */}
              <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                <FlagIndonesia className="w-4 h-2.5 rounded-xs" />
                <span className="text-[10px] text-white font-bold">KSA-ID</span>
                <FlagSaudiArabia className="w-4 h-2.5 rounded-xs" />
              </div>
            </div>

            <div className="mb-6">
              <p className="text-xs text-emerald-200 uppercase tracking-widest font-semibold mb-1">
                Saldo Utama
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl md:text-4xl font-black text-brand-gold tracking-tight">
                  {formatMoney(rekening.saldo || 0)}
                </span>
                <span className="text-xs text-gray-300 font-medium">SAR (Saudi Riyal)</span>
              </div>
              <p className="text-[11px] text-emerald-300 mt-1">
                Setara: Rp {((rekening.saldo || 0) * 4300).toLocaleString('id-ID')}
              </p>
            </div>

            <div className="flex flex-wrap justify-between items-end gap-4 pt-4 border-t border-white/10 text-xs">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Pemilik Rekening</p>
                <p className="font-bold text-sm tracking-wide text-white mt-0.5">{rekening.nama}</p>
              </div>

              <div className="text-right">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Nomor Rekening</p>
                <p className="font-mono font-bold text-sm text-brand-gold tracking-widest mt-0.5">
                  {rekening.noRek}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Account Profile Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-sm text-gray-900">Status Keuangan PMI</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <p className="text-gray-400">Verifikasi SISKOP2MI</p>
                  <p className="font-bold text-emerald-800 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Terverifikasi & Aktif
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Tipe Rekening</p>
                  <p className="font-semibold text-gray-800 mt-0.5">
                    Tabungan Payroll Hospitality SAR
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Email Terdaftar</p>
                  <p className="font-mono text-gray-800 mt-0.5 truncate">{rekening.email}</p>
                </div>
                <div>
                  <p className="text-gray-400">Tanggal Buka Akun</p>
                  <p className="text-gray-800 mt-0.5">{rekening.tanggal}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100">
              <button
                onClick={() => setRekeningKoranOpen(true)}
                className="w-full bg-emerald-900 hover:bg-emerald-950 text-brand-gold font-bold py-2.5 px-3 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Rekening Koran (PDF)</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Quick Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => setDepositOpen(true)}
            className="bg-white border border-gray-200 rounded-2xl p-5 text-center hover:border-emerald-700 hover:shadow-md transition group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition">
              <ArrowDownLeft className="w-6 h-6 text-emerald-800" />
            </div>
            <p className="font-bold text-sm text-gray-900">Deposit</p>
            <p className="text-[11px] text-gray-500 mt-0.5">Isi saldo via QRIS</p>
          </button>

          <button
            onClick={() => setTransferOpen(true)}
            className="bg-white border border-gray-200 rounded-2xl p-5 text-center hover:border-emerald-700 hover:shadow-md transition group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition">
              <ArrowUpRight className="w-6 h-6 text-blue-800" />
            </div>
            <p className="font-bold text-sm text-gray-900">Transfer</p>
            <p className="text-[11px] text-gray-500 mt-0.5">Kirim ke rekening lain</p>
          </button>

          <button
            onClick={() => setExchangeOpen(true)}
            className="bg-white border border-gray-200 rounded-2xl p-5 text-center hover:border-emerald-700 hover:shadow-md transition group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition">
              <RefreshCw className="w-6 h-6 text-amber-800" />
            </div>
            <p className="font-bold text-sm text-gray-900">Exchange</p>
            <p className="text-[11px] text-gray-500 mt-0.5">Tukar kurs USD/IDR</p>
          </button>

          <button
            onClick={() => setRekeningKoranOpen(true)}
            className="bg-white border border-gray-200 rounded-2xl p-5 text-center hover:border-brand-gold hover:shadow-md transition group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-yellow-100 text-brand-gold flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition">
              <FileText className="w-6 h-6 text-brand-gold" />
            </div>
            <p className="font-bold text-sm text-gray-900">Rekening Koran</p>
            <p className="text-[11px] text-gray-500 mt-0.5">Cetak & Unduh Resmi</p>
          </button>
        </div>

        {/* Transaction History Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
          <div className="p-5 border-b border-gray-100 flex flex-wrap justify-between items-center gap-3">
            <div>
              <h3 className="font-bold text-base text-gray-900">Riwayat Mutasi Transaksi</h3>
              <p className="text-xs text-gray-500">
                Pencatatan resmi seluruh saldo masuk dan keluar atas persetujuan Administrator
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setRekeningKoranOpen(true)}
                className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Lihat Rekening Koran</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-700 border-b border-gray-100">
                <tr>
                  <th className="p-3 text-left text-xs font-bold">Tanggal & Jam</th>
                  <th className="p-3 text-left text-xs font-bold">No. Referensi</th>
                  <th className="p-3 text-left text-xs font-bold">Jenis</th>
                  <th className="p-3 text-left text-xs font-bold">Keterangan</th>
                  <th className="p-3 text-center text-xs font-bold">Persetujuan Admin</th>
                  <th className="p-3 text-right text-xs font-bold">Jumlah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {!rekening.transaksi || rekening.transaksi.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-gray-400 py-8 text-xs">
                      Belum ada riwayat transaksi pada rekening ini.
                    </td>
                  </tr>
                ) : (
                  rekening.transaksi.map((t, idx) => {
                    const isPositive = t.jumlah.startsWith('+') || t.tipe === 'kredit';
                    const isApproved = t.status === 'approved' || !t.status;
                    const isPending = t.status === 'pending';

                    return (
                      <tr key={idx} className="hover:bg-gray-50/80 transition">
                        <td className="p-3 text-xs text-gray-600 whitespace-nowrap font-mono text-[11px]">
                          {t.tanggal}
                        </td>
                        <td className="p-3 text-xs font-mono text-gray-500 whitespace-nowrap text-[11px]">
                          {t.refCode || t.id || `TRX-${idx + 1}`}
                        </td>
                        <td className="p-3 text-xs font-semibold whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              t.jenis === 'Deposit'
                                ? 'bg-emerald-100 text-emerald-800'
                                : t.jenis === 'Transfer' || t.jenis === 'Transfer Keluar'
                                ? 'bg-blue-100 text-blue-800'
                                : t.jenis === 'Transfer Masuk'
                                ? 'bg-teal-100 text-teal-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {t.jenis}
                          </span>
                        </td>
                        <td className="p-3 text-xs text-gray-700">
                          <p className="font-medium">{t.ket}</p>
                          {t.disetujuiOleh && isApproved && (
                            <p className="text-[10px] text-gray-400">
                              Otorisasi: {t.disetujuiOleh} ({t.waktuPersetujuan || t.tanggal})
                            </p>
                          )}
                        </td>
                        <td className="p-3 text-center whitespace-nowrap">
                          {isApproved ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                              <span>Disetujui Admin</span>
                            </span>
                          ) : isPending ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                              <Clock className="w-3 h-3 text-amber-700" />
                              <span>Menunggu Persetujuan</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded-full">
                              <XCircle className="w-3 h-3 text-red-700" />
                              <span>Ditolak Admin</span>
                            </span>
                          )}
                        </td>
                        <td
                          className={`p-3 text-xs text-right font-bold whitespace-nowrap font-mono ${
                            isPositive ? 'text-emerald-700 font-extrabold' : 'text-red-600'
                          }`}
                        >
                          {t.jumlah}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl p-6 border border-red-200 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-red-700">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-bold text-base">Zona Berbahaya</h3>
          </div>
          <p className="text-xs text-gray-600 mb-4 leading-relaxed">
            Menutup rekening Sanabil Bank akan menghapus saldo dan nomor rekening Anda secara permanen. Anda perlu mendaftar ulang jika ingin melamar posisi lowongan.
          </p>
          <button
            onClick={() => setTutupAkunOpen(true)}
            className="bg-red-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-red-700 transition shadow cursor-pointer"
          >
            Tutup Akun Sanabil Bank Sekarang
          </button>
        </div>
      </div>

      {/* Modals for Banking Operations */}
      <DepositModal
        isOpen={depositOpen}
        rekening={rekening}
        onClose={() => setDepositOpen(false)}
        onSuccess={() => {
          onRefreshData();
          setNotifDepositOpen(true);
        }}
      />

      <NotifDepositModal
        isOpen={notifDepositOpen}
        onClose={() => setNotifDepositOpen(false)}
      />

      <TutupAkunModal
        isOpen={tutupAkunOpen}
        onClose={() => setTutupAkunOpen(false)}
        onConfirm={handleConfirmCloseAccount}
      />

      {/* Official Rekening Koran / Bank Statement Modal */}
      <RekeningKoranModal
        isOpen={rekeningKoranOpen}
        rekening={rekening}
        member={member}
        onClose={() => setRekeningKoranOpen(false)}
      />

      {/* Interactive Transfer Modal Dialog */}
      {transferOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Transfer Dana Keluar</h3>
                  <p className="text-[11px] text-gray-500">Wajib persetujuan Administrator</p>
                </div>
              </div>
              <button
                onClick={() => setTransferOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleTransferSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Bank Tujuan *
                </label>
                <select
                  value={targetBank}
                  onChange={(e) => setTargetBank(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-700 bg-white"
                >
                  <option value="Sanabil Bank">Sanabil Bank Syariah (Sesama Member)</option>
                  <option value="Bank Mandiri">Bank Mandiri (Indonesia)</option>
                  <option value="Bank BCA">Bank BCA (Indonesia)</option>
                  <option value="Bank BRI">Bank BRI (Indonesia)</option>
                  <option value="Bank BNI">Bank BNI (Indonesia)</option>
                  <option value="Bank BSI">Bank Syariah Indonesia (BSI)</option>
                  <option value="Al Rajhi Bank">Al Rajhi Bank (Arab Saudi)</option>
                  <option value="Saudi National Bank">Saudi National Bank / SNB (Arab Saudi)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nomor Rekening Tujuan *
                </label>
                <input
                  required
                  type="text"
                  value={targetRek}
                  onChange={(e) => setTargetRek(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-700"
                  placeholder="Contoh: SNB-782910482 atau 1400012345678"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nama Pemilik Rekening Penerima
                </label>
                <input
                  type="text"
                  value={targetName}
                  onChange={(e) => setTargetName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-700"
                  placeholder="Nama lengkap penerima"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Jumlah Transfer (SAR) *
                </label>
                <input
                  required
                  type="number"
                  min="1"
                  step="0.01"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-700"
                  placeholder="Contoh: 500"
                />
                <div className="flex justify-between items-center text-[11px] text-gray-500 mt-1">
                  <span>
                    Saldo Tersedia: <strong>{formatMoney(rekening.saldo || 0)}</strong>
                  </span>
                  {parseFloat(transferAmount) > 0 && (
                    <span className="text-emerald-700 font-semibold">
                      ≈ Rp {(parseFloat(transferAmount) * 4300).toLocaleString('id-ID')}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Berita Acara / Catatan Transfer
                </label>
                <input
                  type="text"
                  value={transferNotes}
                  onChange={(e) => setTransferNotes(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-700"
                  placeholder="Contoh: Pengiriman nafkah keluarga / biaya visa"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-900 leading-relaxed">
                <p className="font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                  Persetujuan Administrator:
                </p>
                <p className="mt-0.5">
                  Demi kepatuhan regulasi SISKOP2MI, pengajuan transfer ini akan diverifikasi oleh Admin. Saldo rekening Anda akan dibukukan sah setelah disetujui.
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-700 text-white font-bold py-2.5 rounded-lg hover:bg-blue-800 transition mt-2 shadow cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>Kirim Pengajuan Transfer</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Interactive Currency Exchange Modal Dialog */}
      {exchangeOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Exchange / Konversi Mata Uang</h3>
              <button
                onClick={() => setExchangeOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleExchangeSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Tukar Ke Mata Uang
                </label>
                <select
                  value={targetCurrency}
                  onChange={(e) => setTargetCurrency(e.target.value as 'USD' | 'IDR')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="IDR">IDR - Rupiah Indonesia (Kurs: 1 SAR ≈ Rp 4.300)</option>
                  <option value="USD">USD - Dolar Amerika (Kurs: 1 USD ≈ 3.75 SAR)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Jumlah SAR yang Ingin Ditukar
                </label>
                <input
                  required
                  type="number"
                  min="1"
                  step="0.01"
                  value={exchangeAmount}
                  onChange={(e) => setExchangeAmount(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-700"
                  placeholder="Contoh: 1000"
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  Saldo Tersedia: <strong>{formatMoney(rekening.saldo || 0)}</strong>
                </p>
              </div>

              {parseFloat(exchangeAmount) > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                  <p className="font-semibold">Perkiraan Hasil Simulasi:</p>
                  <p className="text-sm font-bold mt-1">
                    {targetCurrency}{' '}
                    {(
                      targetCurrency === 'IDR'
                        ? parseFloat(exchangeAmount) * 4300
                        : parseFloat(exchangeAmount) / 3.75
                    ).toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-amber-600 text-white font-bold py-2.5 rounded-lg hover:bg-amber-700 transition mt-2 shadow cursor-pointer"
              >
                Konfirmasi Penukaran
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
