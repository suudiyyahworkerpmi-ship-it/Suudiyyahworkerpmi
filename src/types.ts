export interface Member {
  id: number;
  nama: string;
  alamat: string;
  telepon: string;
  negara: string;
  email: string;
  password?: string;
  avatar?: string;
  tglLahir?: string;
  status?: string;
  lulusan?: string;
  institusi?: string;
  riwayat?: string;
  nik?: string;
  paspor?: string;
  dokumen?: {
    cv?: string;
    ijazah?: string;
    paspor?: string;
    sertifikat?: string;
    [key: string]: string | undefined;
  };
}

export type TransactionType =
  | 'Deposit'
  | 'Transfer'
  | 'Transfer Keluar'
  | 'Transfer Masuk'
  | 'Exchange'
  | 'Top-Up Admin';

export type TransactionStatus = 'pending' | 'approved' | 'rejected';

export interface BankTransaction {
  id?: string;
  tanggal: string;
  jenis: TransactionType;
  nama: string;
  ket: string;
  jumlah: string; // e.g. "+ SAR 4.000,00" or "- SAR 200,00"
  amountNumeric?: number;
  tipe?: 'kredit' | 'debit';
  status?: TransactionStatus;
  refCode?: string;
  saldoBerjalan?: number;
  disetujuiOleh?: string;
  waktuPersetujuan?: string;
  bankTujuan?: string;
  rekeningTujuan?: string;
}

export interface Rekening {
  id: number;
  email: string;
  nama: string;
  umur: string | number;
  alamat: string;
  negara: string;
  matauang: string; // 'SAR'
  wajah?: string; // base64 data url from webcam
  ktp?: string; // base64 data url
  status: 'pending' | 'approved' | 'rejected';
  saldo: number;
  noRek: string; // e.g. "SNB-123456789"
  tanggal: string;
  transaksi: BankTransaction[];
}

export interface AntrianDeposit {
  id: number;
  rekId: number;
  email: string;
  nama: string;
  noRek: string;
  jumlah: number;
  status: 'pending' | 'verified' | 'rejected';
  tanggal: string;
  jenis?: 'deposit' | 'transfer';
  bankTujuan?: string;
  rekTujuan?: string;
  namaPenerima?: string;
  berita?: string;
  txId?: string;
  refCode?: string;
}

export interface AdminRiwayatSaldo {
  tanggal: string;
  email: string;
  nama: string;
  jumlah: string;
  keterangan?: string;
}

export interface Lamaran {
  id: number;
  email: string;
  nama: string;
  telepon: string;
  posisi: string;
  statusDomisili: string;
  tanggal: string;
  dokumenList: string[];
}
