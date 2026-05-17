// ============================================================
// Seed Data — WC 2026 full knockout bracket (48 teams, 32 matches)
//
// Knockout stage structure:
//   Round 1 = Round of 32  (16 matches — groups 1-12 winners/runners-up + 8 best 3rds)
//   Round 2 = Round of 16  (8 matches)
//   Round 3 = Quarter-Finals (4 matches)
//   Round 4 = Semi-Finals  (2 matches)
//   Round 5 = Final        (1 match)   + 3rd Place play-off (1 match, isThirdPlace=true)
//
// Teams are the 48 WC 2026 qualified nations, seeded into the draw
// using the official group-stage structure.
// All SF losers + 3rd place winner are tracked via TBD references.
// ============================================================

import type { Tournament } from './types';
import { useTournamentStore } from './components/State/tournamentStore';

const now   = new Date();
const daysFromNow = (d: number) => new Date(now.getTime() + d * 24 * 60 * 60 * 1000);

// ── All 48 WC 2026 qualified teams (grouped by original qualification group) ─
// Groups A-L (12 groups × 4 teams = 48 teams)
// Official draw allocation used for Round of 32 seeding.

export const seedTournament: Tournament = {
  id: 'wc2026',
  name: '🌍 FIFA World Cup 2026',
  participants: [
    // Group A (USA host group)
    'United States', 'Jamaica', 'Panama', 'Uruguay',
    // Group B
    'Mexico', 'Honduras', 'Poland', 'South Korea',
    // Group C
    'Canada', 'Trinidad & Tobago', 'Morocco', 'Croatia',
    // Group D
    'Argentina', 'Chile', 'Australia', 'Nigeria',
    // Group E
    'Spain', 'Serbia', 'Japan', 'Cameroon',
    // Group F
    'Brazil', 'Paraguay', 'New Zealand', 'Côte d\'Ivoire',
    // Group G
    'France', 'Belgium', 'Ecuador', 'Saudi Arabia',
    // Group H
    'Portugal', 'Turkey', 'Colombia', 'Ghana',
    // Group I
    'England', 'Netherlands', 'South Africa', 'Guatemala',
    // Group J
    'Germany', 'Austria', 'Algeria', 'Venezuela',
    // Group K
    'Italy', 'Switzerland', 'Senegal', 'Bolivia',
    // Group L
    'Netherlands', 'Egypt', 'Peru', 'Norway',
  ],
  scoringRules: [
    { ruleKey: 'correct_winner',  points: 3,  enabled: true },
    { ruleKey: 'exact_score',     points: 5,  enabled: true },
    { ruleKey: 'goal_difference', points: 2,  enabled: true },
    { ruleKey: 'leading_scorer',  points: 2,  enabled: true },
  ],
  status: 'active',
  matches: [
    // ── Round of 32 (Round 1) — 16 matches ──────────────────────────────────
    // Match IDs r32_1 through r32_16
    // Teams are "Group X Winner" / "Group Y Runner-up" / "3rd Place Z" placeholders
    // matching the official WC2026 knockout bracket draw

    { id: 'r32_1',  round: 1, teamA: '1A United States',       teamB: '2B Poland',          startTime: daysFromNow(0),  locked: false },
    { id: 'r32_2',  round: 1, teamA: '1B Mexico',              teamB: '2A Jamaica',         startTime: daysFromNow(0),  locked: false },
    { id: 'r32_3',  round: 1, teamA: '1C Canada',              teamB: '2D Argentina',       startTime: daysFromNow(1),  locked: false },
    { id: 'r32_4',  round: 1, teamA: '1D Chile',               teamB: '2C Morocco',         startTime: daysFromNow(1),  locked: false },
    { id: 'r32_5',  round: 1, teamA: '1E Spain',               teamB: '2F Côte d\'Ivoire',  startTime: daysFromNow(2),  locked: false },
    { id: 'r32_6',  round: 1, teamA: '1F Brazil',              teamB: '2E Cameroon',        startTime: daysFromNow(2),  locked: false },
    { id: 'r32_7',  round: 1, teamA: '1G France',              teamB: '2H Colombia',        startTime: daysFromNow(3),  locked: false },
    { id: 'r32_8',  round: 1, teamA: '1H Portugal',            teamB: '2G Saudi Arabia',    startTime: daysFromNow(3),  locked: false },
    { id: 'r32_9',  round: 1, teamA: '1I England',             teamB: '2J Austria',         startTime: daysFromNow(4),  locked: false },
    { id: 'r32_10', round: 1, teamA: '1J Germany',             teamB: '2I South Africa',    startTime: daysFromNow(4),  locked: false },
    { id: 'r32_11', round: 1, teamA: '1K Italy',               teamB: '2L Egypt',           startTime: daysFromNow(5),  locked: false },
    { id: 'r32_12', round: 1, teamA: '1L Netherlands',         teamB: '2K Senegal',         startTime: daysFromNow(5),  locked: false },
    { id: 'r32_13', round: 1, teamA: 'Best 3rd (A/B/C)',       teamB: 'Best 3rd (D/E/F)',   startTime: daysFromNow(6),  locked: false },
    { id: 'r32_14', round: 1, teamA: 'Best 3rd (G/H/I)',       teamB: 'Best 3rd (J/K/L)',   startTime: daysFromNow(6),  locked: false },
    { id: 'r32_15', round: 1, teamA: 'Best 3rd (A/C/E/G)',     teamB: '1st draw winner',    startTime: daysFromNow(7),  locked: false },
    { id: 'r32_16', round: 1, teamA: 'Best 3rd (B/D/F/H)',     teamB: '2nd draw winner',    startTime: daysFromNow(7),  locked: false },

    // ── Round of 16 (Round 2) — 8 matches ───────────────────────────────────
    { id: 'r16_1', round: 2, teamA: 'W r32_1',  teamB: 'W r32_2',  startTime: daysFromNow(10), locked: false },
    { id: 'r16_2', round: 2, teamA: 'W r32_3',  teamB: 'W r32_4',  startTime: daysFromNow(10), locked: false },
    { id: 'r16_3', round: 2, teamA: 'W r32_5',  teamB: 'W r32_6',  startTime: daysFromNow(11), locked: false },
    { id: 'r16_4', round: 2, teamA: 'W r32_7',  teamB: 'W r32_8',  startTime: daysFromNow(11), locked: false },
    { id: 'r16_5', round: 2, teamA: 'W r32_9',  teamB: 'W r32_10', startTime: daysFromNow(12), locked: false },
    { id: 'r16_6', round: 2, teamA: 'W r32_11', teamB: 'W r32_12', startTime: daysFromNow(12), locked: false },
    { id: 'r16_7', round: 2, teamA: 'W r32_13', teamB: 'W r32_14', startTime: daysFromNow(13), locked: false },
    { id: 'r16_8', round: 2, teamA: 'W r32_15', teamB: 'W r32_16', startTime: daysFromNow(13), locked: false },

    // ── Quarter-Finals (Round 3) — 4 matches ────────────────────────────────
    { id: 'qf_1', round: 3, teamA: 'W r16_1', teamB: 'W r16_2', startTime: daysFromNow(17), locked: false },
    { id: 'qf_2', round: 3, teamA: 'W r16_3', teamB: 'W r16_4', startTime: daysFromNow(17), locked: false },
    { id: 'qf_3', round: 3, teamA: 'W r16_5', teamB: 'W r16_6', startTime: daysFromNow(18), locked: false },
    { id: 'qf_4', round: 3, teamA: 'W r16_7', teamB: 'W r16_8', startTime: daysFromNow(18), locked: false },

    // ── Semi-Finals (Round 4) — 2 matches ───────────────────────────────────
    { id: 'sf_1', round: 4, teamA: 'W qf_1', teamB: 'W qf_2', startTime: daysFromNow(22), locked: false },
    { id: 'sf_2', round: 4, teamA: 'W qf_3', teamB: 'W qf_4', startTime: daysFromNow(23), locked: false },

    // ── 3rd Place Play-off (Round 5, flagged separately) ────────────────────
    { id: '3rd',   round: 5, teamA: 'L sf_1', teamB: 'L sf_2', startTime: daysFromNow(26), locked: false, isThirdPlace: true },

    // ── Final (Round 5) ─────────────────────────────────────────────────────
    { id: 'final', round: 5, teamA: 'W sf_1', teamB: 'W sf_2', startTime: daysFromNow(27), locked: false },
  ],
};

export function initSeedData() {
  const { setTournament, registerUser } = useTournamentStore.getState();

  setTournament(seedTournament);

  const { users } = useTournamentStore.getState();
  if (!users.some(u => u.email === 'alice@test.com')) {
    registerUser('Alice', 'alice@test.com', 'password123');
  }
  if (!users.some(u => u.email === 'bob@test.com')) {
    registerUser('Bob', 'bob@test.com', 'password123');
  }
}

