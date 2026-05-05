// ============================================================
// MatchCard — displays a single match, highlights winner,
// opens the prediction or result modal on click.
// ============================================================

import type { Match } from '../../types';
import { useTournamentStore } from '../State/tournamentStore';
import './Bracket.css';

interface MatchCardProps {
  match: Match;
  onOpenPrediction: (matchId: string) => void;
  onOpenResult: (matchId: string) => void;
}

export function MatchCard({ match, onOpenPrediction, onOpenResult }: MatchCardProps) {
  const currentUser = useTournamentStore(s => s.currentUser);
  const predictions = useTournamentStore(s => s.predictions);

  const userPrediction = currentUser
    ? predictions.find(p => p.matchId === match.id && p.userId === currentUser.id)
    : undefined;

  const hasResult = !!match.result;
  const winnerTeam = match.result?.winner;

  function handleClick() {
    if (hasResult) {
      // Result already entered — open result modal to view/update
      onOpenResult(match.id);
    } else {
      // No result yet — open prediction modal
      onOpenPrediction(match.id);
    }
  }

  return (
    <button
      className={`match-card ${match.locked ? 'match-card--locked' : ''} ${hasResult ? 'match-card--finished' : ''}`}
      onClick={handleClick}
      title={match.locked ? 'Match locked' : 'Click to predict'}
    >
      {/* Lock badge */}
      {match.locked && <span className="match-card__lock">🔒</span>}

      {/* Team A row */}
      <div className={`match-card__team ${winnerTeam === match.teamA ? 'match-card__team--winner' : ''}`}>
        <span className="match-card__team-name">{match.teamA}</span>
        {hasResult && (
          <span className="match-card__score">{match.result!.finalScore.teamA}</span>
        )}
      </div>

      {/* Divider */}
      <div className="match-card__divider">vs</div>

      {/* Team B row */}
      <div className={`match-card__team ${winnerTeam === match.teamB ? 'match-card__team--winner' : ''}`}>
        <span className="match-card__team-name">{match.teamB}</span>
        {hasResult && (
          <span className="match-card__score">{match.result!.finalScore.teamB}</span>
        )}
      </div>

      {/* Prediction indicator */}
      {userPrediction && !hasResult && (
        <div className="match-card__predicted">✓ Predicted</div>
      )}
    </button>
  );
}
