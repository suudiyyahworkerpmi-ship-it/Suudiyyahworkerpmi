import React, { useState, useEffect } from 'react';
import { X, Briefcase, FileUp, CheckCircle2 } from 'lucide-react';
import { Member, Lamaran } from '../../types';
import { getStoredLamaran, saveLamaran } from '../../services/storage';

interface LamarModalProps {
  isOpen: boolean;
  position: string;
  currentMember?: Member;
  onClose: () => void;
  onSuccess: () => void;
}

export const LamarModal: React.FC<LamarModalProps> = ({
  isOpen,
  position,
  currentMember,
  onClose,
  onSuccess,
}) => {
  const [nama, setNama] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [statusDomisili, setStatusDomisili] = useState('');
  const [files, setFiles] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isOpen && currentMember) {
      setNama(currentMember.nama || '');
      setWhatsapp(currentMember.telepon || '');
      setEmail(currentMember.email || '');
      setStatusDomisili(
        currentMember.negara === 'Arab Saudi' ? 'Mukimin Arab Saudi' : 'Domisili Indonesia'
      );
    }
  }, [isOpen, currentMember]);

  if (!isOpen) return null;

  const handleFileChange = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [key]: file.name }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const stored = getStoredLamaran();
    const newLamaran: Lamaran = {
      id: Date.now(),
      email: email.trim().toLowerCase(),
      nama,
      telepon: whatsapp,
      posisi: position,
      statusDomisili,
      tanggal: new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
      dokumenList: Object.keys(files),
    };

    stored.unshift(newLamaran);
    saveLamaran(stored);

    alert(
      `Lamaran Anda untuk posisi "${position}" berhasil dikirim!\n\nTim rekrutmen Anwar Al Madinah Mövenpick & Suudiyyah Worker PMI akan menghubungi nomor WhatsApp Anda untuk jadwal interview online.`
    );

    onClose();
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl my-8 relative animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Formulir Lamaran Kerja</h3>
              <p className="text-xs text-gray-500">Anwar Al Madinah Mövenpick Hotel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Posisi yang Dilamar</label>
            <input
              type="text"
              value={position}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-100 font-bold text-emerald-900"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Lengkap *</label>
              <input
                required
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Nomor WhatsApp Aktif *
              </label>
              <input
                required
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email *</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Status Keberadaan *
              </label>
              <select
                required
                value={statusDomisili}
                onChange={(e) => setStatusDomisili(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
              >
                <option value="">Pilih Status</option>
                <option value="Mukimin Arab Saudi">Mukimin Arab Saudi (Sudah di Arab Saudi)</option>
                <option value="Domisili Indonesia">Domisili Indonesia (Siap Terbang)</option>
              </select>
            </div>
          </div>

          {/* Upload Dokumen Section */}
          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/70">
            <h4 className="font-bold text-gray-900 text-sm mb-1 flex items-center gap-1.5">
              <FileUp className="w-4 h-4 text-emerald-800" />
              <span>Unggah Dokumen Berkas Lamaran</span>
            </h4>
            <p className="text-xs text-gray-500 mb-3">Format PDF, JPG, PNG (Maks 5MB per berkas)</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">1. Paspor Asli *</label>
                <input
                  type="file"
                  required
                  accept=".pdf,image/*"
                  onChange={(e) => handleFileChange('paspor', e)}
                  className="w-full border border-gray-300 rounded-lg p-1.5 bg-white text-xs"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700 block mb-1">2. KTP *</label>
                <input
                  type="file"
                  required
                  accept=".pdf,image/*"
                  onChange={(e) => handleFileChange('ktp', e)}
                  className="w-full border border-gray-300 rounded-lg p-1.5 bg-white text-xs"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700 block mb-1">3. Ijazah Terakhir *</label>
                <input
                  type="file"
                  required
                  accept=".pdf,image/*"
                  onChange={(e) => handleFileChange('ijazah', e)}
                  className="w-full border border-gray-300 rounded-lg p-1.5 bg-white text-xs"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700 block mb-1">4. Curriculum Vitae (CV) *</label>
                <input
                  type="file"
                  required
                  accept=".pdf,image/*"
                  onChange={(e) => handleFileChange('cv', e)}
                  className="w-full border border-gray-300 rounded-lg p-1.5 bg-white text-xs"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700 block mb-1">5. SKCK Polda *</label>
                <input
                  type="file"
                  required
                  accept=".pdf,image/*"
                  onChange={(e) => handleFileChange('skck', e)}
                  className="w-full border border-gray-300 rounded-lg p-1.5 bg-white text-xs"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700 block mb-1">6. Sertifikat Medis GAMCA *</label>
                <input
                  type="file"
                  required
                  accept=".pdf,image/*"
                  onChange={(e) => handleFileChange('medis', e)}
                  className="w-full border border-gray-300 rounded-lg p-1.5 bg-white text-xs"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700 block mb-1">7. Pasfoto 4x6 Latar Putih *</label>
                <input
                  type="file"
                  required
                  accept="image/*"
                  onChange={(e) => handleFileChange('pasfoto', e)}
                  className="w-full border border-gray-300 rounded-lg p-1.5 bg-white text-xs"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700 block mb-1">8. Sertifikat Keahlian (opsional)</label>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => handleFileChange('sertifikat', e)}
                  className="w-full border border-gray-300 rounded-lg p-1.5 bg-white text-xs"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-800 text-white font-bold py-3 rounded-lg hover:bg-emerald-900 transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Kirim Lamaran Sekarang</span>
          </button>
        </form>
      </div>
    </div>
  );
};
