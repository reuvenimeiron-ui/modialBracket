// ============================================================
// useAutoLock — automatically locks matches when their startTime passes
//
// Runs an interval every 30 seconds.
// For each unlocked match where Date.now() >= match.startTime,
// calls lockMatch(matchId).
//
// Usage: call once at the app root level (App.tsx).
// ============================================================

import { useEffect } from 'react';
import { useTournamentStore } from './tournamentStore';

const CHECK_INTERVAL_MS = 30_000; // 30 seconds

export function useAutoLock() {
  const tournament = useTournamentStore(s => s.tournament);
  const lockMatch = useTournamentStore(s => s.lockMatch);

  useEffect(() => {
    function checkAndLock() {
      if (!tournament) return;
      const now = Date.now();
      for (const match of tournament.matches) {
        if (!match.locked && now >= match.startTime.getTime()) {
          lockMatch(match.id);
        }
      }
    }

    // Run immediately on mount (catches already-passed start times)
    checkAndLock();

    const intervalId = setInterval(checkAndLock, CHECK_INTERVAL_MS);
    return () => clearInterval(intervalId);
    // Re-run if tournament reference changes (new matches loaded, etc.)
  }, [tournament, lockMatch]);
}
