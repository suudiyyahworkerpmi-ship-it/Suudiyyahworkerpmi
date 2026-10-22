import React from 'react';
import { Shield, Building2, Scale, Clock, Award, Users } from 'lucide-react';
import { FlagIndonesia, FlagSaudiArabia } from './Flags';

export const StatsBanner: React.FC = () => {
  return (
    <>
      <section className="bg-white border-b border-gray-200 shadow-sm relative overflow-hidden">
        {/* Subtle decorative background flags watermark */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-3 opacity-5 pointer-events-none">
          <FlagIndonesia className="w-48 h-32" />
          <FlagSaudiArabia className="w-48 h-32" />
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center relative z-10">
          <div className="p-3">
            <p className="text-3xl lg:text-4xl font-extrabold text-emerald-900 tracking-tight">
              SAR 4.000
            </p>
            <p className="text-xs text-gray-500 font-medium mt-1">Gaji Bulanan Pokok + Bonus</p>
          </div>
          <div className="p-3 border-l border-gray-100">
            <p className="text-3xl lg:text-4xl font-extrabold text-emerald-900 tracking-tight">3</p>
            <p className="text-xs text-gray-500 font-medium mt-1">Posisi Divisi Tersedia</p>
          </div>
          <div className="p-3 border-l border-gray-100">
            <div className="flex items-center justify-center gap-1.5 text-3xl lg:text-4xl font-extrabold text-emerald-900 tracking-tight">
              <span>BP2MI</span>
            </div>
            <p className="text-xs text-gray-500 font-medium mt-1">Terverifikasi Resmi</p>
          </div>
          <div className="p-3 border-l border-gray-100">
            <p className="text-3xl lg:text-4xl font-extrabold text-red-700 tracking-tight">
              26 Okt 2026
            </p>
            <p className="text-xs text-gray-500 font-medium mt-1">Batas Akhir Pendaftaran</p>
          </div>
        </div>
      </section>

      {/* Emerald Highlight Bar */}
      <section className="py-10 bg-emerald-800 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="bg-emerald-900/60 rounded-2xl p-6 border border-emerald-700/50 shadow-sm">
              <p className="text-xs uppercase tracking-widest text-emerald-300 font-bold mb-2">
                Gaji Bulanan Semua Posisi
              </p>
              <p className="text-4xl font-black text-brand-gold">SAR 4.000</p>
              <p className="text-xs mt-2 text-emerald-200">Di luar bonus, tip & lembur resmi</p>
            </div>
            <div className="bg-emerald-900/60 rounded-2xl p-6 border border-emerald-700/50 shadow-sm">
              <p className="text-xs uppercase tracking-widest text-emerald-300 font-bold mb-2">
                Pendaftaran Ditutup
              </p>
              <p className="text-4xl font-black text-brand-gold">26 Okt 2026</p>
              <p className="text-xs mt-2 text-emerald-200">Segera daftar sebelum kuota terpenuhi</p>
            </div>
            <div className="bg-emerald-900/60 rounded-2xl p-6 border border-emerald-700/50 shadow-sm">
              <p className="text-xs uppercase tracking-widest text-emerald-300 font-bold mb-2">
                Kontak Langsung
              </p>
              <a
                href="https://wa.me/6285113256153"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl font-bold text-brand-gold block hover:underline"
              >
                +62 851-1325-6153
              </a>
              <a
                href="mailto:Suudiyyahworkerpmi@gmail.com"
                className="text-xs text-emerald-200 hover:underline break-all mt-1 block"
              >
                Suudiyyahworkerpmi@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export const Legality: React.FC = () => {
  return (
    <section id="legalitas" className="py-16 bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 text-xs font-bold px-3.5 py-1.5 rounded-full mb-3 shadow-xs">
            <FlagIndonesia className="w-4 h-2.5 rounded-xs" />
            <FlagSaudiArabia className="w-4 h-2.5 rounded-xs" />
            <span>Jaminan Keamanan & Legalitas Diplomatik</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-emerald-950 mb-3">
            Lowongan Resmi Jalur Pemerintahan
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm leading-relaxed">
            Dilindungi langsung oleh Kementerian Pelindungan Pekerja Migran Indonesia (KemenP2MI) /
            Badan Pelindungan Pekerja Migran Indonesia (BP2MI) berkoordinasi dengan Kementerian Sumber Daya Manusia & Pembangunan Sosial Kerajaan Arab Saudi.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-lg mb-4 shadow-xs">
              <Building2 className="w-6 h-6 text-emerald-800" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">1. Lembaga Utama</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              KemenP2MI / BP2MI sebagai instansi resmi negara yang mengawasi, memverifikasi loker, dan
              menjamin hak-hak Pekerja Migran Indonesia di Kerajaan Arab Saudi.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-lg mb-4 shadow-xs">
              <Shield className="w-6 h-6 text-emerald-800" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">2. Sistem Keamanan Terpadu</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Terintegrasi langsung dengan sistem terpusat SISKOP2MI. Jika lowongan tidak terdaftar
              secara sah di sistem ini, maka dipastikan lowongan tersebut ilegal.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-lg mb-4 shadow-xs">
              <Scale className="w-6 h-6 text-emerald-800" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">3. Bentuk Pelindungan Hukum</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Kepastian hukum kontrak kerja, jaminan asuransi sosial, standar keselamatan kerja, hingga
              pendampingan dan bantuan hukum oleh KBRI Riyadh dan KJRI Jeddah.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
