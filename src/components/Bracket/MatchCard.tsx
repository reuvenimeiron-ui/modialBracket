// ============================================================
// MatchSlot — a single match displayed as two stacked team
// rows, WC bracket card style.
// ============================================================

import type { Match } from '../../types';
import { useTournamentStore } from '../State/tournamentStore';
import { FlagImg } from '../UI/FlagImg';
import './Bracket.css';

interface MatchSlotProps {
  match: Match;
  onOpenPrediction: (matchId: string) => void;
  onOpenResult: (matchId: string) => void;
  isFinal?: boolean;
}

export function MatchSlot({ match, onOpenPrediction, onOpenResult, isFinal }: MatchSlotProps) {
  const currentUser = useTournamentStore(s => s.currentUser);
  const predictions = useTournamentStore(s => s.predictions);
  const isAdmin     = useTournamentStore(s => s.isAdmin);

  const userPrediction = currentUser
    ? predictions.find(p => p.matchId === match.id && p.userId === currentUser.id)
    : undefined;

  const hasResult  = !!match.result;
  const winnerTeam = match.result?.winner;

  function handleClick() {
    if (hasResult) {
      if (isAdmin) onOpenResult(match.id);
    } else if (match.locked) {
      // locked, no result — nothing to do
    } else {
      onOpenPrediction(match.id);
    }
  }

  const isTBD = (name: string) => name.startsWith('TBD');

  return (
    <button
      className={[
        'ms',
        isFinal           ? 'ms--final'    : '',
        match.locked      ? 'ms--locked'   : '',
        hasResult         ? 'ms--finished' : '',
        userPrediction && !hasResult ? 'ms--predicted' : '',
      ].filter(Boolean).join(' ')}
      onClick={handleClick}
      title={
        match.locked && !hasResult ? 'Match locked' :
        hasResult && isAdmin       ? 'Edit result'  :
        hasResult                  ? 'Match finished' :
        'Click to predict'
      }
    >
      {/* Team A */}
      <div className={`ms__team ${winnerTeam === match.teamA ? 'ms__team--winner' : ''} ${winnerTeam && winnerTeam !== match.teamA ? 'ms__team--loser' : ''}`}>
        <span className="ms__flag">
          {!isTBD(match.teamA) && <FlagImg teamName={match.teamA} size="sm" />}
        </span>
        <span className="ms__name">{match.teamA}</span>
        {hasResult && (
          <span className="ms__score-box">
            <span className="ms__score">{match.result!.finalScore.teamA}</span>
          </span>
        )}
      </div>

      {/* Divider */}
      <div className="ms__sep" />

      {/* Team B */}
      <div className={`ms__team ${winnerTeam === match.teamB ? 'ms__team--winner' : ''} ${winnerTeam && winnerTeam !== match.teamB ? 'ms__team--loser' : ''}`}>
        <span className="ms__flag">
          {!isTBD(match.teamB) && <FlagImg teamName={match.teamB} size="sm" />}
        </span>
        <span className="ms__name">{match.teamB}</span>
        {hasResult && (
          <span className="ms__score-box">
            <span className="ms__score">{match.result!.finalScore.teamB}</span>
          </span>
        )}
      </div>

      {/* Badges */}
      {match.locked && !hasResult && (
        <span className="ms__badge ms__badge--lock">
          {/* Padlock icon */}
          <svg width="9" height="9" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" style={{marginRight:'2px',verticalAlign:'middle',flexShrink:0}}>
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
          </svg>
          LOCKED
        </span>
      )}
      {userPrediction && !hasResult && (
        <span className="ms__badge ms__badge--pred">
          {/* Star icon */}
          <svg width="9" height="9" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" style={{marginRight:'2px',verticalAlign:'middle',flexShrink:0}}>
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
          PRED
        </span>
      )}
    </button>
  );
}
