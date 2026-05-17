// ============================================================
// Home — landing page (redesigned hero + stats + bento grid)
// ============================================================

import './Home.css';
import { useTournamentStore } from '../State/tournamentStore';

// Maps ISO alpha-2 flag code → animated HTML filename in /flags/
const FLAG_FILES: Record<string, string> = {
  dz: 'Algeria',
  ar: 'Argentina',
  au: 'Australia',
  at: 'Austria',
  be: 'Belgium',
  ba: 'Bosnia',
  br: 'Brazil',
  ca: 'Canada',
  cv: 'Cape Verde',
  cd: 'Congo (DR)',
  hr: 'Croatia',
  cz: 'Czech Republic',
  ec: 'Ecuador',
  eg: 'Egypt',
  fr: 'France',
  de: 'Germany',
  gh: 'Ghana',
  ht: 'Haiti',
  ir: 'Iran',
  iq: 'Iraq',
  ci: 'Ivory Coast',
  jp: 'Japan',
  jo: 'Jordan',
  mx: 'Mexico',
  ma: 'Morocco',
  nl: 'Netherlands',
  nz: 'New Zealand',
  no: 'Norway',
  pa: 'Panama',
  py: 'Paraguay',
  pt: 'Portugal',
  qa: 'Qatar',
  sa: 'Saudi Arabia',
  sn: 'Senegal',
  za: 'South Africa',
  kr: 'South Korea',
  es: 'Spain',
  se: 'Sweden',
  ch: 'Switzerland',
  tn: 'Tunisia',
  tr: 'Turkey',
  us: 'United States of America',
  uy: 'Uruguay',
  uz: 'Uzbekistan',
};

function FlagIframe({ code, flip }: { code: string; flip?: boolean }) {
  const file = FLAG_FILES[code];
  if (!file) return null;
  return (
    <div className="home__plane-flag-wrap" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      <iframe
        src={`/flags/${encodeURIComponent(file)}.html`}
        className="home__plane-flag-iframe"
        scrolling="no"
        title={file}
      />
    </div>
  );
}
const NEW_PLANE_SRCS: Record<number, string> = {
  1: '/new%20symbols/airplane.png',
  2: '/new%20symbols/airplane-(2).png',
  3: '/new%20symbols/take-off.png',
};
// Legacy SVG sprites (debug fallback)
const OLD_PLANE_SRCS: Record<number, string> = {
  1: '/plane1.svg',
  2: '/plane2.svg',
  3: '/plane3.svg',
};
// New PNG sprites, keyed by planeType

interface HomeProps {
  onGoToBracket: () => void;
  onGoToLeaderboard: () => void;
  onOpenScoringRules: () => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onGoToCountries: () => void;
  currentUserName: string | null;
}

