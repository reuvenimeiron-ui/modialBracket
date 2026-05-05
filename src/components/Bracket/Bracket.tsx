// ============================================================
// Bracket — full single-elimination bracket, always visible.
//
// Assumptions:
//   - Participant count is a power of 2 (8 / 16 / 32)
//   - match.round is 1-indexed (1 = first round, N = final)
//   - Rounds are displayed horizontally, left to right
// ============================================================

import { useMemo } from 'react';
import { useTournamentStore } from '../State/tournamentStore';
import { Round } from './Round';
import type { Match } from '../../types';
import './Bracket.css';

interface BracketProps {
  onOpenPrediction: (matchId: string) => void;
  onOpenResult: (matchId: string) => void;
}

/** Human-readable round label derived from total rounds and current round number */
function getRoundLabel(roundNumber: number, totalRounds: number): string {
  const roundsFromFinal = totalRounds - roundNumber;
  switch (roundsFromFinal) {
    case 0: return 'Final';
    case 1: return 'Semi-Finals';
    case 2: return 'Quarter-Finals';
    default: return `Round ${roundNumber}`;
  }
}

export function Bracket({ onOpenPrediction, onOpenResult }: BracketProps) {
  const tournament = useTournamentStore(s => s.tournament);

  // Group matches by round number, sorted ascending
  const rounds = useMemo<{ roundNumber: number; label: string; matches: Match[] }[]>(() => {
    if (!tournament) return [];

    const roundMap = new Map<number, Match[]>();
    for (const match of tournament.matches) {
      if (!roundMap.has(match.round)) roundMap.set(match.round, []);
      roundMap.get(match.round)!.push(match);
    }

    const sortedRoundNumbers = Array.from(roundMap.keys()).sort((a, b) => a - b);
    const totalRounds = sortedRoundNumbers.length;

    return sortedRoundNumbers.map(rn => ({
      roundNumber: rn,
      label: getRoundLabel(rn, totalRounds),
      matches: roundMap.get(rn)!,
    }));
  }, [tournament]);

  if (!tournament) {
    return (
      <div className="bracket bracket--empty">
        <p>No tournament loaded.</p>
      </div>
    );
  }

  return (
    <div className="bracket">
      <h2 className="bracket__title">{tournament.name}</h2>
      <div className="bracket__rounds">
        {rounds.map(r => (
          <Round
            key={r.roundNumber}
            roundNumber={r.roundNumber}
            roundLabel={r.label}
            matches={r.matches}
            onOpenPrediction={onOpenPrediction}
            onOpenResult={onOpenResult}
          />
        ))}
      </div>
    </div>
  );
}
