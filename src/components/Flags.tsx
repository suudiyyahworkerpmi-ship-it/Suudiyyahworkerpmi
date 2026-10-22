import React from 'react';

export const FLAG_INDONESIA_URL = 'https://i.ibb.co.com/Nn2hB69r/download-1.webp';
export const FLAG_SAUDI_ARABIA_URL = 'https://i.ibb.co.com/d4zm5FpD/download.webp';

export const FlagIndonesia: React.FC<{ className?: string }> = ({ className = 'w-6 h-4' }) => (
  <img
    src={FLAG_INDONESIA_URL}
    alt="Bendera Republik Indonesia"
    className={`inline-block object-cover rounded shadow-xs border border-gray-200 shrink-0 ${className}`}
    loading="eager"
  />
);

export const FlagSaudiArabia: React.FC<{ className?: string }> = ({ className = 'w-6 h-4' }) => (
  <img
    src={FLAG_SAUDI_ARABIA_URL}
    alt="Bendera Kerajaan Arab Saudi"
    className={`inline-block object-cover rounded shadow-xs border border-emerald-900/40 shrink-0 ${className}`}
    loading="eager"
  />
);

export const BilateralFlagsBadge: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  return (
    <div
      className={`inline-flex items-center gap-2.5 bg-gradient-to-r from-emerald-950/95 via-black/85 to-emerald-950/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-brand-gold/60 shadow-lg ${
        isSm ? 'text-[11px] py-1 px-2.5' : isLg ? 'text-sm py-2 px-5' : 'text-xs'
      }`}
    >
      <div className="flex items-center gap-1.5">
        <FlagIndonesia className={isSm ? 'w-5 h-3.5' : isLg ? 'w-8 h-5.5' : 'w-6 h-4'} />
        <span className="font-bold text-white tracking-wide">Indonesia</span>
      </div>

      <span className="text-brand-gold font-bold text-xs">-</span>

      <div className="flex items-center gap-1.5">
        <FlagSaudiArabia className={isSm ? 'w-5 h-3.5' : isLg ? 'w-8 h-5.5' : 'w-6 h-4'} />
        <span className="font-bold text-white tracking-wide">Arab Saudi</span>
      </div>
    </div>
  );
};
