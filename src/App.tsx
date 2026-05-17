// ============================================================
// App — root component
//
// Responsibilities:
//   - Load seed data on first mount
//   - Run auto-lock hook
//   - Manage active view (home | bracket)
//   - Render persistent header + current view
//   - Manage which modal is open (one at a time)
// ============================================================

import { useEffect, useState } from 'react';
import { Bracket } from './components/Bracket/Bracket';
import { Home } from './components/Home/Home';
import { CountriesPage } from './components/Home/CountriesPage';
import { LeaderboardPage } from './components/Leaderboard/LeaderboardPage';
import { AdminLeaderboardPage } from './components/Leaderboard/AdminLeaderboardPage';
import { MatchPredictionModal } from './components/Modals/MatchPredictionModal';
import { MatchResultModal } from './components/Modals/MatchResultModal';
import { ScoringRulesModal } from './components/Modals/ScoringRulesModal';
import { LoginModal } from './components/Users/LoginModal';
import { RegisterModal } from './components/Users/RegisterModal';
import { AdminModal } from './components/Users/AdminModal';
import { DebugPanel } from './components/Users/DebugPanel';
import { useTournamentStore } from './components/State/tournamentStore';
import { useAutoLock } from './components/State/useAutoLock';
import { initSeedData } from './seedData';
import './App.css';

type View = 'home' | 'bracket' | 'leaderboard' | 'countries' | 'admin-leaderboard';

type ModalState =
  | { type: 'none' }
  | { type: 'login' }
  | { type: 'register' }
  | { type: 'admin' }
  | { type: 'scoringRules' }
  | { type: 'prediction'; matchId: string }
  | { type: 'result'; matchId: string };

function App() {
  const currentUser = useTournamentStore(s => s.currentUser);
  const logoutUser = useTournamentStore(s => s.logoutUser);
  const isAdmin = useTournamentStore(s => s.isAdmin);
  const exitAdminMode = useTournamentStore(s => s.exitAdminMode);

  const [view, setView] = useState<View>('home');
  const [modal, setModal] = useState<ModalState>({ type: 'none' });

  // Load seed data once on mount
  useEffect(() => { initSeedData(); }, []);

  // Auto-lock matches whose startTime has passed
  useAutoLock();

  function closeModal() { setModal({ type: 'none' }); }

  return (
    <div className="app">
      {/* ── Persistent Header ─────────────────────────────────── */}
      <header className="app-header">
        <button className="app-header__brand" onClick={() => setView('home')}>
          <img src="/new%20symbols/World-Cup-2026-Logo-V3.png" alt="" className="app-header__brand-logo" />
          <span className="app-header__radcom-logo-wrap" role="img" aria-label="RADCOM's" />
          World Cup Challenge
        </button>

        <nav className="app-header__nav">
          <button
            className={`app-header__btn ${view === 'bracket' ? 'app-header__btn--active' : ''}`}
            onClick={() => setView('bracket')}
          >
            My Bracket
          </button>
          <button
            className={`app-header__btn ${view === 'leaderboard' ? 'app-header__btn--active' : ''}`}
            onClick={() => setView('leaderboard')}
          >
            Leaderboard
          </button>
          <button className="app-header__btn" onClick={() => setModal({ type: 'scoringRules' })}>
            Scoring Rules
          </button>
          {/* Hidden admin-only leaderboard shortcut */}
          {isAdmin && (
            <button
              className={`app-header__btn ${view === 'admin-leaderboard' ? 'app-header__btn--active' : ''}`}
              onClick={() => setView('admin-leaderboard')}
              title="Admin leaderboard view"
            >
              📊 Live Board
            </button>
          )}
        </nav>

        <div className="app-header__auth">
          {/* Admin mode badge / toggle */}
          {isAdmin ? (
            <div className="app-header__admin-badge">
              <span>🔑 Admin</span>
              <button
                className="app-header__admin-exit"
                onClick={exitAdminMode}
                title="Exit admin mode"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              className="app-header__btn app-header__btn--admin"
              onClick={() => setModal({ type: 'admin' })}
              title="Admin access"
            >
              🔐
            </button>
          )}

          {currentUser ? (
            <>
              <span className="app-header__user">👤 {currentUser.displayName}</span>
              <button className="app-header__btn app-header__btn--secondary" onClick={logoutUser}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="app-header__btn" onClick={() => setModal({ type: 'login' })}>
                Sign In
              </button>
              <button className="app-header__btn app-header__btn--primary" onClick={() => setModal({ type: 'register' })}>
                Register
              </button>
            </>
          )}
        </div>
      </header>

      {/* ── Active view ───────────────────────────────────────── */}
      <main className="app-main">
        {view === 'home' && (
          <Home
            onGoToBracket={() => setView('bracket')}
            onGoToLeaderboard={() => setView('leaderboard')}
            onOpenScoringRules={() => setModal({ type: 'scoringRules' })}
            onOpenLogin={() => setModal({ type: 'login' })}
            onOpenRegister={() => setModal({ type: 'register' })}
            onGoToCountries={() => setView('countries')}
            currentUserName={currentUser?.displayName ?? null}
          />
        )}
        {view === 'bracket' && (
          <Bracket
            onOpenPrediction={matchId => setModal({ type: 'prediction', matchId })}
            onOpenResult={matchId => {
              if (isAdmin) setModal({ type: 'result', matchId });
            }}
          />
        )}
        {view === 'leaderboard' && (
          <LeaderboardPage onBack={() => setView('home')} />
        )}
        {view === 'countries' && (
          <CountriesPage onBack={() => setView('home')} />
        )}
        {view === 'admin-leaderboard' && isAdmin && (
          <AdminLeaderboardPage />
        )}
      </main>

      {/* ── Modals (one at a time) ────────────────────────────── */}
      {modal.type === 'admin' && (
        <AdminModal onClose={closeModal} />
      )}

      {/* Debug panel — only mounted in admin mode */}
      {isAdmin && <DebugPanel />}
      {modal.type === 'login' && (
        <LoginModal onClose={closeModal} />
      )}
      {modal.type === 'register' && (
        <RegisterModal onClose={closeModal} />
      )}
      {modal.type === 'scoringRules' && (
        <ScoringRulesModal onClose={closeModal} />
      )}
      {modal.type === 'prediction' && (
        <MatchPredictionModal matchId={modal.matchId} onClose={closeModal} />
      )}
      {modal.type === 'result' && (
        <MatchResultModal matchId={modal.matchId} onClose={closeModal} />
      )}
    </div>
  );
}

export default App
