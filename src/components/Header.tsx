import React, { useState } from 'react';
import { Phone, Mail, ShieldCheck, User, LogIn, Menu, X, ArrowRight } from 'lucide-react';
import { Member } from '../types';
import { ADMIN_EMAIL } from '../services/storage';
import { FlagIndonesia, FlagSaudiArabia, BilateralFlagsBadge } from './Flags';

interface HeaderProps {
  currentEmail: string;
  currentMember?: Member;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onNavigate: (page: 'main' | 'member' | 'bank' | 'admin') => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentEmail,
  currentMember,
  onOpenLogin,
  onOpenRegister,
  onNavigate,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAdmin = currentEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  return (
    <>
      {/* Top Banner Alert with Flags */}
      <div className="bg-red-700 text-white text-center text-xs py-2 px-3 sticky top-0 z-50 font-medium shadow-sm flex items-center justify-center gap-2">
        <div className="flex items-center gap-1.5 shrink-0">
          <FlagIndonesia className="w-4 h-2.5 rounded-xs" />
          <FlagSaudiArabia className="w-4 h-2.5 rounded-xs" />
        </div>
        <span>
          <strong className="font-bold">Loker Resmi Terverifikasi SISKOP2MI</strong> - Waspada calo dan loker ilegal - Pendaftaran ditutup <strong>26 Oktober 2026</strong>
        </span>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm sticky top-[33px] z-40 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo & Brand */}
          <div
            onClick={() => onNavigate('main')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative">
              <img
                src="https://i.ibb.co.com/sMZqYN7/images-6.jpg"
                alt="Logo Mövenpick Anwar Al Madinah"
                className="w-12 h-12 rounded-full object-cover border-2 border-brand-gold shadow-md group-hover:scale-105 transition"
              />
              <div className="absolute -bottom-1 -right-1 flex -space-x-1">
                <FlagIndonesia className="w-4 h-3 rounded-xs border border-white shadow-xs" />
                <FlagSaudiArabia className="w-4 h-3 rounded-xs border border-white shadow-xs" />
              </div>
            </div>
            <div>
              <p className="font-bold text-sm md:text-base text-gray-900 group-hover:text-emerald-900 transition leading-tight flex items-center gap-1.5">
                <span>Anwar Al Madinah Mövenpick</span>
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
                <span className="inline-flex items-center text-emerald-700 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 mr-0.5 inline" />
                  Resmi - Terverifikasi BP2MI
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-brand-gold font-semibold">Madinah, KSA</span>
              </div>
            </div>
          </div>

          {/* Bilateral Partnership Badge in Center Desktop */}
          <div className="hidden xl:flex items-center">
            <BilateralFlagsBadge size="sm" />
          </div>

          {/* Contact Person Details */}
          <div className="hidden md:flex items-center gap-4 text-xs text-gray-600 bg-gray-50 px-3.5 py-1.5 rounded-xl border border-gray-200">
            <div className="text-right border-r border-gray-200 pr-3">
              <p className="font-semibold text-gray-900">Kontak Person</p>
              <p className="text-emerald-800 font-bold">Suudiyyah Worker PMI</p>
            </div>
            <div className="text-left text-[11px] space-y-0.5">
              <p className="font-bold text-gray-800 flex items-center gap-1">
                <Phone className="w-3 h-3 text-emerald-700" />
                +62 851-1325-6153
              </p>
              <p className="text-gray-500 flex items-center gap-1">
                <Mail className="w-3 h-3 text-emerald-700" />
                Suudiyyahworkerpmi@gmail.com
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex gap-4 text-sm font-medium text-gray-700 items-center ml-2">
            <a href="#posisi" className="hover:text-brand-gold transition py-1">
              Posisi
            </a>
            <a href="#legalitas" className="hover:text-brand-gold transition py-1">
              Legalitas
            </a>
            <a href="#dokumen" className="hover:text-brand-gold transition py-1">
              Dokumen
            </a>

            {currentEmail ? (
              <div className="flex items-center gap-2 border-l pl-3 ml-1 border-gray-200">
                {isAdmin ? (
                  <button
                    onClick={() => onNavigate('admin')}
                    className="bg-amber-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold hover:bg-amber-700 transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <span>Dashboard Admin</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                ) : (
                  <button
                    onClick={() => onNavigate('member')}
                    className="bg-emerald-800 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-900 transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>{currentMember?.nama?.split(' ')[0] || 'Member'}</span>
                  </button>
                )}
                <button
                  onClick={onLogout}
                  className="text-xs text-red-600 hover:text-red-700 font-bold px-2 py-1 cursor-pointer"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 border-l pl-3 ml-1 border-gray-200">
                <button
                  onClick={onOpenLogin}
                  className="hover:text-brand-gold transition font-bold text-gray-800 px-2 py-1 flex items-center gap-1 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Masuk</span>
                </button>
                <button
                  onClick={onOpenRegister}
                  className="bg-emerald-800 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-900 transition shadow-sm cursor-pointer"
                >
                  Daftar
                </button>
              </div>
            )}
          </nav>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center gap-2">
            {currentEmail ? (
              <button
                onClick={() => onNavigate(isAdmin ? 'admin' : 'member')}
                className="bg-emerald-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold"
              >
                {isAdmin ? 'Admin' : 'Akun'}
              </button>
            ) : (
              <button
                onClick={onOpenLogin}
                className="bg-emerald-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold"
              >
                Masuk
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-gray-600 hover:text-gray-900 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 px-4 pt-3 pb-4 space-y-3 shadow-lg">
            <div className="flex justify-center pb-2 border-b border-gray-100">
              <BilateralFlagsBadge size="sm" />
            </div>

            <div className="text-xs text-gray-600 pb-2 border-b border-gray-100">
              <p className="font-semibold text-gray-900">Suudiyyah Worker PMI</p>
              <p>WhatsApp: +62 851-1325-6153</p>
              <p>Email: Suudiyyahworkerpmi@gmail.com</p>
            </div>
            <a
              href="#posisi"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-gray-700 hover:text-emerald-800 font-medium"
            >
              Posisi Lowongan
            </a>
            <a
              href="#legalitas"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-gray-700 hover:text-emerald-800 font-medium"
            >
              Legalitas KemenP2MI / BP2MI
            </a>
            <a
              href="#dokumen"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-gray-700 hover:text-emerald-800 font-medium"
            >
              Persyaratan Dokumen
            </a>

            <div className="pt-2 flex flex-col gap-2">
              {currentEmail ? (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigate(isAdmin ? 'admin' : 'member');
                    }}
                    className="w-full bg-emerald-800 text-white py-2 rounded-lg text-sm font-bold"
                  >
                    Buka {isAdmin ? 'Dashboard Admin' : 'Dashboard Member'}
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full bg-red-50 text-red-600 py-2 rounded-lg text-sm font-bold"
                  >
                    Keluar Akun
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenLogin();
                    }}
                    className="border border-emerald-800 text-emerald-800 py-2 rounded-lg text-sm font-bold text-center"
                  >
                    Masuk
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenRegister();
                    }}
                    className="bg-emerald-800 text-white py-2 rounded-lg text-sm font-bold text-center"
                  >
                    Daftar Member
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};
