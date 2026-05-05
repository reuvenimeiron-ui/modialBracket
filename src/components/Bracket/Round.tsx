// ============================================================
// Round — vertical list of MatchCards for one bracket round
// ============================================================

import type { Match } from '../../types';
import { MatchCard } from './MatchCard';
import './Bracket.css';

interface RoundProps {
  roundNumber: number;
  roundLabel: string;
  matches: Match[];
  onOpenPrediction: (matchId: string) => void;
  onOpenResult: (matchId: string) => void;
}

export function Round({ roundNumber, roundLabel, matches, onOpenPrediction, onOpenResult }: RoundProps) {
  // Suppress unused variable lint for roundNumber — kept for potential future use
  void roundNumber;

  return (
    <div className="round">
      <h3 className="round__label">{roundLabel}</h3>
      <div className="round__matches">
        {matches.map(match => (
          <MatchCard
            key={match.id}
            match={match}
            onOpenPrediction={onOpenPrediction}
            onOpenResult={onOpenResult}
          />
        ))}
      </div>
    </div>
  );
}
