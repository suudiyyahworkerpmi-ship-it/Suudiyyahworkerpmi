import { Member, Rekening, AntrianDeposit, AdminRiwayatSaldo, Lamaran } from '../types';

export const ADMIN_EMAIL = 'berkahkita937@gmail.com';
export const ADMIN_PASSWORD = 'berkah313';
export const CURRENCY = 'SAR';

export function formatMoney(amount: number | string | undefined): string {
  const num = Number(amount || 0);
  return `${CURRENCY} ${num.toLocaleString('id-ID', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatIDR(amount: number): string {
  return `IDR ${amount.toLocaleString('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export function getStoredMembers(): Member[] {
  try {
    const raw = localStorage.getItem('members');
    if (!raw) {
      // Seed initial demo member for convenience if not exists
      const initial: Member[] = [
        {
          id: 1729000000000,
          nama: 'Ahmad Fauzi',
          alamat: 'Jl. Pemuda No. 45, Jakarta Selatan',
          telepon: '81234567890',
          negara: 'Indonesia',
          email: 'ahmad.fauzi@example.com',
          password: 'password123',
          avatar: '',
          tglLahir: '1996-05-14',
          status: 'Bekerja',
          lulusan: 'SMA / SMK',
          institusi: 'SMK Perhotelan 1 Jakarta',
          riwayat: '2020-2023 Staff Hospitality Hotel Bintang 4',
          dokumen: {
            cv: 'CV_Ahmad_Fauzi.pdf',
            paspor: 'Paspor_Ahmad.pdf',
          },
        },
      ];
      localStorage.setItem('members', JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveMembers(members: Member[]): void {
  localStorage.setItem('members', JSON.stringify(members));
}

export function generateRefCode(prefix = 'TRX'): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${dateStr}-${rand}`;
}

export function getStoredRekening(): Rekening[] {
  try {
    const raw = localStorage.getItem('sanabil_rekening');
    if (!raw) {
      // Seed initial demo account connected to demo member
      const initial: Rekening[] = [
        {
          id: 101,
          email: 'ahmad.fauzi@example.com',
          nama: 'Ahmad Fauzi',
          umur: 28,
          alamat: 'Jl. Pemuda No. 45, Jakarta Selatan',
          negara: 'Indonesia',
          matauang: CURRENCY,
          status: 'approved',
          saldo: 4000.0,
          noRek: 'SNB-782910482',
          tanggal: '20/10/2026, 10:15:30',
          transaksi: [
            {
              id: 'TRX-20261020-001',
              tanggal: '20/10/2026, 10:15:30',
              jenis: 'Deposit',
              nama: 'Ahmad Fauzi',
              ket: 'Setoran Awal Akun Sanabil Bank via QRIS',
              jumlah: '+ SAR 4.000,00',
              amountNumeric: 4000,
              tipe: 'kredit',
              status: 'approved',
              refCode: 'DEP-SNB-20261020-01',
              saldoBerjalan: 4000,
              disetujuiOleh: 'Admin (berkahkita937@gmail.com)',
              waktuPersetujuan: '20/10/2026, 10:15:30',
            },
          ],
        },
      ];
      localStorage.setItem('sanabil_rekening', JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveRekening(list: Rekening[]): void {
  localStorage.setItem('sanabil_rekening', JSON.stringify(list));
}

export function getStoredAntrian(): AntrianDeposit[] {
  try {
    const raw = localStorage.getItem('antrian_deposit');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveAntrian(list: AntrianDeposit[]): void {
  localStorage.setItem('antrian_deposit', JSON.stringify(list));
}

export function getStoredAdminRiwayat(): AdminRiwayatSaldo[] {
  try {
    const raw = localStorage.getItem('admin_riwayat_saldo');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveAdminRiwayat(list: AdminRiwayatSaldo[]): void {
  localStorage.setItem('admin_riwayat_saldo', JSON.stringify(list));
}

export function getStoredLamaran(): Lamaran[] {
  try {
    const raw = localStorage.getItem('lamaran_list');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLamaran(list: Lamaran[]): void {
  localStorage.setItem('lamaran_list', JSON.stringify(list));
}

export function getCurrentLoginEmail(): string {
  return localStorage.getItem('sanabil_login') || '';
}

export function setCurrentLoginEmail(email: string): void {
  localStorage.setItem('sanabil_login', email);
}

export function getMemberByEmail(email: string): Member | undefined {
  if (!email) return undefined;
  const members = getStoredMembers();
  return members.find((m) => m.email && m.email.toLowerCase() === email.trim().toLowerCase());
}

export function getRekeningByEmail(email: string): Rekening | undefined {
  if (!email) return undefined;
  const list = getStoredRekening();
  return list.find((r) => r.email && r.email.toLowerCase() === email.trim().toLowerCase());
}

export function updateMemberEmailInAllStores(oldEmail: string, newEmail: string): void {
  const normOld = oldEmail.trim().toLowerCase();
  const normNew = newEmail.trim().toLowerCase();
  if (normOld === normNew) return;

  // Update sanabil_rekening
  const rekenings = getStoredRekening();
  let rekChanged = false;
  rekenings.forEach((r) => {
    if (r.email && r.email.toLowerCase() === normOld) {
      r.email = normNew;
      rekChanged = true;
    }
  });
  if (rekChanged) saveRekening(rekenings);

  // Update antrian_deposit
  const antrian = getStoredAntrian();
  let antrianChanged = false;
  antrian.forEach((a) => {
    if (a.email && a.email.toLowerCase() === normOld) {
      a.email = normNew;
      antrianChanged = true;
    }
  });
  if (antrianChanged) saveAntrian(antrian);

  // Update lamaran_list
  const lamaran = getStoredLamaran();
  let lamaranChanged = false;
  lamaran.forEach((l) => {
    if (l.email && l.email.toLowerCase() === normOld) {
      l.email = normNew;
      lamaranChanged = true;
    }
  });
  if (lamaranChanged) saveLamaran(lamaran);
}

