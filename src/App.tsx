import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { StatsBanner, Legality } from './components/StatsBanner';
import { Positions } from './components/Positions';
import { DocumentsAndCTA } from './components/DocumentsAndCTA';
import { Footer } from './components/Footer';
import { MemberDashboard } from './components/MemberDashboard';
import { BankDashboard } from './components/BankDashboard';
import { AdminDashboard } from './components/AdminDashboard';

import { RegisterModal } from './components/modals/RegisterModal';
import { LoginModal } from './components/modals/LoginModal';
import { CekRekeningModal } from './components/modals/CekRekeningModal';
import { BuatRekeningModal } from './components/modals/BuatRekeningModal';
import { LamarModal } from './components/modals/LamarModal';

import {
  ADMIN_EMAIL,
  getCurrentLoginEmail,
  setCurrentLoginEmail,
  getMemberByEmail,
  getRekeningByEmail,
  getStoredRekening,
} from './services/storage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'main' | 'member' | 'bank' | 'admin'>('main');
  const [currentEmail, setCurrentEmail] = useState<string>('');

  // Modals
  const [registerOpen, setRegisterOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [cekRekeningOpen, setCekRekeningOpen] = useState(false);
  const [buatRekeningOpen, setBuatRekeningOpen] = useState(false);
  const [lamarOpen, setLamarOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState('');

  // Refresh counter to force re-render when local storage updates
  const [, setTick] = useState(0);
  const refreshData = () => setTick((t) => t + 1);

  useEffect(() => {
    const savedEmail = getCurrentLoginEmail();
    if (savedEmail) {
      setCurrentEmail(savedEmail);
      if (savedEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        setCurrentPage('admin');
      } else {
        const member = getMemberByEmail(savedEmail);
        if (member) {
          setCurrentPage('member');
        }
      }
    }
  }, []);

  const currentMember = currentEmail ? getMemberByEmail(currentEmail) : undefined;

  const handleLogout = () => {
    setCurrentLoginEmail('');
    setCurrentEmail('');
    setCurrentPage('main');
  };

  const handleLoginSuccess = (email: string, role: 'admin' | 'member') => {
    setCurrentEmail(email);
    if (role === 'admin') {
      setCurrentPage('admin');
    } else {
      setCurrentPage('member');
    }
  };

  const handleApplyJob = (positionName: string) => {
    if (!currentEmail) {
      alert('Silakan masuk atau registrasi terlebih dahulu sebelum melamar pekerjaan.');
      setLoginOpen(true);
      return;
    }

    if (currentEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      alert('Akun admin tidak dapat melamar pekerjaan. Silakan gunakan akun member.');
      return;
    }

    // Check if member has an approved Sanabil Bank account
    const list = getStoredRekening();
    const approvedRek = list.find(
      (r) => r.status === 'approved' && r.email.toLowerCase() === currentEmail.toLowerCase()
    );

    if (!approvedRek) {
      alert(
        'Anda belum memiliki rekening Sanabil Bank yang disetujui.\nSilakan buat atau lengkapi permohonan rekening terlebih dahulu.'
      );
      setCekRekeningOpen(true);
      return;
    }

    setSelectedPosition(positionName);
    setLamarOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 font-sans">
      {/* If current page is 'main', show full landing page */}
      {currentPage === 'main' && (
        <>
          <Header
            currentEmail={currentEmail}
            currentMember={currentMember}
            onOpenLogin={() => setLoginOpen(true)}
            onOpenRegister={() => setRegisterOpen(true)}
            onNavigate={(page) => setCurrentPage(page)}
            onLogout={handleLogout}
          />
          <main className="flex-1">
            <Hero onOpenRegister={() => setRegisterOpen(true)} />
            <StatsBanner />
            <Legality />
            <Positions onApply={handleApplyJob} />
            <DocumentsAndCTA
              onOpenRegister={() => setRegisterOpen(true)}
              onOpenLogin={() => setLoginOpen(true)}
            />
          </main>
          <Footer />
        </>
      )}

      {/* Member Dashboard */}
      {currentPage === 'member' && currentMember && (
        <MemberDashboard
          currentMember={currentMember}
          onLogout={handleLogout}
          onNavigateHome={() => setCurrentPage('main')}
          onNavigateBank={() => setCurrentPage('bank')}
          onOpenCekRekening={() => setCekRekeningOpen(true)}
          onRefreshData={refreshData}
        />
      )}

      {/* Bank Dashboard */}
      {currentPage === 'bank' && (
        <BankDashboard
          currentEmail={currentEmail}
          onBackToMember={() => setCurrentPage('member')}
          onAccountClosed={() => {
            refreshData();
            setCurrentPage('member');
          }}
          onRefreshData={refreshData}
        />
      )}

      {/* Admin Dashboard */}
      {currentPage === 'admin' && (
        <AdminDashboard
          onLogout={handleLogout}
          onNavigateHome={() => setCurrentPage('main')}
          onRefreshData={refreshData}
        />
      )}

      {/* Global Modals */}
      <RegisterModal
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onOpenLogin={() => setLoginOpen(true)}
        onRegisterSuccess={(email) => {
          setCurrentEmail(email);
          refreshData();
        }}
      />

      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onOpenRegister={() => setRegisterOpen(true)}
        onLoginSuccess={handleLoginSuccess}
      />

      <CekRekeningModal
        isOpen={cekRekeningOpen}
        userEmail={currentEmail}
        onClose={() => setCekRekeningOpen(false)}
        onOpenBuatRekening={() => setBuatRekeningOpen(true)}
        onNavigateToBank={() => setCurrentPage('bank')}
      />

      <BuatRekeningModal
        isOpen={buatRekeningOpen}
        currentMember={currentMember}
        onClose={() => setBuatRekeningOpen(false)}
        onSuccess={() => {
          refreshData();
          if (currentPage === 'main') {
            setCurrentPage('member');
          }
        }}
      />

      <LamarModal
        isOpen={lamarOpen}
        position={selectedPosition}
        currentMember={currentMember}
        onClose={() => setLamarOpen(false)}
        onSuccess={refreshData}
      />
    </div>
  );
}
