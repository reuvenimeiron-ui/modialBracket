// ============================================================
// MatchPredictionModal
//
// Allows the current user to submit or edit a prediction for a match.
// All inputs are disabled when match.locked === true.
// Saving calls setPrediction (overwrites any existing prediction).
// ============================================================

import { useState } from 'react';
import { Modal } from '../UI/Modal';
import { Button } from '../UI/Button';
import { useTournamentStore } from '../State/tournamentStore';
import type { Prediction } from '../../types';
import './Modals.css';

interface MatchPredictionModalProps {
  matchId: string;
  onClose: () => void;
}

export function MatchPredictionModal({ matchId, onClose }: MatchPredictionModalProps) {
  const currentUser = useTournamentStore(s => s.currentUser);
  const tournament = useTournamentStore(s => s.tournament);
  const predictions = useTournamentStore(s => s.predictions);
  const setPrediction = useTournamentStore(s => s.setPrediction);

  const match = tournament?.matches.find(m => m.id === matchId);

  // Pre-fill with existing prediction if present
  const existing = currentUser
    ? predictions.find(p => p.matchId === matchId && p.userId === currentUser.id)
    : undefined;

  const [predictedWinner, setPredictedWinner] = useState(existing?.predictedWinner ?? '');
  const [scoreA, setScoreA] = useState(existing?.predictedScore.teamA ?? 0);
  const [scoreB, setScoreB] = useState(existing?.predictedScore.teamB ?? 0);
  const [leadingScorer, setLeadingScorer] = useState(existing?.predictedLeadingScorer ?? '');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  if (!match) return null;

  const locked = match.locked;
  const title = locked ? `${match.teamA} vs ${match.teamB} — Locked` : `Predict: ${match.teamA} vs ${match.teamB}`;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!currentUser) {
      setError('You must be logged in to submit a prediction.');
      return;
    }
    if (!predictedWinner) {
      setError('Please select a predicted winner.');
      return;
    }
    if (!leadingScorer.trim()) {
      setError('Please enter a leading scorer.');
      return;
    }

    const prediction: Prediction = {
      userId: currentUser.id,
      matchId,
      predictedWinner,
      predictedScore: { teamA: scoreA, teamB: scoreB },
      predictedLeadingScorer: leadingScorer.trim(),
      timestamp: new Date(),
    };

    setPrediction(prediction);
    setSaved(true);
    setTimeout(onClose, 700); // short celebrate delay then close
  }

  return (
    <Modal title={title} onClose={onClose}>
      {saved && <div className="confetti-burst" aria-hidden="true">{Array.from({length:12}).map((_,i) => <span key={i} className="confetti-piece" style={{'--i': i} as React.CSSProperties} />)}</div>}
      <form className={`modal-form${saved ? ' form--saved' : ''}`} onSubmit={handleSubmit}>

        {/* Winner picker */}
        <fieldset className="modal-fieldset" disabled={locked}>
          <legend className="modal-legend">Predicted Winner</legend>
          <div className="modal-radio-group">
            {[match.teamA, match.teamB].map(team => (
              <label key={team} className="modal-radio-label">
                <input
                  type="radio"
                  name="winner"
                  value={team}
                  checked={predictedWinner === team}
                  onChange={() => setPredictedWinner(team)}
                />
                {team}
              </label>
            ))}
          </div>
        </fieldset>

        {/* Score */}
        <fieldset className="modal-fieldset" disabled={locked}>
          <legend className="modal-legend">Predicted Score</legend>
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

        {/* Leading scorer */}
        <fieldset className="modal-fieldset" disabled={locked}>
          <legend className="modal-legend">
            {/* Boot/cleat icon */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{marginRight:'5px',verticalAlign:'middle',flexShrink:0}}>
              <path d="M20.5 15H17v-4.5A1.5 1.5 0 0015.5 9H9V6.5A.5.5 0 008.5 6h-3A.5.5 0 005 6.5v11a.5.5 0 00.5.5h15a.5.5 0 00.5-.5V16a1 1 0 00-1-1z"/>
            </svg>
            Predicted Leading Scorer
          </legend>
          <input
            className="modal-text-input"
            type="text"
            placeholder="Player name"
            value={leadingScorer}
            onChange={e => setLeadingScorer(e.target.value)}
          />
        </fieldset>

        {locked && (
          <p className="modal-info">This match is locked. Predictions can no longer be edited.</p>
        )}

        {!currentUser && (
          <p className="modal-info">Log in to submit a prediction.</p>
        )}

        {error && <p className="modal-error">{error}</p>}

        <div className="modal-actions">
          <Button type="submit" variant="primary" disabled={locked || !currentUser}>
            {existing ? 'Update Prediction' : 'Save Prediction'}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>Close</Button>
        </div>
      </form>
    </Modal>
  );
}
