import React, { useState } from 'react';
import { Check, ShieldCheck, AlertCircle, Info, Briefcase, MapPin, Phone, Mail } from 'lucide-react';
import { FlagIndonesia, FlagSaudiArabia } from './Flags';

interface PositionsProps {
  onApply: (positionName: string) => void;
}

export const Positions: React.FC<PositionsProps> = ({ onApply }) => {
  const [activeTab, setActiveTab] = useState<1 | 2 | 3>(1);

  const renderCostBreakdown = () => (
    <div className="mt-8 border-t border-gray-200 pt-6">
      <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Info className="w-5 h-5 text-emerald-800" />
        <span>Daftar Rincian Biaya Kerja di Arab Saudi</span>
      </h4>

      {/* Ditanggung Perusahaan */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-4 shadow-sm">
        <p className="font-bold text-emerald-950 text-sm mb-3 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
          Biaya yang Ditanggung oleh Perusahaan (Gratis untuk Pekerja):
        </p>
        <ol className="list-decimal ml-5 text-sm space-y-1.5 text-gray-800">
          <li>Visa kerja resmi Kerajaan Arab Saudi</li>
          <li>Iqama (izin tinggal resmi Muqeem)</li>
          <li>Izin kerja resmi (Work Permit)</li>
          <li>Asuransi kesehatan lengkap (Medical Insurance)</li>
          <li>Tempat tinggal / mess karyawan atau tunjangan akomodasi memadai</li>
          <li>Transportasi ke tempat kerja atau tunjangan transportasi harian</li>
          <li>Peralatan keselamatan kerja (K3) yang diperlukan</li>
          <li>Gaji bulanan pokok SAR 4.000 tepat waktu sesuai kontrak kerja resmi</li>
          <li>Upah lembur (overtime) sesuai ketentuan ketenagakerjaan yang berlaku</li>
          <li>Tiket pulang ke Indonesia setelah periode kontrak berakhir</li>
          <li>Tiket pesawat keberangkatan awal dari Indonesia ke Arab Saudi (1x)</li>
        </ol>
      </div>

      {/* Tidak Ditanggung Perusahaan */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 mb-4 shadow-sm">
        <p className="font-bold text-yellow-950 text-sm mb-3 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-600"></span>
          Biaya yang Tidak Ditanggung oleh Perusahaan:
        </p>
        <ol className="list-decimal ml-5 text-sm space-y-1.5 text-gray-800">
          <li>Tiket pesawat bolak-balik selain tiket awal keberangkatan dan kepulangan kontrak resmi</li>
          <li>Makan konsumsi sehari-hari pribadi</li>
          <li>Seragam kerja tambahan</li>
          <li>Sepatu kerja untuk keperluan umum</li>
          <li>Pulsa seluler dan kuota paket internet pribadi</li>
          <li>Perlengkapan mandi (sabun, sampo, pasta gigi, dan deterjen)</li>
          <li>Biaya hidup uang saku sebelum menerima gaji bulan pertama</li>
          <li>Transportasi untuk keperluan jalan-jalan pribadi</li>
          <li>Kebutuhan pribadi, rekreasi dan hiburan</li>
          <li>Dana darurat pribadi</li>
        </ol>
      </div>

      {/* Tanggungan Pribadi */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-4 shadow-sm">
        <p className="font-bold text-red-950 text-sm mb-3 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
          Biaya yang Menjadi Tanggungan Pribadi Pekerja:
        </p>
        <ol className="list-decimal ml-5 text-sm space-y-1.5 text-gray-800">
          <li>Belanja kebutuhan konsumsi pribadi sehari-hari</li>
          <li>Pulsa telepon dan paket internet pribadi bulanan</li>
          <li>Kebutuhan mandi, sabun cuci, dan kebersihan diri</li>
          <li>Hiburan, kuliner, dan jalan-jalan di hari libur</li>
          <li>Makanan tambahan jika di luar jam kerja operasional</li>
          <li>Kiriman uang (remitansi) kepada keluarga di Indonesia</li>
          <li>Barang keperluan pribadi yang tidak berkaitan dengan keselamatan kerja</li>
        </ol>
      </div>

      {/* Catatan Penting */}
      <div className="bg-gray-50 border border-gray-300 rounded-xl p-4 text-xs text-gray-700 leading-relaxed flex items-start gap-2.5">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-gray-900 text-sm mb-1">Catatan Penting Peraturan Ketenagakerjaan</p>
          <p>
            Biaya visa kerja, izin kerja, dan Iqama yang menjadi kewajiban mutlak perusahaan tidak boleh dibebankan kepada pekerja migran. Fasilitas makan, tiket, dan rincian fasilitas wajib dikonfirmasi secara tertulis di dalam Perjanjian Kerja (Job Offer / Kontrak BP2MI) sebelum terbang ke Arab Saudi.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <section id="posisi" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 text-xs font-bold px-3.5 py-1.5 rounded-full mb-3 shadow-xs">
            <FlagIndonesia className="w-4 h-2.5 rounded-xs" />
            <FlagSaudiArabia className="w-4 h-2.5 rounded-xs" />
            <span>Rekrutmen Musim Umroh & Haji 2026/2027</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold text-emerald-950 mb-2">
            Posisi yang Dibutuhkan
          </h2>
          <p className="text-gray-600 text-sm max-w-xl mx-auto">
            Gaji pokok SAR 4.000/bulan di luar bonus prestasi dan tip jemaah. Batas akhir pendaftaran ditutup <strong>26 Oktober 2026</strong>.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab(1)}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition shadow-sm ${
              activeTab === 1
                ? 'bg-emerald-800 text-white shadow-emerald-800/30'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Staff Ground Handling
          </button>
          <button
            onClick={() => setActiveTab(2)}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition shadow-sm ${
              activeTab === 2
                ? 'bg-emerald-800 text-white shadow-emerald-800/30'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Staf Operasional Hotel
          </button>
          <button
            onClick={() => setActiveTab(3)}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition shadow-sm ${
              activeTab === 3
                ? 'bg-emerald-800 text-white shadow-emerald-800/30'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Tour Leader Umroh & Haji
          </button>
        </div>

        {/* TAB 1: Ground Handling */}
        {activeTab === 1 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex flex-wrap justify-between items-start gap-3 mb-6 pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                  Staff Ground Handling (Bandara & Penjemputan)
                </h3>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4 text-emerald-700" />
                  <span>Penempatan: Bandara Jeddah (JED) / Madinah (MED) / Hotel Mövenpick Madinah</span>
                </p>
              </div>
              <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 border border-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                Terverifikasi SISKOP2MI / BP2MI
              </span>
            </div>

            {/* Quick Metrics */}
            <div className="grid md:grid-cols-3 gap-3 mb-6">
              <div className="bg-amber-50/70 border border-brand-gold/40 rounded-xl p-4">
                <p className="text-xs text-gray-600 font-medium">Gaji Pokok Bulanan</p>
                <p className="text-xl font-black text-brand-gold mt-0.5">SAR 4.000</p>
                <p className="text-[11px] text-gray-500">Di luar tip & lembur operasional</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-xs text-gray-600 font-medium">Batas Waktu Pendaftaran</p>
                <p className="text-xl font-black text-red-700 mt-0.5">26 Okt 2026</p>
                <p className="text-[11px] text-red-600 font-semibold">Tepat Waktu Ditutup</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <p className="text-xs text-gray-600 font-medium">Kontak Person Resmi</p>
                <p className="text-sm font-bold text-emerald-950 mt-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  +62 851-1325-6153
                </p>
                <p className="text-[11px] text-emerald-800 truncate flex items-center gap-1 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  Suudiyyahworkerpmi@gmail.com
                </p>
              </div>
            </div>

            <p className="mb-5 text-sm bg-gray-50 p-3 rounded-lg border border-gray-200">
              <strong>Tipe Penempatan:</strong> Full-Time, Kontrak Musiman / Tahunan Resmi Kerajaan Arab Saudi.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-700"></span>
                  Persyaratan Utama
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Menetap di Arab Saudi (Mukimin) atau WNI via penyaluran agen resmi BP2MI</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Mampu berkomunikasi dalam Bahasa Indonesia & Bahasa Arab dasar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Ketahanan fisik prima, siap bertugas di bandara dan stasiun Haramain</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Berorientasi pada pelayanan jemaah (customer service oriented)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-700"></span>
                  Tugas & Tanggung Jawab
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Manajemen kedatangan dan penjemputan rombongan jemaah di bandara</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Logistik, penanganan koper, dan pengelompokan bagasi bus jemaah</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Koordinasi check-in cepat di Anwar Al Madinah Mövenpick Hotel</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Pembagian fasilitas lapangan, air zamzam, dan penanganan darurat jemaah</span>
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => onApply('Staff Ground Handling')}
              className="bg-emerald-800 text-white px-7 py-3 rounded-lg text-sm font-bold hover:bg-emerald-900 transition shadow-md hover:shadow-lg"
            >
              Lamar Posisi Staff Ground Handling
            </button>

            {renderCostBreakdown()}
          </div>
        )}

        {/* TAB 2: Hotel Operational */}
        {activeTab === 2 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex flex-wrap justify-between items-start gap-3 mb-6 pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                  Staf Operasional Hotel (Hospitality Division)
                </h3>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4 text-emerald-700" />
                  <span>Penempatan: Anwar Al Madinah Mövenpick Hotel (Dekat Pelataran Masjid Nabawi)</span>
                </p>
              </div>
              <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 border border-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                Terverifikasi SISKOP2MI / BP2MI
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-3 mb-6">
              <div className="bg-amber-50/70 border border-brand-gold/40 rounded-xl p-4">
                <p className="text-xs text-gray-600 font-medium">Gaji Pokok Bulanan</p>
                <p className="text-xl font-black text-brand-gold mt-0.5">SAR 4.000</p>
                <p className="text-[11px] text-gray-500">Di luar uang lembur & bonus hotel</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-xs text-gray-600 font-medium">Batas Pendaftaran</p>
                <p className="text-xl font-black text-red-700 mt-0.5">26 Okt 2026</p>
                <p className="text-[11px] text-red-600 font-semibold">Tepat Waktu Ditutup</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <p className="text-xs text-gray-600 font-medium">Kontak Person Resmi</p>
                <p className="text-sm font-bold text-emerald-950 mt-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  +62 851-1325-6153
                </p>
                <p className="text-[11px] text-emerald-800 truncate flex items-center gap-1 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  Suudiyyahworkerpmi@gmail.com
                </p>
              </div>
            </div>

            <p className="mb-5 text-sm bg-gray-50 p-3 rounded-lg border border-gray-200">
              <strong>Tipe:</strong> Full-Time, Kontrak Resmi 2 Tahun (Dapat Diperpanjang).
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-2 text-sm">Persyaratan & Posisi Terbuka</h4>
                <ul className="space-y-1.5 text-sm text-gray-700 mb-4">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" /> Pengalaman perhotelan minimal 1-2 tahun
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" /> Mampu berbahasa Inggris atau Arab dasar
                  </li>
                </ul>
                <h5 className="font-bold text-gray-900 text-xs uppercase tracking-wider text-emerald-800 mb-2">
                  Sub-Posisi Tersedia:
                </h5>
                <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                  <li>Guest Relations Coordinator (Bahasa Indonesia / Melayu)</li>
                  <li>Room Allocation & Key Assistant</li>
                  <li>Food Artisan / Kitchen Commis (F&B Dept)</li>
                  <li>Housekeeping / Floor Steward & Laundry</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-3 text-sm">Tugas Utama</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Penyusunan dan validasi rooming list rombongan jemaah Umroh</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Alokasi kamar, sanitasi standar bintang lima, kesiapan amenities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Manajemen prasmanan restoran jemaah Indonesia (F&B taste lokal)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Pelayanan cepat tanggap kebutuhan jemaah lanjut usia dan sakit</span>
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => onApply('Staf Operasional Hotel')}
              className="bg-emerald-800 text-white px-7 py-3 rounded-lg text-sm font-bold hover:bg-emerald-900 transition shadow-md hover:shadow-lg"
            >
              Lamar Posisi Staf Operasional Hotel
            </button>

            {renderCostBreakdown()}
          </div>
        )}

        {/* TAB 3: Tour Leader */}
        {activeTab === 3 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex flex-wrap justify-between items-start gap-3 mb-6 pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                  Tour Leader Umroh & Haji Khusus
                </h3>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4 text-emerald-700" />
                  <span>Penempatan: Rute Indonesia - Jeddah - Makkah - Madinah</span>
                </p>
              </div>
              <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 border border-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                Terverifikasi SISKOP2MI / BP2MI
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-3 mb-6">
              <div className="bg-amber-50/70 border border-brand-gold/40 rounded-xl p-4">
                <p className="text-xs text-gray-600 font-medium">Gaji Pokok Bulanan</p>
                <p className="text-xl font-black text-brand-gold mt-0.5">SAR 4.000</p>
                <p className="text-[11px] text-gray-500">Di luar insentif per trip group</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-xs text-gray-600 font-medium">Batas Pendaftaran</p>
                <p className="text-xl font-black text-red-700 mt-0.5">26 Okt 2026</p>
                <p className="text-[11px] text-red-600 font-semibold">Tepat Waktu Ditutup</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <p className="text-xs text-gray-600 font-medium">Kontak Person Resmi</p>
                <p className="text-sm font-bold text-emerald-950 mt-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  +62 851-1325-6153
                </p>
                <p className="text-[11px] text-emerald-800 truncate flex items-center gap-1 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  Suudiyyahworkerpmi@gmail.com
                </p>
              </div>
            </div>

            <p className="mb-5 text-sm bg-gray-50 p-3 rounded-lg border border-gray-200">
              <strong>Tipe:</strong> Project-Based / Kontrak Tetap Konsorsium Travel Indonesia & Arab Saudi.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-3 text-sm">Persyaratan Khusus</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Berdomisili di Indonesia dan memiliki paspor aktif</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Sertifikasi Tour Leader Umroh (Sertifikat BNSP lebih diutamakan)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Jiwa kepemimpinan tinggi, komunikatif, dan sabar membimbing jemaah</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-3 text-sm">Tugas & Pendampingan</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Briefing manasik dan persiapan pra-keberangkatan rombongan</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Pendampingan 24/7 di pesawat, bus ziarah, dan pelataran Masjid Nabawi</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Komunikasi dengan pihak hotel Anwar Al Madinah Mövenpick dan muthawif</span>
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => onApply('Tour Leader')}
              className="bg-emerald-800 text-white px-7 py-3 rounded-lg text-sm font-bold hover:bg-emerald-900 transition shadow-md hover:shadow-lg"
            >
              Lamar Posisi Tour Leader Umroh & Haji
            </button>

            {renderCostBreakdown()}
          </div>
        )}
      </div>
    </section>
  );
};
