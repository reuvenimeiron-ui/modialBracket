// ============================================================
// Tournament Store — global state via Zustand
//
// Rules enforced here:
//   - One prediction per (userId, matchId); setPrediction overwrites
//   - submitResult stores result, calls scoring engine, updates user.totalPoints
//   - Leaderboard is DERIVED ONLY — not stored, computed via selector
// ============================================================

import { create } from 'zustand';
import type { User, Tournament, Match, MatchResult, Prediction } from '../../types';
import { calculatePoints } from '../Scoring/scoringEngine';
import { pushDebugLog } from '../Users/debugLog';

// ---- Leaderboard row (derived, never stored) --------------------------------

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  totalPoints: number;
  exactScoreHits: number;
  leadingScorerHits: number;
  /** Earliest prediction timestamp — used as tiebreaker */
  earliestPrediction: Date | null;
}

// ---- Store shape ------------------------------------------------------------

interface TournamentState {
  users: User[];
  currentUser: User | null;
  tournament: Tournament | null;
  predictions: Prediction[];

  // Auth actions
  registerUser: (displayName: string, email: string, password: string) => void;
  loginUser: (email: string, password: string) => boolean;
  logoutUser: () => void;

  // Prediction action
  setPrediction: (prediction: Prediction) => void;

  // Result action
  submitResult: (matchId: string, result: MatchResult) => void;

  // Lock action
  lockMatch: (matchId: string) => void;

  // Tournament initialiser (used by seed data)
  setTournament: (tournament: Tournament) => void;

  // Leaderboard selector (derived)
  getLeaderboard: () => LeaderboardEntry[];

  // Admin mode (client-only MVP — no real security boundary)
  isAdmin: boolean;
  setAdminMode: (password: string) => boolean;
  exitAdminMode: () => void;

  // Debug-only actions (admin panel)
  debugUnlockMatch: (matchId: string) => void;
  debugSwitchUser: (userId: string) => void;

  // Debug UI flags
  debugLegacyPlanes: boolean;
  setDebugLegacyPlanes: (v: boolean) => void;
}

// ---- Simple in-memory password store (MVP only — no real auth) --------------
// Passwords are stored as plain strings because this is a client-only MVP
// with no backend, no persistence, and no security boundary.
const _passwordMap = new Map<string, string>(); // email → password

// ---- Store implementation ---------------------------------------------------

