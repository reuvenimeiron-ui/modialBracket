// ============================================================
// Shared domain types for the Tournament Bracket application
// ============================================================

// ----- User -----

export interface User {
  id: string;
  displayName: string;
  email: string;
  totalPoints: number;
  predictionHistory: Prediction[];
}

// ----- Tournament -----

export type TournamentStatus = 'upcoming' | 'active' | 'completed';

export interface Tournament {
  id: string;
  name: string;
  participants: string[]; // team names; count must be a power of 2
  matches: Match[];
  scoringRules: ScoringRule[];
  status: TournamentStatus;
}

// ----- Match -----

export interface Match {
  id: string;
  round: number;
  teamA: string;
  teamB: string;
  startTime: Date;
  locked: boolean;
  result?: MatchResult;
  /** true for the 3rd-place play-off match (shown separately from the main bracket) */
  isThirdPlace?: boolean;
}

// ----- Match Result -----

export interface MatchResult {
  finalScore: { teamA: number; teamB: number };
  winner: string; // team name
  leadingScorer: string; // player name
}

// ----- Prediction -----

export interface Prediction {
  userId: string;
  matchId: string;
  predictedWinner: string;
  predictedScore: { teamA: number; teamB: number };
  predictedLeadingScorer: string;
  timestamp: Date;
}

// ----- Scoring -----

/**
 * Strict set of allowed rule keys.
 */
export type ScoringRuleKey =
  | 'correct_winner'
  | 'exact_score'
  | 'goal_difference'
  | 'leading_scorer';

/**
 * A single scoring rule definition.
 *
 * ruleKey  — identifies which condition to evaluate
 * points   — points awarded when the condition is met
 * enabled  — when false the rule is skipped entirely
 */
export interface ScoringRule {
  ruleKey: ScoringRuleKey;
  points: number;
  enabled: boolean;
}
