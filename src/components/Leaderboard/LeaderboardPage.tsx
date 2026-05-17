// ============================================================
// LeaderboardPage — full-page leaderboard view
// Sorted: totalPoints → exactScoreHits → leadingScorerHits → earliest timestamp
// ============================================================

import { Table } from '../UI/Table';
import { useTournamentStore } from '../State/tournamentStore';
import type { LeaderboardEntry } from '../State/tournamentStore';
import './LeaderboardPage.css';

interface LeaderboardPageProps {
  onBack: () => void;
}

type LeaderboardRow = LeaderboardEntry & { rank: number };

// Trophy image — uses the transparent PNG from /public
function TrophyImg() {
  return (
    <img
      src="/thropy%20no%20background.png"
      alt="Trophy"
      className="lb-trophy-img"
    />
  );
}

const RANK_COLOR: Record<number, string> = {
  1: '#BF76B1',   /* RADCOM Light Purple */
  2: '#91D7EB',   /* RADCOM Light Blue */
  3: '#e9a123',   /* RADCOM Amber */
};

export function LeaderboardPage({ onBack }: LeaderboardPageProps) {
  const getLeaderboard = useTournamentStore(s => s.getLeaderboard);
  const currentUser  = useTournamentStore(s => s.currentUser);
  const entries      = getLeaderboard();

  const rows: LeaderboardRow[] = entries.map((entry, i) => ({
    ...entry,
    rank: i + 1,
  }));

  // Podium order: 2nd (left) | 1st (center, tallest) | 3rd (right)
  const podiumOrder = [
    rows.find(r => r.rank === 2),
    rows.find(r => r.rank === 1),
    rows.find(r => r.rank === 3),
  ].filter(Boolean) as LeaderboardRow[];

  const isYou = (row: LeaderboardRow) => currentUser?.id === row.userId;

  return (
    <div className="lb-page">
      <div className="lb-page__header">
        <button className="lb-page__back" onClick={onBack}>← Back</button>
        <div className="lb-page__heading">
          <h1 className="lb-page__title">Leaderboard</h1>
          <p className="lb-page__sub">Rankings update automatically when results are entered.</p>
        </div>
      </div>

      <div className="lb-page__content">
        {rows.length === 0 ? (
          <div className="lb-page__empty">
            <p>No predictions have been scored yet.</p>
            <p>Results will appear here once match outcomes are entered.</p>
          </div>
        ) : (
          <>
            {/* Podium — 2nd | 1st | 3rd */}
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

            {/* Full table */}
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
              rowClassName={(row) => (row._isYou ? 'table-row--you' : '')}
            />
          </>
        )}
      </div>
    </div>
  );
}
