// ============================================================
// LeaderboardModal — read-only sorted leaderboard table
//
// Data is derived via getLeaderboard() selector (never stored).
// Sorting: totalPoints → exactScoreHits → leadingScorerHits → earliest timestamp
// ============================================================

import { Modal } from '../UI/Modal';
import { Table } from '../UI/Table';
import { useTournamentStore } from '../State/tournamentStore';
import type { LeaderboardEntry } from '../State/tournamentStore';
import './Modals.css';

interface LeaderboardModalProps {
  onClose: () => void;
}

type LeaderboardRow = LeaderboardEntry & { rank: number };

export function LeaderboardModal({ onClose }: LeaderboardModalProps) {
  const getLeaderboard = useTournamentStore(s => s.getLeaderboard);
  const entries = getLeaderboard();

  const rows: LeaderboardRow[] = entries.map((entry, i) => ({
    ...entry,
    rank: i + 1,
  }));

  return (
    <Modal title="Leaderboard" onClose={onClose}>
      <Table<Record<string, unknown>>
        columns={[
          { key: 'rank', header: '#' },
          { key: 'displayName', header: 'Player' },
          { key: 'totalPoints', header: 'Points' },
          { key: 'exactScoreHits', header: 'Exact Scores' },
          { key: 'leadingScorerHits', header: 'Top Scorers' },
        ]}
        rows={rows as unknown as Record<string, unknown>[]}
        rowKey={(_, i) => i}
      />
    </Modal>
  );
}
