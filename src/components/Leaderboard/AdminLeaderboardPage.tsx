// ============================================================
// AdminLeaderboardPage — admin-only "hidden" leaderboard screen.
// Shares the Home background (stadium + planes + flags + title logo)
// but replaces home content with the leaderboard.
// Only rendered when isAdmin === true (enforced in App.tsx).
// ============================================================

import { useTournamentStore } from '../State/tournamentStore';
import { Table } from '../UI/Table';
import type { LeaderboardEntry } from '../State/tournamentStore';
import '../Home/Home.css';
import '../Leaderboard/LeaderboardPage.css';
import './AdminLeaderboardPage.css';

// ── Shared plane config (kept in sync with Home.tsx) ─────────

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
const OLD_PLANE_SRCS: Record<number, string> = {
  1: '/plane1.svg',
  2: '/plane2.svg',
  3: '/plane3.svg',
};

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
  { customFlag: '/radcom%20waving%20flag/radcom%20waving%20flag%20final%201%20(1)_transparent.gif', planeType: 2, top: 28,  dur: 19, delay: 6,   dir: 'ltr' },
  { customFlag: '/radcom%20waving%20flag/radcom%20waving%20flag%20final%201%20(2)_transparent.gif', planeType: 3, top: 62,  dur: 16, delay: 13,  dir: 'rtl' },
  { customFlag: '/radcom%20waving%20flag/radcom%20waving%20flag%20final%201%20(1)_transparent.gif', planeType: 1, top: 75,  dur: 21, delay: 2,   dir: 'ltr' },
] as const;

// ── Leaderboard helpers ───────────────────────────────────────

const RANK_COLOR: Record<number, string> = {
  1: '#BF76B1',
  2: '#91D7EB',
  3: '#e9a123',
};

type LeaderboardRow = LeaderboardEntry & { rank: number };

function TrophyImg() {
  return (
    <img
      src="/thropy%20no%20background.png"
      alt="Trophy"
      className="lb-trophy-img"
    />
  );
}

// ── Component ─────────────────────────────────────────────────

export function AdminLeaderboardPage() {
  const debugLegacyPlanes = useTournamentStore(s => s.debugLegacyPlanes);
  const getLeaderboard    = useTournamentStore(s => s.getLeaderboard);
  const currentUser       = useTournamentStore(s => s.currentUser);
  const PLANE_SRCS        = debugLegacyPlanes ? OLD_PLANE_SRCS : NEW_PLANE_SRCS;

  const entries = getLeaderboard();
  const rows: LeaderboardRow[] = entries.map((e, i) => ({ ...e, rank: i + 1 }));

  const podiumOrder = [
    rows.find(r => r.rank === 2),
    rows.find(r => r.rank === 1),
    rows.find(r => r.rank === 3),
  ].filter(Boolean) as LeaderboardRow[];

  const isYou = (row: LeaderboardRow) => currentUser?.id === row.userId;

  return (
    <div className="home alb-screen">

      {/* ── Planes layer — identical to Home ─────────────────── */}
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
              {p.dir === 'ltr' && (
                'customFlag' in p
                  ? <img src={p.customFlag} className="home__plane-gif home__plane-gif--ltr" alt="" draggable="false" />
                  : <FlagIframe code={p.flagCode} flip />
              )}
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
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Intro header — identical to Home ─────────────────── */}
      <div className="home__intro">
        <div className="home__intro-title-row">
          <img src="/new%20symbols/World-Cup-2026-Logo-V3.png" alt="FIFA World Cup 2026" className="home__intro-wc-logo" />
          <h1 className="home__intro-title">
            <span className="home__intro-radcom-logo-wrap" role="img" aria-label="RADCOM's" />
            World Cup Challenge
          </h1>
        </div>
      </div>

      {/* ── Leaderboard content ───────────────────────────────── */}
      <div className="alb__panel">
        <h2 className="alb__heading">🏆 Live Leaderboard</h2>

        {rows.length === 0 ? (
          <p className="alb__empty">No results scored yet.</p>
        ) : (
          <>
            {/* Podium */}
            {podiumOrder.length >= 1 && (
              <div className="lb-page__podium">
                {podiumOrder.map(row => (
                  <div
                    key={row.userId}
                    className={[
                      'lb-podium-card',
                      `lb-podium-card--${row.rank}`,
                      isYou(row) ? 'lb-podium-card--you' : '',
                    ].filter(Boolean).join(' ')}
                  >
                    {row.rank === 1 && <TrophyImg />}
                    <span
                      className="lb-podium-card__rank-badge"
                      style={{ '--rank-color': RANK_COLOR[row.rank] ?? 'var(--text-muted)' } as React.CSSProperties}
                    >
                      {row.rank}
                    </span>
                    <span className="lb-podium-card__name">{row.displayName}{isYou(row) ? ' (you)' : ''}</span>
                    <span className="lb-podium-card__pts">{row.totalPoints}<span className="lb-podium-card__pts-label">pts</span></span>
                    <div className="lb-podium-card__base" />
                  </div>
                ))}
              </div>
            )}

            {/* Full table — scrollable inside the panel */}
            <div className="alb__table-wrap">
            <Table<Record<string, unknown>>
              columns={[
                { key: 'rank',              header: '#'            },
                { key: 'displayName',       header: 'Player'       },
                { key: 'totalPoints',       header: 'Points'       },
                { key: 'exactScoreHits',    header: 'Exact Scores' },
                { key: 'leadingScorerHits', header: 'Top Scorers'  },
              ]}
              rows={rows.map(r => ({
                ...r,
                _isYou: r.userId === currentUser?.id,
                displayName: r.userId === currentUser?.id ? `${r.displayName} (you)` : r.displayName,
              })) as unknown as Record<string, unknown>[]}
              rowKey={(_, i) => i}
              rowClassName={row => (row._isYou ? 'table-row--you' : '')}
            />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
