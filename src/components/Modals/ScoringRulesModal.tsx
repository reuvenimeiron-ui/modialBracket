// ============================================================
// ScoringRulesModal — read-only display of tournament scoring rules
// ============================================================

import { Modal } from '../UI/Modal';
import { useTournamentStore } from '../State/tournamentStore';
import type { ScoringRule } from '../../types';
import './Modals.css';

interface ScoringRulesModalProps {
  onClose: () => void;
}

const RULE_LABELS: Record<ScoringRule['ruleKey'], string> = {
  correct_winner: 'Correct Winner',
  exact_score: 'Exact Score',
  goal_difference: 'Correct Goal Difference',
  leading_scorer: 'Correct Leading Scorer',
};

export function ScoringRulesModal({ onClose }: ScoringRulesModalProps) {
  const tournament = useTournamentStore(s => s.tournament);
  const rules = tournament?.scoringRules ?? [];

  return (
    <Modal title="Scoring Rules" onClose={onClose}>
      {rules.length === 0 ? (
        <p className="modal-info">No scoring rules defined.</p>
      ) : (
        <ul className="scoring-rules-list">
          {rules.map(rule => (
            <li
              key={rule.ruleKey}
              className={`scoring-rules-item ${!rule.enabled ? 'scoring-rules-item--disabled' : ''}`}
            >
              <span className="scoring-rules-label">{RULE_LABELS[rule.ruleKey]}</span>
              <span className="scoring-rules-points">
                {rule.enabled ? `+${rule.points} pts` : 'Disabled'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