export const useTournamentStore = create<TournamentState>((set, get) => ({
  users: [],
  currentUser: null,
  tournament: null,
  predictions: [],

  // ---------- Auth -----------------------------------------------------------

  registerUser(displayName, email, password) {
    const { users } = get();

    // Reject duplicate email
    if (users.some(u => u.email === email)) return;

    const newUser: User = {
      id: crypto.randomUUID(),
      displayName,
      email,
      totalPoints: 0,
      predictionHistory: [],
    };

    _passwordMap.set(email, password);
    set(state => ({ users: [...state.users, newUser], currentUser: newUser }));
    pushDebugLog('register', `Registered "${displayName}"`, email);
  },

  loginUser(email, password) {
    const storedPassword = _passwordMap.get(email);
    if (storedPassword !== password) {
      pushDebugLog('error', `Login failed for ${email}`);
      return false;
    }

    const user = get().users.find(u => u.email === email);
    if (!user) return false;

    set({ currentUser: user });
    pushDebugLog('login', `Logged in as "${user.displayName}"`, email);
    return true;
  },

  logoutUser() {
    const name = get().currentUser?.displayName ?? '?';
    set({ currentUser: null });
    pushDebugLog('logout', `"${name}" logged out`);
  },

  // ---------- Predictions ----------------------------------------------------

  setPrediction(prediction) {
    set(state => {
      // Find existing prediction for same (userId, matchId) and overwrite
      const filtered = state.predictions.filter(
        p => !(p.userId === prediction.userId && p.matchId === prediction.matchId),
      );
      return { predictions: [...filtered, prediction] };
    });
    const match = get().tournament?.matches.find(m => m.id === prediction.matchId);
    const user  = get().users.find(u => u.id === prediction.userId);
    const label = match ? `${match.teamA} vs ${match.teamB}` : prediction.matchId;
    pushDebugLog(
      'prediction',
      `"${user?.displayName ?? prediction.userId}" predicted ${label}`,
      `winner=${prediction.predictedWinner} score=${prediction.predictedScore.teamA}-${prediction.predictedScore.teamB} scorer=${prediction.predictedLeadingScorer}`,
    );
  },

  // ---------- Results --------------------------------------------------------

  submitResult(matchId, result) {
    const { tournament, predictions, users } = get();
    if (!tournament) return;

    // 1. Store result and mark match as locked
    const updatedMatches = tournament.matches.map(m =>
      m.id === matchId ? { ...m, result, locked: true } : m,
    );
    const updatedTournament: Tournament = { ...tournament, matches: updatedMatches };

    // 2. Award points to each user who predicted this match
    const matchPredictions = predictions.filter(p => p.matchId === matchId);
    const updatedUsers = users.map(user => {
      const userPrediction = matchPredictions.find(p => p.userId === user.id);
      if (!userPrediction) return user;

      const { totalPoints: earned } = calculatePoints(
        result,
        userPrediction,
        tournament.scoringRules,
      );

      return {
        ...user,
        totalPoints: user.totalPoints + earned,
        predictionHistory: [...user.predictionHistory, userPrediction],
      };
    });

    // 3. Sync currentUser if it was updated
    const newCurrentUser = get().currentUser
      ? (updatedUsers.find(u => u.id === get().currentUser!.id) ?? get().currentUser)
      : null;

    set({ tournament: updatedTournament, users: updatedUsers, currentUser: newCurrentUser });

    const match = tournament.matches.find(m => m.id === matchId);
    const label = match ? `${match.teamA} vs ${match.teamB}` : matchId;
    pushDebugLog(
      'result',
      `Result submitted: ${label}`,
      `${result.finalScore.teamA}-${result.finalScore.teamB} winner=${result.winner} ★${result.leadingScorer} | ${matchPredictions.length} predictions scored`,
    );
  },

  // ---------- Lock -----------------------------------------------------------

  lockMatch(matchId) {
    const { tournament } = get();
    if (!tournament) return;

    const updatedMatches = tournament.matches.map((m: Match) =>
      m.id === matchId ? { ...m, locked: true } : m,
    );
    set({ tournament: { ...tournament, matches: updatedMatches } });
    const match = tournament.matches.find(m => m.id === matchId);
    pushDebugLog('lock', `Match locked: ${match?.teamA ?? '?'} vs ${match?.teamB ?? '?'}`);
  },

  // ---------- Tournament initialiser ----------------------------------------

  setTournament(tournament) {
    set({ tournament });
  },

  // ---------- Leaderboard (derived) -----------------------------------------

  getLeaderboard(): LeaderboardEntry[] {
    const { users, predictions, tournament } = get();
    if (!tournament) return [];

    const entries: LeaderboardEntry[] = users.map(user => {
      const userPredictions = predictions.filter(p => p.userId === user.id);

      // Count exact score hits
      let exactScoreHits = 0;
      let leadingScorerHits = 0;

      for (const pred of userPredictions) {
        const match = tournament.matches.find(m => m.id === pred.matchId);
        if (!match?.result) continue;

        const { breakdown } = calculatePoints(match.result, pred, tournament.scoringRules);

        for (const entry of breakdown) {
          if (entry.conditionMet) {
            if (entry.ruleKey === 'exact_score') exactScoreHits++;
            if (entry.ruleKey === 'leading_scorer') leadingScorerHits++;
          }
        }
      }

      // Earliest prediction timestamp for tiebreaking
      const timestamps = userPredictions.map(p => p.timestamp.getTime());
      const earliestPrediction =
        timestamps.length > 0 ? new Date(Math.min(...timestamps)) : null;

      return {
        userId: user.id,
        displayName: user.displayName,
        totalPoints: user.totalPoints,
        exactScoreHits,
        leadingScorerHits,
        earliestPrediction,
      };
    });

    // Sort: 1. totalPoints desc, 2. exactScoreHits desc,
    //       3. leadingScorerHits desc, 4. earliest prediction asc
    return entries.sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
      if (b.exactScoreHits !== a.exactScoreHits) return b.exactScoreHits - a.exactScoreHits;
      if (b.leadingScorerHits !== a.leadingScorerHits)
        return b.leadingScorerHits - a.leadingScorerHits;

      const tA = a.earliestPrediction?.getTime() ?? Infinity;
      const tB = b.earliestPrediction?.getTime() ?? Infinity;
      return tA - tB;
    });
  },

  // ---------- Admin mode (client-only MVP) -----------------------------------
  // Not a real security boundary — this is a single-page app with no backend.
  // The password simply prevents accidental result submissions.

  isAdmin: false,

  setAdminMode(password) {
    if (password === 'admin2026') {
      set({ isAdmin: true });
      return true;
    }
    return false;
  },

  exitAdminMode() {
    set({ isAdmin: false });
  },

  // ---------- Debug-only actions --------------------------------------------

  debugUnlockMatch(matchId) {
    const { tournament } = get();
    if (!tournament) return;
    const updatedMatches = tournament.matches.map((m: Match) =>
      m.id === matchId ? { ...m, locked: false } : m,
    );
    set({ tournament: { ...tournament, matches: updatedMatches } });
    const match = tournament.matches.find(m => m.id === matchId);
    pushDebugLog('info', `[DEBUG] Unlocked: ${match?.teamA ?? '?'} vs ${match?.teamB ?? '?'}`);
  },

  debugSwitchUser(userId) {
    const user = get().users.find(u => u.id === userId);
    if (!user) return;
    const prev = get().currentUser?.displayName ?? 'nobody';
    set({ currentUser: user });
    pushDebugLog('info', `[DEBUG] Impersonating "${user.displayName}" (was "${prev}")`);
  },

  debugLegacyPlanes: false,
  setDebugLegacyPlanes(v) { set({ debugLegacyPlanes: v }); },
}));