export function Home({
  onGoToBracket,
  onGoToLeaderboard,
  onOpenScoringRules,
  onOpenLogin,
  onOpenRegister,
  onGoToCountries,
  currentUserName,
}: HomeProps) {
  const debugLegacyPlanes = useTournamentStore(s => s.debugLegacyPlanes);
  const PLANE_SRCS = debugLegacyPlanes ? OLD_PLANE_SRCS : NEW_PLANE_SRCS;

  // Each plane: ISO flag code OR customFlag path, sprite type (1|2|3), position & animation settings
  const PLANES = [
    { flagCode: 'br', planeType: 1, top: 18,  dur: 14, delay: 0,   dir: 'ltr' },
    { flagCode: 'fr', planeType: 2, top: 34,  dur: 18, delay: 3,   dir: 'rtl' },
    { flagCode: 'ar', planeType: 3, top: 52,  dur: 12, delay: 1.5, dir: 'ltr' },
    { flagCode: 'de', planeType: 1, top: 68,  dur: 20, delay: 5,   dir: 'rtl' },
    { flagCode: 'es', planeType: 2, top: 22,  dur: 16, delay: 8,   dir: 'ltr' },
    { flagCode: 'jp', planeType: 3, top: 78,  dur: 13, delay: 2.5, dir: 'rtl' },
    { flagCode: 'pt', planeType: 1, top: 44,  dur: 22, delay: 7,   dir: 'ltr' },
    { flagCode: 'ma', planeType: 2, top: 12,  dur: 17, delay: 11,  dir: 'rtl' },
    { flagCode: 'us', planeType: 3, top: 60,  dur: 15, delay: 4,   dir: 'ltr' },
    { flagCode: 'nl', planeType: 1, top: 85,  dur: 19, delay: 9,   dir: 'rtl' },
    // RADCOM waving flag GIFs
    { customFlag: '/radcom%20waving%20flag/radcom%20waving%20flag%20final%201%20(1)_transparent.gif', planeType: 2, top: 28,  dur: 19, delay: 6,   dir: 'ltr' },
    { customFlag: '/radcom%20waving%20flag/radcom%20waving%20flag%20final%201%20(2)_transparent.gif', planeType: 3, top: 62,  dur: 16, delay: 13,  dir: 'rtl' },
    { customFlag: '/radcom%20waving%20flag/radcom%20waving%20flag%20final%201%20(1)_transparent.gif', planeType: 1, top: 75,  dur: 21, delay: 2,   dir: 'ltr' },
  ] as const;

  return (
    <div className="home">

      {/* ── Airplanes layer ───────────────────────────────────── */}
      <div className="home__planes" aria-hidden="true">
        {PLANES.map((p, i) => (
          <div
            key={i}
            className={`home__plane home__plane--${p.dir}`}
            style={{
              top: `${p.top}%`,
              animationDuration: `${p.dur}s`,
              animationDelay: `${p.delay}s`,
            }}
          >
            <div className="home__plane-body">
              {/* Flag or avatar — appears at the TAIL end (behind the plane) */}
              {p.dir === 'ltr' && (
                'customFlag' in p
                  ? <img src={p.customFlag} className="home__plane-gif home__plane-gif--ltr" alt="" draggable="false" />
                  : <FlagIframe code={p.flagCode} flip />
              )}
              {/* Plane sprite:
                   New PNGs face RIGHT → flip for RTL.
                   Legacy SVGs face LEFT → flip for LTR.
                   Type class (rotation correction) only applied to new PNGs. */}
              {(() => {
                const shouldFlip = debugLegacyPlanes ? p.dir === 'ltr' : p.dir === 'rtl';
                const typeClass  = debugLegacyPlanes ? '' : ` home__plane-img--type-${p.planeType}`;
                const flipClass  = shouldFlip ? ' home__plane-img--flip' : '';
                return (
                  <img
                    src={PLANE_SRCS[p.planeType]}
                    className={`home__plane-img${typeClass}${flipClass}`}
                    alt=""
                    draggable="false"
                  />
                );
              })()}
              {p.dir === 'rtl' && (
                'customFlag' in p
                  ? <img src={p.customFlag} className="home__plane-gif home__plane-gif--rtl" alt="" draggable="false" />
                  : <FlagIframe code={p.flagCode} />
              )} {/* rtl: no flip — pole at left, flag waves left naturally */}
            </div>
          </div>
        ))}
      </div>

      {/* ── Compact intro — title floats over the stadium bg ── */}
      <div className="home__intro">
        <div className="home__intro-title-row">
          <img src="/new%20symbols/World-Cup-2026-Logo-V3.png" alt="FIFA World Cup 2026" className="home__intro-wc-logo" />
          <h1 className="home__intro-title">
            <span className="home__intro-radcom-logo-wrap" role="img" aria-label="RADCOM's" />
            World Cup Challenge
          </h1>
        </div>
        {currentUserName ? (
          <div className="home__intro-welcome">
            Welcome back, <strong>{currentUserName}</strong> 👋
          </div>
        ) : (
          <div className="home__intro-auth">
            <button className="home__intro-btn home__intro-btn--solid" onClick={onOpenRegister}>
              Create Account
            </button>
            <button className="home__intro-btn home__intro-btn--ghost" onClick={onOpenLogin}>
              Sign In
            </button>
          </div>
        )}
      </div>

      {/* ── Stats ribbon ──────────────────────────────────────── */}
      <div className="home__stats">
        {([
          { value: '48',  label: 'Nations' },
          { value: '104', label: 'Matches' },
          { value: '3',   label: 'Host Nations' },
          { value: '6',   label: 'Confederations' },
        ] as const).map(s => (
          <div key={s.label} className="home__stat">
            <span className="home__stat-value">{s.value}</span>
            <span className="home__stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Bento navigation grid ─────────────────────────────── */}
      <div className="home__bento-section">
        <section className="home__bento">

          {/* Wide primary card — My Bracket */}
          <button className="home__card home__card--bracket" onClick={onGoToBracket}>
            <span className="home__card-icon">🏆</span>
            <div className="home__card-body">
              <span className="home__card-label">My Bracket</span>
              <span className="home__card-desc">Submit predictions for every match and track your score live</span>
            </div>
            <span className="home__card-arrow">→</span>
          </button>

          {/* Leaderboard */}
          <button className="home__card home__card--leaderboard" onClick={onGoToLeaderboard}>
            <span className="home__card-icon">📊</span>
            <span className="home__card-label">Leaderboard</span>
            <span className="home__card-desc">See who's leading the pack</span>
          </button>

          {/* All Nations */}
          <button className="home__card home__card--nations" onClick={onGoToCountries}>
            <span className="home__card-icon">🌍</span>
            <span className="home__card-label">All Nations</span>
            <span className="home__card-desc">Browse all 48 WC 2026 qualified teams</span>
          </button>

          {/* Scoring Rules */}
          <button className="home__card home__card--rules" onClick={onOpenScoringRules}>
            <span className="home__card-icon">⚙️</span>
            <span className="home__card-label">Scoring Rules</span>
            <span className="home__card-desc">How points are awarded</span>
          </button>

        </section>
      </div>

      {/* ── Footer note ────────────────────────────────────────── */}
      <p className="home__footer">USA · Canada · Mexico &nbsp;·&nbsp; June–July 2026</p>

    </div>
  );
}
