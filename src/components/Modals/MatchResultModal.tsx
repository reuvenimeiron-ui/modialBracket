// ============================================================
// MatchResultModal
//
// Organizer-only (no role enforcement for MVP).
// Enter final score, winner, and leading scorer.
// Submit calls submitResult → scoring engine runs → leaderboard updates.
// ============================================================

import { useState } from 'react';
import { Modal } from '../UI/Modal';
import { Button } from '../UI/Button';
import { useTournamentStore } from '../State/tournamentStore';
import type { MatchResult } from '../../types';
import './Modals.css';

interface MatchResultModalProps {
  matchId: string;
  onClose: () => void;
}

export function MatchResultModal({ matchId, onClose }: MatchResultModalProps) {
  const tournament = useTournamentStore(s => s.tournament);
  const submitResult = useTournamentStore(s => s.submitResult);

  const match = tournament?.matches.find(m => m.id === matchId);

  // Pre-fill if result already exists
  const existing = match?.result;
  const [scoreA, setScoreA] = useState(existing?.finalScore.teamA ?? 0);
  const [scoreB, setScoreB] = useState(existing?.finalScore.teamB ?? 0);
  const [winner, setWinner] = useState(existing?.winner ?? '');
  const [leadingScorer, setLeadingScorer] = useState(existing?.leadingScorer ?? '');
  const [error, setError] = useState('');
  const [flash, setFlash] = useState(false);

  if (!match) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!winner) {
      setError('Please select a winner.');
      return;
    }
    if (!leadingScorer.trim()) {
      setError('Please enter the leading scorer.');
      return;
    }

    const result: MatchResult = {
      finalScore: { teamA: scoreA, teamB: scoreB },
      winner,
      leadingScorer: leadingScorer.trim(),
    };

    submitResult(matchId, result);
    setFlash(true);
    setTimeout(onClose, 800);
  }

  return (
    <Modal title={`Result: ${match.teamA} vs ${match.teamB}`} onClose={onClose}>
      <form className={`modal-form${flash ? ' form--result-flash' : ''}`} onSubmit={handleSubmit}>

        {/* Score */}
        <fieldset className="modal-fieldset">
          <legend className="modal-legend">Final Score</legend>
          <div className="modal-score-row">
            <span className="modal-score-team">{match.teamA}</span>
            <input
              className="modal-score-input"
              type="number"
              min={0}
              value={scoreA}
              onChange={e => setScoreA(Math.max(0, parseInt(e.target.value, 10) || 0))}
            />
            <span className="modal-score-sep">–</span>
            <input
              className="modal-score-input"
              type="number"
              min={0}
              value={scoreB}
              onChange={e => setScoreB(Math.max(0, parseInt(e.target.value, 10) || 0))}
            />
            <span className="modal-score-team">{match.teamB}</span>
          </div>
        </fieldset>

        {/* Winner picker */}
        <fieldset className="modal-fieldset">
          <legend className="modal-legend">Winner</legend>
          <div className="modal-radio-group">
            {[match.teamA, match.teamB].map(team => (
              <label key={team} className="modal-radio-label">
                <input
                  type="radio"
                  name="winner"
                  value={team}
                  checked={winner === team}
                  onChange={() => setWinner(team)}
                />
                {team}
              </label>
            ))}
          </div>
        </fieldset>

        {/* Leading scorer */}
        <fieldset className="modal-fieldset">
          <legend className="modal-legend">Leading Scorer</legend>
          <input
            className="modal-text-input"
            type="text"
            placeholder="Player name"
            value={leadingScorer}
            onChange={e => setLeadingScorer(e.target.value)}
          />
        </fieldset>

        {error && <p className="modal-error">{error}</p>}

        <div className="modal-actions">
          <Button type="submit" variant="primary">
            {existing ? 'Update Result' : 'Submit Result'}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
        </div>
      </form>
    </Modal>
  );
}
