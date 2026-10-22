import React, { useState } from 'react';
import {
  ShieldAlert,
  LogOut,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  PlusCircle,
  Eye,
  ArrowLeft,
  X,
  CreditCard,
  FileCheck,
} from 'lucide-react';
import { Rekening, AntrianDeposit, AdminRiwayatSaldo } from '../types';
import {
  formatMoney,
  getStoredRekening,
  saveRekening,
  getStoredAntrian,
  saveAntrian,
  getStoredAdminRiwayat,
  saveAdminRiwayat,
} from '../services/storage';
import { FlagIndonesia, FlagSaudiArabia } from './Flags';

interface AdminDashboardProps {
  onLogout: () => void;
  onNavigateHome: () => void;
  onRefreshData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onLogout,
  onNavigateHome,
  onRefreshData,
}) => {
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [topupAmount, setTopupAmount] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<{ src: string; title: string } | null>(null);

  const rekeningList = getStoredRekening();
  const antrianList = getStoredAntrian();
  const adminRiwayatList = getStoredAdminRiwayat();

  // Statistics
  const totalPermohonan = rekeningList.length;
  const pendingCount = rekeningList.filter((r) => r.status === 'pending').length;
  const approvedCount = rekeningList.filter((r) => r.status === 'approved').length;
  const rejectedCount = rekeningList.filter((r) => r.status === 'rejected').length;

  const approvedMembers = rekeningList.filter((r) => r.status === 'approved' && r.email);
  const selectedMember = rekeningList.find((r) => r.id === selectedMemberId);

  // Approve Account
  const handleApproveRekening = (id: number) => {
    const list = getStoredRekening();
    const target = list.find((r) => r.id === id);
    if (target) {
      target.status = 'approved';
      saveRekening(list);
      onRefreshData();
      alert(`Rekening ${target.nama} (${target.noRek}) berhasil disetujui!`);
    }
  };

  // Reject Account
  const handleRejectRekening = (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menolak permohonan rekening ini?')) return;
    const list = getStoredRekening();
    const target = list.find((r) => r.id === id);
    if (target) {
      target.status = 'rejected';
      saveRekening(list);
      onRefreshData();
    }
  };

  // Verify Transaction (Deposit or Transfer) in Queue
  const handleVerifyTransaction = (id: number) => {
    const antrian = getStoredAntrian();
    const item = antrian.find((a) => a.id === id);
    if (!item) return;

    const list = getStoredRekening();
    const rek = list.find((r) => r.id === item.rekId);
    if (!rek) {
      alert('Rekening target tidak ditemukan.');
      return;
    }

    const nowStr = new Date().toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    if (item.jenis === 'transfer') {
      // Transfer approval
      rek.transaksi = rek.transaksi || [];
      const tx = rek.transaksi.find((t) => t.id === item.txId || t.refCode === item.refCode);
      if (tx) {
        tx.status = 'approved';
        tx.ket = `Transfer ke ${item.bankTujuan || 'Bank'} ${item.rekTujuan} a.n ${item.namaPenerima || item.rekTujuan} - ${item.berita || 'Pengiriman Dana'} (Disetujui Admin)`;
        tx.saldoBerjalan = rek.saldo;
        tx.disetujuiOleh = 'Admin (berkahkita937@gmail.com)';
        tx.waktuPersetujuan = nowStr;
      }

      // If destination is in Sanabil Bank, credit recipient
      if (item.rekTujuan) {
        const recipient = list.find(
          (r) => r.noRek.toUpperCase() === item.rekTujuan!.trim().toUpperCase()
        );
        if (recipient) {
          recipient.saldo = (recipient.saldo || 0) + item.jumlah;
          recipient.transaksi = recipient.transaksi || [];
          recipient.transaksi.unshift({
            id: `TX-IN-${Date.now()}`,
            tanggal: nowStr,
            jenis: 'Transfer Masuk',
            nama: rek.nama,
            ket: `Transfer Masuk dari ${rek.nama} (${rek.noRek}) - ${item.berita || 'Pengiriman Dana'} (Disetujui Admin)`,
            jumlah: `+ ${formatMoney(item.jumlah)}`,
            amountNumeric: item.jumlah,
            tipe: 'kredit',
            status: 'approved',
            refCode: item.refCode || `REF-TRF-${Date.now()}`,
            saldoBerjalan: recipient.saldo,
            disetujuiOleh: 'Admin (berkahkita937@gmail.com)',
            waktuPersetujuan: nowStr,
          });
        }
      }

      item.status = 'verified';
      saveAntrian(antrian);
      saveRekening(list);
      onRefreshData();
      alert(`Transfer sebesar ${formatMoney(item.jumlah)} dari ${rek.nama} berhasil disetujui dan diproses.`);
    } else {
      // Deposit approval
      rek.saldo = (rek.saldo || 0) + item.jumlah;
      rek.transaksi = rek.transaksi || [];

      const existingTx = rek.transaksi.find((t) => t.id === item.txId || t.refCode === item.refCode);
      if (existingTx) {
        existingTx.status = 'approved';
        existingTx.ket = 'Setoran Tunai QRIS Resmi (Disetujui Admin)';
        existingTx.saldoBerjalan = rek.saldo;
        existingTx.disetujuiOleh = 'Admin (berkahkita937@gmail.com)';
        existingTx.waktuPersetujuan = nowStr;
      } else {
        rek.transaksi.unshift({
          id: item.txId || `TX-DEP-${Date.now()}`,
          tanggal: nowStr,
          jenis: 'Deposit',
          nama: rek.nama,
          ket: 'Setoran Tunai QRIS Resmi (Disetujui Admin)',
          jumlah: `+ ${formatMoney(item.jumlah)}`,
          amountNumeric: item.jumlah,
          tipe: 'kredit',
          status: 'approved',
          refCode: item.refCode || `REF-DEP-${Date.now()}`,
          saldoBerjalan: rek.saldo,
          disetujuiOleh: 'Admin (berkahkita937@gmail.com)',
          waktuPersetujuan: nowStr,
        });
      }

      item.status = 'verified';
      saveAntrian(antrian);
      saveRekening(list);
      onRefreshData();
      alert(`Deposit sebesar ${formatMoney(item.jumlah)} untuk ${item.nama} telah berhasil diverifikasi dan disetujui.`);
    }
  };

  // Reject Transaction
  const handleRejectTransaction = (id: number) => {
    if (!confirm('Yakin ingin menolak pengajuan transaksi ini?')) return;
    const antrian = getStoredAntrian();
    const item = antrian.find((a) => a.id === id);
    if (!item) return;

    const list = getStoredRekening();
    const rek = list.find((r) => r.id === item.rekId);

    if (rek) {
      if (item.jenis === 'transfer') {
        // Refund the held amount
        rek.saldo = (rek.saldo || 0) + item.jumlah;
        rek.transaksi = rek.transaksi || [];
        const tx = rek.transaksi.find((t) => t.id === item.txId || t.refCode === item.refCode);
        if (tx) {
          tx.status = 'rejected';
          tx.ket = `Transfer ke ${item.rekTujuan} Ditolak Admin (Saldo dikembalikan)`;
          tx.saldoBerjalan = rek.saldo;
        }
      } else {
        // Deposit rejected
        rek.transaksi = rek.transaksi || [];
        const tx = rek.transaksi.find((t) => t.id === item.txId || t.refCode === item.refCode);
        if (tx) {
          tx.status = 'rejected';
          tx.ket = 'Setoran QRIS Ditolak Admin';
        }
      }
      saveRekening(list);
    }

    item.status = 'rejected';
    saveAntrian(antrian);
    onRefreshData();
    alert('Pengajuan transaksi berhasil ditolak.');
  };

  // Manual Top-Up by Admin
  const handleAdminTopup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId) {
      alert('Pilih member terlebih dahulu.');
      return;
    }

    const amount = parseFloat(topupAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Jumlah saldo tidak valid.');
      return;
    }

    const list = getStoredRekening();
    const m = list.find((x) => x.id === selectedMemberId);
    if (!m) {
      alert('Member tidak ditemukan.');
      return;
    }

    m.saldo = (m.saldo || 0) + amount;
    const nowStr = new Date().toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const refCode = `TOP-${Date.now()}`;
    m.transaksi = m.transaksi || [];
    m.transaksi.unshift({
      id: `TX-TOP-${Date.now()}`,
      tanggal: nowStr,
      jenis: 'Top-Up Admin',
      nama: m.nama,
      ket: 'Top-up Saldo Resmi oleh Administrator (berkahkita937@gmail.com)',
      jumlah: `+ ${formatMoney(amount)}`,
      amountNumeric: amount,
      tipe: 'kredit',
      status: 'approved',
      refCode,
      saldoBerjalan: m.saldo,
      disetujuiOleh: 'Admin (berkahkita937@gmail.com)',
      waktuPersetujuan: nowStr,
    });

    const riwayat = getStoredAdminRiwayat();
    riwayat.unshift({
      tanggal: nowStr,
      email: m.email,
      nama: m.nama,
      jumlah: formatMoney(amount),
      keterangan: 'Top-up Saldo Resmi oleh Administrator',
    });

    saveAdminRiwayat(riwayat);
    saveRekening(list);

    alert(`Berhasil menambahkan saldo sebesar ${formatMoney(amount)} ke rekening ${m.nama} dengan status Disetujui.`);
    setTopupAmount('');
    onRefreshData();
  };

  const pendingTransactions = antrianList.filter((a) => a.status === 'pending');

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Admin Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold shadow">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black text-gray-900">
                  Dashboard Administrator
                </h1>
                <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded font-bold">
                  SUPERUSER
                </span>
                <div className="hidden sm:flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                  <FlagIndonesia className="w-3.5 h-2.5 rounded-xs" />
                  <FlagSaudiArabia className="w-3.5 h-2.5 rounded-xs" />
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Kelola permohonan rekening, antrian deposit, dan top-up saldo member Sanabil Bank
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateHome}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Lihat Halaman Utama</span>
            </button>
            <button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar Admin</span>
            </button>
          </div>
        </div>

        {/* 4 Statistics KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                Total Permohonan
              </p>
              <Users className="w-4 h-4 text-emerald-800" />
            </div>
            <p className="text-3xl font-black text-emerald-950 mt-2">{totalPermohonan}</p>
            <p className="text-[11px] text-gray-400 mt-1">Akun bank diajukan</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Menunggu</p>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-3xl font-black text-amber-600 mt-2">{pendingCount}</p>
            <p className="text-[11px] text-gray-400 mt-1">Perlu tindakan persetujuan</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Disetujui</p>
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-3xl font-black text-green-600 mt-2">{approvedCount}</p>
            <p className="text-[11px] text-gray-400 mt-1">Rekening aktif & siap pakai</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Ditolak</p>
              <XCircle className="w-4 h-4 text-red-600" />
            </div>
            <p className="text-3xl font-black text-red-600 mt-2">{rejectedCount}</p>
            <p className="text-[11px] text-gray-400 mt-1">Berkas tidak memenuhi syarat</p>
          </div>
        </div>

        {/* Permohonan Rekening Sanabil Bank Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div>
              <h3 className="font-bold text-base text-gray-900">
                Permohonan Rekening Sanabil Bank
              </h3>
              <p className="text-xs text-gray-500">
                Verifikasi berkas calon pemegang rekening baru beserta rekam biometrik dan KTP
              </p>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full">
              {rekeningList.length} Pemohon
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-700 text-xs font-bold border-b border-gray-200">
                <tr>
                  <th className="p-3 text-left">No</th>
                  <th className="p-3 text-left">Nama & Email</th>
                  <th className="p-3 text-left">Umur</th>
                  <th className="p-3 text-left">Negara</th>
                  <th className="p-3 text-center">Foto Wajah</th>
                  <th className="p-3 text-center">Foto KTP</th>
                  <th className="p-3 text-left">No. Rekening</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-center">Aksi Verifikasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {rekeningList.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center text-gray-400 py-8">
                      Belum ada permohonan rekening yang masuk.
                    </td>
                  </tr>
                ) : (
                  rekeningList.map((r, i) => (
                    <tr key={r.id} className="hover:bg-gray-50/80 transition">
                      <td className="p-3 font-semibold text-gray-500">{i + 1}</td>
                      <td className="p-3">
                        <p className="font-bold text-gray-900 text-sm">{r.nama}</p>
                        <p className="text-gray-500 text-[11px]">{r.email}</p>
                        <p className="text-gray-400 text-[10px] mt-0.5">{r.alamat}</p>
                      </td>
                      <td className="p-3 font-medium text-gray-700">{r.umur} th</td>
                      <td className="p-3 font-medium text-gray-700">{r.negara}</td>
                      <td className="p-3 text-center">
                        {r.wajah ? (
                          <div className="inline-block relative group">
                            <img
                              src={r.wajah}
                              alt="Wajah"
                              className="w-10 h-10 rounded-lg object-cover border border-emerald-600 shadow cursor-pointer hover:scale-105 transition"
                              onClick={() =>
                                setPreviewImage({ src: r.wajah!, title: `Rekam Wajah: ${r.nama}` })
                              }
                            />
                            <button
                              onClick={() =>
                                setPreviewImage({ src: r.wajah!, title: `Rekam Wajah: ${r.nama}` })
                              }
                              className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center text-white"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        {r.ktp ? (
                          <div className="inline-block relative group">
                            <img
                              src={r.ktp}
                              alt="KTP"
                              className="w-14 h-9 rounded object-cover border border-emerald-600 shadow cursor-pointer hover:scale-105 transition"
                              onClick={() =>
                                setPreviewImage({ src: r.ktp!, title: `Identitas KTP: ${r.nama}` })
                              }
                            />
                            <button
                              onClick={() =>
                                setPreviewImage({ src: r.ktp!, title: `Identitas KTP: ${r.nama}` })
                              }
                              className="absolute inset-0 bg-black/40 rounded opacity-0 group-hover:opacity-100 flex items-center justify-center text-white"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="p-3 font-mono font-bold text-gray-900">{r.noRek}</td>
                      <td className="p-3">
                        <span
                          className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                            r.status === 'approved'
                              ? 'bg-green-100 text-green-800 border border-green-300'
                              : r.status === 'rejected'
                              ? 'bg-red-100 text-red-800 border border-red-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="p-3 text-center whitespace-nowrap">
                        {r.status === 'pending' ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleApproveRekening(r.id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm"
                            >
                              Setujui
                            </button>
                            <button
                              onClick={() => handleRejectRekening(r.id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm"
                            >
                              Tolak
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 font-semibold">Terselesaikan</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Antrian Verifikasi Mutasi & Transaksi (Deposit & Transfer) */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
          <div className="p-5 border-b border-gray-100 bg-amber-50/70 flex flex-wrap justify-between items-center gap-2">
            <div>
              <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-700" />
                <span>Persetujuan Mutasi & Transaksi Keuangan (Deposit & Transfer)</span>
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                Setiap mutasi saldo masuk (deposit QRIS) dan saldo keluar (transfer dana) wajib diverifikasi dan disetujui oleh Administrator sebelum dibukukan sah ke rekening koran nasabah.
              </p>
            </div>
            <span className="text-xs font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-300">
              {pendingTransactions.length} Menunggu Tindakan
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-700 text-xs font-bold border-b border-gray-200">
                <tr>
                  <th className="p-3 text-left">No</th>
                  <th className="p-3 text-left">Tanggal</th>
                  <th className="p-3 text-left">Jenis</th>
                  <th className="p-3 text-left">Pemohon / Pengirim</th>
                  <th className="p-3 text-left">Tujuan & Keterangan</th>
                  <th className="p-3 text-right">Jumlah (SAR)</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-center">Otorisasi Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {pendingTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center text-gray-400 py-8">
                      Tidak ada antrian transaksi yang menunggu persetujuan saat ini.
                    </td>
                  </tr>
                ) : (
                  pendingTransactions.map((a, i) => {
                    const isTransfer = a.jenis === 'transfer';
                    return (
                      <tr key={a.id} className="hover:bg-gray-50/80 transition">
                        <td className="p-3 font-semibold text-gray-500">{i + 1}</td>
                        <td className="p-3 text-gray-600 whitespace-nowrap font-mono text-[11px]">{a.tanggal}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isTransfer
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {isTransfer ? 'Transfer Keluar' : 'Deposit Masuk'}
                          </span>
                        </td>
                        <td className="p-3">
                          <p className="font-bold text-gray-900">{a.nama}</p>
                          <p className="text-gray-500 text-[11px] font-mono">{a.noRek}</p>
                          <p className="text-gray-400 text-[10px]">{a.email}</p>
                        </td>
                        <td className="p-3">
                          {isTransfer ? (
                            <div>
                              <p className="font-semibold text-gray-800">
                                {a.bankTujuan || 'Sanabil Bank'} • <span className="font-mono">{a.rekTujuan}</span>
                              </p>
                              <p className="text-gray-600 text-[11px]">
                                Penerima: <strong>{a.namaPenerima || a.rekTujuan}</strong>
                              </p>
                              {a.berita && (
                                <p className="text-gray-500 text-[10px] italic">"{a.berita}"</p>
                              )}
                            </div>
                          ) : (
                            <div>
                              <p className="font-medium text-gray-800">Setoran Saldo via QRIS Resmi</p>
                              <p className="text-gray-500 text-[10px]">Gateway Sanabil Bank Syariah</p>
                            </div>
                          )}
                        </td>
                        <td className="p-3 text-right font-black text-sm whitespace-nowrap">
                          <span className={isTransfer ? 'text-red-600' : 'text-emerald-800'}>
                            {isTransfer ? '- ' : '+ '}
                            {formatMoney(a.jumlah)}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full text-[10px] border border-amber-300 whitespace-nowrap">
                            MENUNGGU
                          </span>
                        </td>
                        <td className="p-3 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleVerifyTransaction(a.id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
                            >
                              Setujui
                            </button>
                            <button
                              onClick={() => handleRejectTransaction(a.id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
                            >
                              Tolak
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tambah Saldo Member (Direct Balance Injection) */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
          <div className="p-5 border-b border-gray-100 bg-gray-50">
            <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-emerald-800" />
              <span>Tambah Saldo Member (Top-Up Manual Admin)</span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Saldo yang ditambahkan akan otomatis tercatat sebagai "Deposit Setoran Tunai" di riwayat mutasi member.
            </p>
          </div>

          <form onSubmit={handleAdminTopup} className="p-6">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Pilih Member</label>
                <select
                  value={selectedMemberId || ''}
                  onChange={(e) => setSelectedMemberId(e.target.value ? Number(e.target.value) : null)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-700 bg-white"
                >
                  <option value="">-- Pilih Member Sanabil Bank --</option>
                  {approvedMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nama} ({m.email}) - {m.noRek}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Jumlah Tambahan (SAR)
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-700"
                  placeholder="Contoh: 4000"
                />
              </div>
            </div>

            {selectedMember && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4 text-xs text-emerald-950 space-y-1">
                <p>
                  <strong>Nama Member:</strong> {selectedMember.nama}
                </p>
                <p>
                  <strong>Nomor Rekening:</strong> {selectedMember.noRek}
                </p>
                <p>
                  <strong>Saldo Saat Ini:</strong>{' '}
                  <span className="font-extrabold text-sm text-emerald-800">
                    {formatMoney(selectedMember.saldo || 0)}
                  </span>
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={!selectedMemberId || !topupAmount}
              className="bg-emerald-800 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-900 transition shadow disabled:opacity-50"
            >
              Tambah Saldo Member
            </button>
          </form>

          {/* Secret Internal Admin Audit Log */}
          <div className="border-t border-gray-200 p-5 bg-gray-50/80">
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700 mb-3">
              Log Internal Admin (Catatan Mutasi Top-Up)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-gray-200/80 text-gray-700">
                  <tr>
                    <th className="p-2.5 text-left">Tanggal</th>
                    <th className="p-2.5 text-left">Email Member</th>
                    <th className="p-2.5 text-left">Nama</th>
                    <th className="p-2.5 text-right">Jumlah Saldo Ditambahkan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {adminRiwayatList.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center text-gray-400 py-4">
                        Belum ada riwayat top-up manual admin.
                      </td>
                    </tr>
                  ) : (
                    adminRiwayatList.map((r, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="p-2.5 text-gray-600">{r.tanggal}</td>
                        <td className="p-2.5 text-gray-800 font-mono">{r.email}</td>
                        <td className="p-2.5 text-gray-900 font-semibold">{r.nama}</td>
                        <td className="p-2.5 text-right font-black text-emerald-700">{r.jumlah}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl relative">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-bold text-sm text-gray-900">{previewImage.title}</h4>
              <button
                onClick={() => setPreviewImage(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src={previewImage.src}
              alt={previewImage.title}
              className="w-full max-h-[70vh] object-contain rounded-xl border border-gray-200 bg-black/5"
            />
          </div>
        </div>
      )}
    </div>
  );
};
