import React, { useState, useEffect } from 'react';
import { ArrowDown, MessageCircle, UserPlus, CheckCircle2, ShieldCheck } from 'lucide-react';
import { FlagIndonesia, FlagSaudiArabia } from './Flags';

interface HeroProps {
  onOpenRegister: () => void;
}

const SLIDE_IMAGES = [
  'https://i.ibb.co.com/9kpJk6JX/images-7.jpg',
  'https://i.ibb.co.com/bR7pNgGK/images-5.jpg',
  'https://i.ibb.co.com/CpfBbqsv/images-4.jpg',
  'https://i.ibb.co.com/5xS2gLh3/images-3.jpg',
  'https://i.ibb.co.com/XkM3nHHv/images-2.jpg',
  'https://i.ibb.co.com/W8cRWqp/images-1.jpg',
  'https://i.ibb.co.com/3yrZCY24/images.jpg',
];

export const Hero: React.FC<HeroProps> = ({ onOpenRegister }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDE_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative text-white overflow-hidden min-h-[660px] flex items-center">
      {/* Background Slides */}
      <div className="absolute inset-0">
        {SLIDE_IMAGES.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out pan ${
              currentSlide === idx ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url('${img}')` }}
          />
        ))}
        {/* Emerald Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/95 via-emerald-900/85 to-emerald-950/95" />
      </div>

      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24 w-full">
        {/* Flags Indicator with Indonesian & Saudi Arabian Flags */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2.5 bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-brand-gold/60 shadow-lg">
            {/* Indonesian Flag */}
            <div className="flex items-center gap-2">
              <FlagIndonesia className="w-7 h-4.5 rounded shadow border border-white/30" />
              <span className="text-xs md:text-sm font-bold tracking-wide text-white">Indonesia</span>
            </div>

            <span className="text-brand-gold font-bold text-xs">-</span>

            {/* Saudi Arabian Flag */}
            <div className="flex items-center gap-2">
              <FlagSaudiArabia className="w-7 h-4.5 rounded shadow border border-white/30" />
              <span className="text-xs md:text-sm font-bold tracking-wide text-white">Arab Saudi</span>
            </div>
          </div>

          <div className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-800/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-emerald-600/50 text-xs font-semibold text-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Kemitraan Resmi Bilateral Ketenagakerjaan</span>
          </div>
        </div>

        <p className="uppercase tracking-widest text-brand-gold text-xs md:text-sm font-extrabold mb-3 flex items-center gap-2 drop-shadow-sm">
          <ShieldCheck className="w-4 h-4 text-brand-gold" />
          <span>Kerja Sama Resmi Pemerintah Indonesia - Kerajaan Arab Saudi</span>
        </p>

        <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 max-w-3xl drop-shadow-md">
          Lowongan Kerja Resmi
          <br />
          <span className="text-brand-gold drop-shadow-lg">Anwar Al Madinah Mövenpick Hotel</span>
          <br />
          <span className="text-xl md:text-2xl font-normal text-gray-200">
            Madinah Al Munawwarah, Kerajaan Arab Saudi
          </span>
        </h1>

        {/* Highlight Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 max-w-2xl mb-6 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div>
              <p className="text-xs text-emerald-200 font-medium">Gaji Bulanan Pokok</p>
              <p className="text-2xl font-black text-brand-gold mt-0.5">SAR 4.000</p>
              <p className="text-[11px] text-gray-300">Di luar bonus, lembur & tip</p>
            </div>
            <div className="pt-2 md:pt-0 md:pl-4">
              <p className="text-xs text-emerald-200 font-medium">Batas Pendaftaran</p>
              <p className="text-2xl font-black text-brand-gold mt-0.5">26 Okt 2026</p>
              <p className="text-[11px] text-amber-300 font-semibold">Tepat Waktu Ditutup</p>
            </div>
            <div className="pt-2 md:pt-0 md:pl-4">
              <p className="text-xs text-emerald-200 font-medium">Kontak Person Resmi</p>
              <p className="text-sm font-bold mt-1 text-white">+62 851-1325-6153</p>
              <p className="text-[10px] text-gray-300 truncate">Suudiyyahworkerpmi@gmail.com</p>
            </div>
          </div>
        </div>

        <p className="max-w-2xl text-gray-200 text-sm md:text-base mb-8 leading-relaxed flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>
            Jalur resmi penempatan tenaga kerja profesional. Dilindungi secara hukum oleh Kementerian Ketenagakerjaan / BP2MI. Terverifikasi dalam sistem terpadu SISKOP2MI.
          </span>
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3 items-center">
          <a
            href="#posisi"
            className="bg-brand-gold text-white font-bold px-6 py-3 rounded-xl hover:bg-yellow-700 transition shadow-lg inline-flex items-center gap-2 text-sm cursor-pointer"
          >
            <span>Lihat Posisi Lowongan</span>
            <ArrowDown className="w-4 h-4" />
          </a>

          <button
            onClick={onOpenRegister}
            className="bg-white text-emerald-950 font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition shadow-lg inline-flex items-center gap-2 text-sm cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-emerald-800" />
            <span>Daftar Sekarang</span>
          </button>

          <a
            href="https://wa.me/6285113256153?text=Halo%2C%20saya%20ingin%20bertanya%20mengenai%20loker%20resmi%20Anwar%20Al%20Madinah%20M%C3%B6venpick%20Hotel"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-green-700 transition shadow-lg inline-flex items-center gap-2 text-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Hubungi via WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};
