import React, { useRef } from 'react';
import {
  X,
  Printer,
  Download,
  Building,
  ShieldCheck,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  User,
  CreditCard,
  QrCode,
} from 'lucide-react';
import { Rekening, Member, BankTransaction } from '../../types';
import { formatMoney } from '../../services/storage';
import { FlagIndonesia, FlagSaudiArabia } from '../Flags';

interface RekeningKoranModalProps {
  isOpen: boolean;
  rekening: Rekening;
  member?: Member;
  onClose: () => void;
}

export const RekeningKoranModal: React.FC<RekeningKoranModalProps> = ({
  isOpen,
  rekening,
  member,
  onClose,
}) => {
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const now = new Date();
  const printDateStr = now.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const printTimeStr = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const docNumber = `RK-SNB/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${rekening.noRek.replace(/[^0-9]/g, '').slice(-6) || '892110'}`;

  // Calculate totals from transactions
  const transactions: BankTransaction[] = rekening.transaksi || [];
  
  let totalKredit = 0;
  let totalDebet = 0;
  let approvedCount = 0;

  transactions.forEach((t) => {
    const isApproved = t.status === 'approved' || !t.status;
    if (isApproved) {
      approvedCount += 1;
      const amount = t.amountNumeric || parseFloat(t.jumlah.replace(/[^0-9.-]/g, '')) || 0;
      if (t.jumlah.startsWith('+') || t.tipe === 'kredit') {
        totalKredit += Math.abs(amount);
      } else if (t.jumlah.startsWith('-') || t.tipe === 'debit') {
        totalDebet += Math.abs(amount);
      }
    }
  });

  const saldoAwal = Math.max(0, (rekening.saldo || 0) - totalKredit + totalDebet);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCsv = () => {
    const escapeCsv = (val: unknown) => `"${String(val ?? '').replace(/"/g, '""')}"`;

    let csv = '\uFEFF'; // UTF-8 BOM
    // Header Data Diri
    csv += 'REKENING KORAN / OFFICIAL BANK STATEMENT - SANABIL BANK\n';
    csv += 'ANWAR AL MADINAH MÖVENPICK HOTEL - MADINAH AL MUNAWWARAH KSA\n';
    csv += `Nomor Dokumen,${escapeCsv(docNumber)},Tanggal Cetak,${escapeCsv(`${printDateStr} ${printTimeStr}`)}\n\n`;

    csv += 'DATA PEMILIK REKENING (ACCOUNT HOLDER):\n';
    csv += `Nama Lengkap,${escapeCsv(rekening.nama)}\n`;
    csv += `Nomor Rekening,${escapeCsv(rekening.noRek)}\n`;
    csv += `Email Terdaftar,${escapeCsv(rekening.email)}\n`;
    csv += `Nomor Telepon,${escapeCsv(member?.telepon || '-')}\n`;
    csv += `Nomor NIK / Paspor,${escapeCsv(member?.nik || member?.paspor || '31710' + rekening.id)}\n`;
    csv += `Alamat Domisili,${escapeCsv(rekening.alamat)}\n`;
    csv += `Negara,${escapeCsv(rekening.negara)}\n`;
    csv += `Status Rekening,${escapeCsv('AKTIF - TERVERIFIKASI SISKOP2MI / BP2MI')}\n`;
    csv += `Mata Uang,${escapeCsv(rekening.matauang || 'SAR')}\n\n`;

    csv += 'RINGKASAN SALDO (FINANCIAL SUMMARY):\n';
    csv += `Saldo Awal,${escapeCsv(formatMoney(saldoAwal))}\n`;
    csv += `Total Kredit (Masuk),${escapeCsv(formatMoney(totalKredit))}\n`;
    csv += `Total Debet (Keluar),${escapeCsv(formatMoney(totalDebet))}\n`;
    csv += `Saldo Akhir,${escapeCsv(formatMoney(rekening.saldo || 0))}\n\n`;

    csv += 'MUTASI TRANSAKSI:\n';
    csv += 'No,Tanggal & Jam,No. Referensi,Jenis Transaksi,Keterangan / Lawan Transaksi,Status Otorisasi,Debet (-),Kredit (+),Saldo Berjalan\n';

    transactions.forEach((t, idx) => {
      const isPositive = t.jumlah.startsWith('+') || t.tipe === 'kredit';
      const debetVal = !isPositive ? t.jumlah.replace('-', '').trim() : '-';
      const kreditVal = isPositive ? t.jumlah.replace('+', '').trim() : '-';
      const statusLabel =
        t.status === 'approved' || !t.status
          ? 'Disetujui Admin'
          : t.status === 'pending'
          ? 'Menunggu Persetujuan Admin'
          : 'Ditolak Admin';

      csv += `${idx + 1},${escapeCsv(t.tanggal)},${escapeCsv(t.refCode || t.id || `TRX-${idx + 1}`)},${escapeCsv(
        t.jenis
      )},${escapeCsv(t.ket)},${escapeCsv(statusLabel)},${escapeCsv(debetVal)},${escapeCsv(
        kreditVal
      )},${escapeCsv(t.saldoBerjalan !== undefined ? formatMoney(t.saldoBerjalan) : '-')}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `Rekening-Koran-Sanabil-${rekening.noRek}-${now.toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto backdrop-blur-sm print:p-0 print:bg-white print:static print:inset-auto">
      {/* Container Dialog */}
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl relative my-6 flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:rounded-none print:my-0">
        {/* Modal Top Control Bar (Hidden on print) */}
        <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3 bg-gray-50 rounded-t-2xl print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-900 text-brand-gold flex items-center justify-center shadow">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Rekening Koran & Mutasi Resmi
              </h3>
              <p className="text-xs text-gray-500">
                Dokumen resmi terverifikasi sistem perbankan Sanabil Bank
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-emerald-800 hover:bg-emerald-900 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>

            <button
              onClick={handleDownloadCsv}
              className="bg-brand-gold hover:bg-yellow-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Unduh CSV / Excel</span>
            </button>

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 p-2 rounded-xl hover:bg-gray-200 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Content */}
        <div className="p-6 md:p-8 overflow-y-auto print:overflow-visible print:p-6" ref={printAreaRef}>
          {/* Official Bank Statement Sheet */}
          <div className="border-2 border-emerald-900/40 rounded-xl p-6 md:p-8 bg-white relative print:border-none print:p-0">
            {/* Watermark in background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none print:opacity-[0.04]">
              <div className="text-center rotate-[-30deg]">
                <p className="text-7xl md:text-9xl font-black text-gray-900">SANABIL BANK</p>
                <p className="text-3xl md:text-4xl font-bold tracking-widest text-emerald-900">
                  OFFICIAL STATEMENT
                </p>
              </div>
            </div>

            {/* Letterhead Header */}
            <div className="border-b-2 border-emerald-900 pb-5 mb-6 relative">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-950 text-brand-gold flex items-center justify-center font-bold text-2xl border-2 border-brand-gold shadow-md shrink-0">
                    <Building className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl md:text-2xl font-black tracking-tight text-emerald-950">
                        SANABIL BANK
                      </h1>
                      <span className="text-sm font-arabic font-bold text-brand-gold">
                        بنك السنابل
                      </span>
                    </div>
                    <p className="text-xs font-bold text-gray-700">
                      Corporate Banking Anwar Al Madinah Mövenpick Hotel
                    </p>
                    <p className="text-[11px] text-gray-500">
                      Central District, Bada'ah, P.O. Box 41411 Madinah Al Munawwarah, Kerajaan Arab Saudi
                    </p>
                  </div>
                </div>

                <div className="text-left md:text-right border-t md:border-t-0 pt-2 md:pt-0 border-gray-200">
                  <div className="inline-flex items-center gap-2 mb-1">
                    <FlagIndonesia className="w-5 h-3.5 rounded-xs" />
                    <span className="text-xs font-bold text-gray-700">Bilateral BP2MI - KSA</span>
                    <FlagSaudiArabia className="w-5 h-3.5 rounded-xs" />
                  </div>
                  <p className="text-[11px] text-emerald-800 font-bold flex items-center md:justify-end gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Terverifikasi SISKOP2MI / BP2MI RI</span>
                  </p>
                  <p className="text-[10px] text-gray-500 font-mono">
                    Lisensi Resmi Ketenagakerjaan No: BP2MI/PMI-KSA/2026/088
                  </p>
                </div>
              </div>

              {/* Title & Document Number Banner */}
              <div className="mt-5 pt-3 border-t border-emerald-900/20 flex flex-wrap justify-between items-center gap-2 bg-emerald-900/5 px-4 py-2.5 rounded-lg">
                <div>
                  <h2 className="text-sm md:text-base font-extrabold uppercase tracking-wider text-emerald-950">
                    Rekening Koran / Account Statement
                  </h2>
                  <p className="text-[11px] text-gray-500">
                    Laporan Resmi Riwayat Transaksi & Saldo Nasabah
                  </p>
                </div>
                <div className="text-left md:text-right font-mono text-xs">
                  <p className="text-gray-600">
                    No. Dokumen: <span className="font-bold text-emerald-900">{docNumber}</span>
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Tanggal Cetak: <span className="font-semibold">{printDateStr}, {printTimeStr} WIB</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Box 1: Data Diri Pemilik Rekening (Complete Account Holder Information) */}
            <div className="mb-6 bg-gray-50/70 border border-gray-200 rounded-xl p-4.5">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-950 mb-3 flex items-center gap-1.5 border-b border-gray-200 pb-2">
                <User className="w-4 h-4 text-emerald-800" />
                <span>Identitas Pemilik Rekening (Account Holder Details)</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-xs">
                <div className="flex justify-between border-b border-gray-100 pb-1">
                  <span className="text-gray-500">Nama Lengkap:</span>
                  <span className="font-bold text-gray-900 text-right">{rekening.nama}</span>
                </div>

                <div className="flex justify-between border-b border-gray-100 pb-1">
                  <span className="text-gray-500">Nomor Rekening:</span>
                  <span className="font-mono font-bold text-emerald-900 text-right">{rekening.noRek}</span>
                </div>

                <div className="flex justify-between border-b border-gray-100 pb-1">
                  <span className="text-gray-500">No. Identitas (NIK/Paspor):</span>
                  <span className="font-mono font-semibold text-gray-800 text-right">
                    {member?.nik || member?.paspor || `ID-31710${rekening.id}`}
                  </span>
                </div>

                <div className="flex justify-between border-b border-gray-100 pb-1">
                  <span className="text-gray-500">Alamat Email:</span>
                  <span className="font-semibold text-gray-800 text-right">{rekening.email}</span>
                </div>

                <div className="flex justify-between border-b border-gray-100 pb-1">
                  <span className="text-gray-500">Nomor Telepon/WA:</span>
                  <span className="font-semibold text-gray-800 text-right">
                    {member?.telepon ? `+62 ${member.telepon}` : '+62 812-3456-7890'}
                  </span>
                </div>

                <div className="flex justify-between border-b border-gray-100 pb-1">
                  <span className="text-gray-500">Mata Uang Rekening:</span>
                  <span className="font-bold text-emerald-900 text-right">SAR (Saudi Arabian Riyal)</span>
                </div>

                <div className="flex justify-between border-b border-gray-100 pb-1 md:col-span-2">
                  <span className="text-gray-500 shrink-0">Alamat Domisili:</span>
                  <span className="font-medium text-gray-800 text-right">
                    {rekening.alamat}, {rekening.negara}
                  </span>
                </div>

                <div className="flex justify-between pt-1 md:col-span-2">
                  <span className="text-gray-500">Status Rekening:</span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>AKTIF - TERVERIFIKASI SISTEM SISKOP2MI / BP2MI</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Box 2: Ringkasan Saldo (Financial Summary) */}
            <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5">
                <p className="text-[11px] text-gray-500 font-semibold uppercase">Saldo Awal</p>
                <p className="text-base font-bold text-gray-800 mt-1">{formatMoney(saldoAwal)}</p>
              </div>

              <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3.5">
                <p className="text-[11px] text-emerald-700 font-semibold uppercase">Total Kredit (+)</p>
                <p className="text-base font-extrabold text-emerald-800 mt-1">
                  + {formatMoney(totalKredit)}
                </p>
              </div>

              <div className="bg-red-50/60 border border-red-200 rounded-xl p-3.5">
                <p className="text-[11px] text-red-700 font-semibold uppercase">Total Debet (-)</p>
                <p className="text-base font-extrabold text-red-700 mt-1">
                  - {formatMoney(totalDebet)}
                </p>
              </div>

              <div className="bg-emerald-900 text-white rounded-xl p-3.5 shadow-sm">
                <p className="text-[11px] text-brand-gold font-semibold uppercase">Saldo Akhir</p>
                <p className="text-lg font-black text-brand-gold mt-0.5">
                  {formatMoney(rekening.saldo || 0)}
                </p>
              </div>
            </div>

            {/* Box 3: Tabel Rincian Mutasi Transaksi Resmi */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-800" />
                  <span>Rincian Mutasi Transaksi Terverifikasi</span>
                </h3>
                <span className="text-[11px] text-gray-500 font-medium">
                  {approvedCount} transaksi disetujui admin
                </span>
              </div>

              <div className="overflow-x-auto border border-gray-300 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-emerald-900 text-white font-bold text-[11px]">
                      <th className="p-2.5 text-center border-r border-emerald-800 w-10">No</th>
                      <th className="p-2.5 border-r border-emerald-800">Tanggal & Jam</th>
                      <th className="p-2.5 border-r border-emerald-800">No. Referensi</th>
                      <th className="p-2.5 border-r border-emerald-800">Jenis</th>
                      <th className="p-2.5 border-r border-emerald-800">Keterangan / Lawan</th>
                      <th className="p-2.5 text-center border-r border-emerald-800">Otorisasi</th>
                      <th className="p-2.5 text-right border-r border-emerald-800">Debet (-)</th>
                      <th className="p-2.5 text-right border-r border-emerald-800">Kredit (+)</th>
                      <th className="p-2.5 text-right">Saldo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 font-sans">
                    {transactions.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="p-6 text-center text-gray-400">
                          Belum ada riwayat transaksi yang tercatat pada rekening ini.
                        </td>
                      </tr>
                    ) : (
                      transactions.map((t, idx) => {
                        const isPositive = t.jumlah.startsWith('+') || t.tipe === 'kredit';
                        const isApproved = t.status === 'approved' || !t.status;
                        const isPending = t.status === 'pending';

                        return (
                          <tr
                            key={idx}
                            className={`hover:bg-gray-50/70 transition ${
                              idx % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'
                            }`}
                          >
                            <td className="p-2.5 text-center font-medium text-gray-500 border-r border-gray-200">
                              {idx + 1}
                            </td>
                            <td className="p-2.5 whitespace-nowrap text-gray-700 border-r border-gray-200 font-mono text-[11px]">
                              {t.tanggal}
                            </td>
                            <td className="p-2.5 whitespace-nowrap text-gray-600 border-r border-gray-200 font-mono text-[11px]">
                              {t.refCode || t.id || `SNB-${idx + 1}`}
                            </td>
                            <td className="p-2.5 border-r border-gray-200 font-semibold text-gray-800">
                              {t.jenis}
                            </td>
                            <td className="p-2.5 border-r border-gray-200 text-gray-700">
                              <p className="font-medium">{t.ket}</p>
                              {t.nama && t.nama !== rekening.nama && (
                                <p className="text-[10px] text-gray-500">Pihak: {t.nama}</p>
                              )}
                            </td>
                            <td className="p-2.5 text-center border-r border-gray-200">
                              {isApproved ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                                  <span>Sah</span>
                                </span>
                              ) : isPending ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                                  <Clock className="w-3 h-3 text-amber-700" />
                                  <span>Pending</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded-full">
                                  <XCircle className="w-3 h-3 text-red-700" />
                                  <span>Ditolak</span>
                                </span>
                              )}
                            </td>
                            <td className="p-2.5 text-right font-mono font-bold text-red-600 border-r border-gray-200 whitespace-nowrap">
                              {!isPositive ? t.jumlah.replace('-', '').trim() : '-'}
                            </td>
                            <td className="p-2.5 text-right font-mono font-bold text-emerald-700 border-r border-gray-200 whitespace-nowrap">
                              {isPositive ? t.jumlah.replace('+', '').trim() : '-'}
                            </td>
                            <td className="p-2.5 text-right font-mono font-semibold text-gray-900 whitespace-nowrap">
                              {t.saldoBerjalan !== undefined ? formatMoney(t.saldoBerjalan) : '-'}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Box 4: Footer Legalitas & Tanda Tangan Digital Resmi */}
            <div className="border-t-2 border-gray-200 pt-5 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-xs">
                {/* QR Code Verifikasi */}
                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <div className="w-16 h-16 bg-white p-1 rounded-lg border border-gray-300 flex items-center justify-center shrink-0">
                    <QrCode className="w-14 h-14 text-emerald-950" />
                  </div>
                  <div>
                    <p className="font-extrabold text-gray-900">QR Verifikasi Dokumen</p>
                    <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                      HASH: {docNumber.replace(/[^0-9A-Z]/g, '')}-VERIFIED
                    </p>
                    <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                      Tersertifikasi Sah & Terdaftar
                    </p>
                  </div>
                </div>

                {/* Stempel Digital Resmi */}
                <div className="flex justify-center">
                  <div className="relative border-4 border-emerald-800 border-double rounded-full w-28 h-28 flex flex-col items-center justify-center text-center p-2 text-emerald-900 rotate-[-8deg] shadow-xs select-none">
                    <p className="text-[8px] font-extrabold tracking-widest uppercase">ANWAR AL MADINAH</p>
                    <p className="text-[10px] font-black text-brand-gold my-0.5">SANABIL BANK</p>
                    <p className="text-[7px] font-bold text-emerald-800">OFFICIAL FINANCE SEAL</p>
                    <p className="text-[7px] text-gray-600 font-mono mt-0.5">KSA • 2026</p>
                  </div>
                </div>

                {/* Tanda Tangan Otorisasi */}
                <div className="text-center md:text-right">
                  <p className="text-[11px] text-gray-500 mb-8">
                    Madinah Al Munawwarah, {printDateStr}<br />
                    <span className="font-bold text-gray-800">Otorisasi Bank & Verifikator SISKOP2MI</span>
                  </p>
                  <p className="font-bold text-gray-900 underline text-xs">
                    Dr. Abdul Rahman Al-Harbi
                  </p>
                  <p className="text-[10px] text-gray-500">
                    Director of Remittance & Worker Banking Operations
                  </p>
                </div>
              </div>

              {/* Disclaimer Hukum */}
              <div className="mt-5 pt-3 border-t border-gray-100 text-[10px] text-gray-400 text-center leading-relaxed">
                <p>
                  Dokumen ini dicetak secara sah melalui sistem terintegrasi Sanabil Bank Syariah & Portal Ketenagakerjaan Anwar Al Madinah Mövenpick Hotel. Dilindungi oleh UU Perlindungan Pekerja Migran Indonesia (BP2MI) dan Saudi Central Bank (SAMA). Seluruh mutasi transaksi telah melalui persetujuan otoritas administrator bank yang sah.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
