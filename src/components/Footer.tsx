import React from 'react';
import { Phone, Mail, ShieldCheck } from 'lucide-react';
import { FlagIndonesia, FlagSaudiArabia } from './Flags';

export const Footer: React.FC = () => {
  return (
    <footer id="mainFooter" className="bg-emerald-950 text-emerald-100 py-12 border-t border-emerald-900">
      <div className="max-w-7xl mx-auto px-4">
        {/* Bilateral Partnership Bar */}
        <div className="bg-emerald-900/60 border border-emerald-800 rounded-2xl p-4 mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg border border-white/10">
              <FlagIndonesia className="w-5 h-3.5 rounded-xs" />
              <span className="text-xs font-bold text-white">Indonesia</span>
            </div>
            <span className="text-brand-gold font-bold text-xs">-</span>
            <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg border border-white/10">
              <FlagSaudiArabia className="w-5 h-3.5 rounded-xs" />
              <span className="text-xs font-bold text-white">Arab Saudi</span>
            </div>
          </div>
          <p className="text-xs text-emerald-300 font-medium">
            Program Penempatan Kerja Resmi BP2MI - SISKOP2MI ke Anwar Al Madinah Mövenpick Hotel
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-sm mb-8">
          {/* Col 1 */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <img
                src="https://i.ibb.co.com/sMZqYN7/images-6.jpg"
                alt="Logo Mövenpick"
                className="w-14 h-14 rounded-full object-cover border-2 border-brand-gold shadow"
              />
              <div>
                <p className="font-bold text-base text-white">Anwar Al Madinah Mövenpick</p>
                <p className="text-xs text-brand-gold font-medium">Hotel & Suites - Madinah Al Munawwarah</p>
              </div>
            </div>
            <p className="text-xs text-emerald-300 leading-relaxed">
              Program Kerja Sama Resmi Ketenagakerjaan Bilateral Indonesia - Kerajaan Arab Saudi.
            </p>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Terverifikasi KemenP2MI / BP2MI - SISKOP2MI</span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <p className="font-bold text-base text-white mb-3">Kontak Person Resmi</p>
            <p className="text-xs text-emerald-300 mb-2 font-medium">Suudiyyah Worker PMI</p>
            <div className="space-y-2 text-xs">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-brand-gold" />
                <a
                  href="https://wa.me/6285113256153"
                  className="hover:underline text-brand-gold font-semibold"
                >
                  +62 851-1325-6153
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-brand-gold" />
                <a
                  href="mailto:Suudiyyahworkerpmi@gmail.com"
                  className="hover:underline text-brand-gold break-all"
                >
                  Suudiyyahworkerpmi@gmail.com
                </a>
              </p>
            </div>
          </div>

          {/* Col 3 */}
          <div>
            <p className="font-bold text-base text-white mb-3">Informasi Penting</p>
            <ul className="text-xs text-emerald-300 space-y-1.5 leading-relaxed">
              <li>• Gaji Bulanan Pokok: <strong>SAR 4.000</strong> (di luar bonus dan tip)</li>
              <li>• Pendaftaran Gelombang Resmi: Ditutup <strong>26 Oktober 2026</strong></li>
              <li>
                • Rekening Sanabil Bank resmi Suudiyyah untuk pekerja migran, berlaku seumur hidup selama di Arab Saudi
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-emerald-900 pt-6 text-center text-xs text-emerald-400 flex flex-col md:flex-row items-center justify-between gap-3">
          <p>
            Hak Cipta © 2026 Agensi P3MI Resmi. Nomor Izin: SIP3MI-KEMNAKER-0892/BP2MI. Waspada terhadap segala bentuk penipuan dan calo ilegal.
          </p>
          <div className="flex gap-4 text-emerald-300 text-[11px]">
            <span className="hover:underline cursor-pointer">Syarat & Ketentuan</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Kebijakan Privasi</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">SISKOP2MI Portal</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
