import React from 'react';
import { FileCheck, AlertCircle, Phone, Mail, UserPlus, LogIn, MessageCircle } from 'lucide-react';
import { FlagIndonesia, FlagSaudiArabia } from './Flags';

interface DocumentsAndCTAProps {
  onOpenRegister: () => void;
  onOpenLogin: () => void;
}

const REQUIRED_DOCS = [
  'Rekening Arab Saudi (Sanabil Bank) minimal saldo SAR 3.999,80',
  'Paspor asli aktif (minimal masa berlaku 12-24 bulan, nama 2-3 kata)',
  'Visa Kerja Resmi Kerajaan Arab Saudi',
  'Perjanjian Kerja (Job Offer / Kontrak Terverifikasi)',
  'E-KTKLN / KadPML BP2MI (Kartu Tenaga Kerja Luar Negeri Elektronik)',
  'Sertifikat Medis Fit to Work GAMCA (Gulf Approved Medical Centres)',
  'SKCK Asli Tingkat Polda (Keperluan Luar Negeri)',
  'Ijazah Terakhir + Transkrip Nilai Legalisasi',
  'Sertifikat Pengalaman Kerja Bidang Hospitality / Bandara',
  'Dokumen Kependudukan (KTP, KK, Akta Kelahiran, Buku Nikah jika ada)',
  'Surat Izin Keluarga Bermeterai 10.000',
  'Pasfoto Berwarna Ukuran 4x6 Latar Belakang Putih (Kemeja Rapi)',
];

export const DocumentsAndCTA: React.FC<DocumentsAndCTAProps> = ({
  onOpenRegister,
  onOpenLogin,
}) => {
  return (
    <>
      {/* Dokumen Section */}
      <section id="dokumen" className="py-16 bg-emerald-950 text-white relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="bg-emerald-900 border border-emerald-700 text-brand-gold text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
              Checklist Wajib
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold mb-3">Dokumen Persyaratan</h2>
            <p className="text-emerald-200 text-sm max-w-xl mx-auto">
              Seluruh berkas diproses secara legal dan transparan untuk penerbitan izin kerja dan visa resmi.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-3 max-w-5xl mx-auto">
            {REQUIRED_DOCS.map((doc, idx) => (
              <div
                key={idx}
                className="bg-emerald-900/60 hover:bg-emerald-900/80 transition border border-emerald-800/80 rounded-xl p-3.5 text-sm flex items-start gap-3 shadow-sm"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-700/80 text-emerald-200 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                  {idx + 1}
                </div>
                <div className="text-emerald-100 font-medium leading-relaxed">{doc}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 max-w-2xl mx-auto bg-emerald-900/40 border border-emerald-700/60 rounded-xl p-4 text-xs text-emerald-200 text-center flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 text-brand-gold shrink-0" />
            <span>
              Semua berkas akan diverifikasi langsung oleh verifikator BP2MI dan Kedutaan Besar Arab Saudi.
            </span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="daftar" className="py-16 bg-gray-100 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 text-xs font-bold px-3.5 py-1.5 rounded-full mb-3 shadow-xs">
            <FlagIndonesia className="w-4 h-2.5 rounded-xs" />
            <FlagSaudiArabia className="w-4 h-2.5 rounded-xs" />
            <span>Langkah Pendaftaran Resmi</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold text-emerald-950 mb-3">
            Siap Melamar Pekerjaan?
          </h2>
          <p className="text-gray-600 mb-2 max-w-xl mx-auto text-sm leading-relaxed">
            Daftar sebagai member, buka permohonan rekening resmi Sanabil Bank, dan ajukan lamaran kerja impian Anda di Madinah.
          </p>
          <p className="text-sm font-bold text-red-700 mb-8 flex items-center justify-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
            Pendaftaran gelombang ini ditutup tepat waktu pada 26 Oktober 2026
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={onOpenRegister}
              className="bg-emerald-800 text-white font-bold px-6 py-3 rounded-lg hover:bg-emerald-900 transition shadow-md inline-flex items-center gap-2 text-sm"
            >
              <UserPlus className="w-4 h-4" />
              <span>Daftar Member Sekarang</span>
            </button>
            <button
              onClick={onOpenLogin}
              className="bg-white text-emerald-900 border-2 border-emerald-800 font-bold px-6 py-3 rounded-lg hover:bg-gray-50 transition shadow-sm inline-flex items-center gap-2 text-sm"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk ke Akun</span>
            </button>
            <a
              href="https://wa.me/6285113256153?text=Halo%2C%20saya%20tertarik%20mendaftar%20loker%20resmi%20Movenpick%20Madinah"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-green-700 transition shadow-md inline-flex items-center gap-2 text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Hubungi via WhatsApp</span>
            </a>
          </div>

          <div className="mt-10 bg-white border border-gray-200 rounded-xl p-5 inline-block text-left shadow-sm max-w-md w-full">
            <p className="text-xs text-gray-500 font-medium mb-1">Pusat Bantuan & Kontak Person Resmi</p>
            <p className="text-base font-bold text-gray-900">Suudiyyah Worker PMI</p>
            <div className="mt-2 text-sm space-y-1">
              <p className="text-gray-700 flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>WhatsApp:</span>
                <a
                  href="https://wa.me/6285113256153"
                  className="text-emerald-800 font-semibold hover:underline"
                >
                  +62 851-1325-6153
                </a>
              </p>
              <p className="text-gray-700 flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Email:</span>
                <a
                  href="mailto:Suudiyyahworkerpmi@gmail.com"
                  className="text-emerald-800 font-semibold hover:underline truncate"
                >
                  Suudiyyahworkerpmi@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
