// ============================================================
// Scoring Engine — pure function, no UI logic, no state mutation
//
// Usage:
//   const { totalPoints, breakdown } = calculatePoints(result, prediction, rules);
// ============================================================

import type { MatchResult, Prediction, ScoringRule, ScoringRuleKey } from '../../types';

export interface ScoreBreakdown {
  /** Rule that was evaluated */
  ruleKey: ScoringRuleKey;
  /** Points awarded for this rule (0 if condition not met or rule disabled) */
  pointsAwarded: number;
  /** Whether the condition for this rule was satisfied */
  conditionMet: boolean;
}

export interface ScoringResult {
  totalPoints: number;
  breakdown: ScoreBreakdown[];
}

/**
 * Calculate points for a single prediction against a match result.
 *
 * Rules are applied independently and their points stack.
 * A disabled rule contributes 0 points and is still included in the
 * breakdown (conditionMet: false) so the UI can explain why it was skipped.
 *
 * @param result     - The official match result
 * @param prediction - The user's prediction for that match
 * @param rules      - The tournament's scoring rule definitions
 * @returns          totalPoints + per-rule breakdown
 */
export function calculatePoints(
  result: MatchResult,
  prediction: Prediction,
  rules: ScoringRule[],
): ScoringResult {
  const breakdown: ScoreBreakdown[] = [];

  for (const rule of rules) {
    const conditionMet = rule.enabled && evaluateCondition(rule.ruleKey, result, prediction);
    breakdown.push({
      ruleKey: rule.ruleKey,
      pointsAwarded: conditionMet ? rule.points : 0,
      conditionMet,
    });
  }

  const totalPoints = breakdown.reduce((sum, entry) => sum + entry.pointsAwarded, 0);

  return { totalPoints, breakdown };
}

// ---- Private helpers --------------------------------------------------------

/**
 * Evaluate a single rule condition.
 * Returns true only when the condition is satisfied.
 */
function evaluateCondition(
  ruleKey: ScoringRuleKey,
  result: MatchResult,
  prediction: Prediction,
): boolean {
  switch (ruleKey) {
    case 'correct_winner':
      // Predicted winner matches the official winner
      return prediction.predictedWinner === result.winner;

    case 'exact_score':
      // Both team scores match exactly
      return (
        prediction.predictedScore.teamA === result.finalScore.teamA &&
        prediction.predictedScore.teamB === result.finalScore.teamB
      );

    case 'goal_difference': {
      // Goal difference (margin) is the same, even if absolute scores differ
      const actualDiff = result.finalScore.teamA - result.finalScore.teamB;
      const predictedDiff =
        prediction.predictedScore.teamA - prediction.predictedScore.teamB;
      return actualDiff === predictedDiff;
    }

    case 'leading_scorer':
      // Predicted leading scorer matches the official leading scorer
      return prediction.predictedLeadingScorer === result.leadingScorer;

    default:
      // Exhaustiveness guard — should never reach here with valid rule keys
      return false;
  }
}
