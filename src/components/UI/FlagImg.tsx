// ============================================================
// FlagImg — renders a flag image from flagcdn.com
// Uses ISO 3166-1 alpha-2 codes (e.g. "fr", "br", "gb-eng")
//
// flagcdn.com valid 'w' sizes: 20, 40, 80, 160, 320, 640
// ============================================================

import { getFlagCode } from '../../data/countries';

interface FlagImgProps {
  teamName: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Only use valid flagcdn.com widths: 20, 40, 80
const SIZE_MAP = { sm: 20, md: 40, lg: 80 };
// 2× srcSet widths
const SIZE_2X   = { sm: 40, md: 80, lg: 160 };

export function FlagImg({ teamName, size = 'sm', className = '' }: FlagImgProps) {
  const code = getFlagCode(teamName);
  if (!code) return null;

  const px  = SIZE_MAP[size];
  const px2 = SIZE_2X[size];
  const src    = `https://flagcdn.com/w${px}/${code}.png`;
  const src2x  = `https://flagcdn.com/w${px2}/${code}.png`;

  return (
    <img
      src={src}
      srcSet={`${src2x} 2x`}
      width={px}
      height={Math.round(px * 0.67)}
      alt={teamName}
      title={teamName}
      className={`flag-img ${className}`}
      loading="lazy"
      style={{ display: 'inline-block', borderRadius: 2, objectFit: 'cover', flexShrink: 0, border: '1px solid #e2e8f0' }}
    />
  );
}
