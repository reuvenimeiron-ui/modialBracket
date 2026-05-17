// ============================================================
// DebugPanel — admin-only floating panel (7 tabs)
//
//  🗄  State      — live store snapshot
//  🧪  Score Test — manually fire the scoring engine
//  📋  Match Log  — completed matches + per-user breakdowns
//  🔒  Locks      — force-lock / unlock any match
//  👤  Impersonate— switch currentUser instantly
//  ⚡  Events     — real-time log of all store mutations
//  📊  Analytics  — prediction coverage, accuracy rates, pts dist.
// ============================================================

import { useState } from 'react';
import { useTournamentStore } from '../State/tournamentStore';
import { calculatePoints } from '../Scoring/scoringEngine';
import { useDebugEvents, clearDebugLog } from './debugLog';
import type { MatchResult, Prediction } from '../../types';
import './DebugPanel.css';

type Tab = 'state' | 'tester' | 'log' | 'locks' | 'impersonate' | 'events' | 'analytics';

const TAB_LABELS: Record<Tab, string> = {
  state:       '🗄 State',
  tester:      '🧪 Score Test',
  log:         '📋 Match Log',
  locks:       '🔒 Locks',
  impersonate: '👤 Impersonate',
  events:      '⚡ Events',
  analytics:   '📊 Analytics',
};

const EVENT_COLORS: Record<string, string> = {
  prediction: '#7dd3fc',
  result:     '#ffd600',
  login:      '#4ade80',
  logout:     '#94a3b8',
  register:   '#a78bfa',
  lock:       '#fb923c',
  info:       '#cbd5e1',
  error:      '#f87171',
};

export function DebugPanel() {
  const [open, setOpen] = useState(false);
  const [tab,  setTab]  = useState<Tab>('state');

  // Store slices
  const users            = useTournamentStore(s => s.users);
  const currentUser      = useTournamentStore(s => s.currentUser);
  const tournament       = useTournamentStore(s => s.tournament);
  const predictions      = useTournamentStore(s => s.predictions);
  const debugUnlockMatch = useTournamentStore(s => s.debugUnlockMatch);
  const debugSwitchUser  = useTournamentStore(s => s.debugSwitchUser);
  const lockMatch        = useTournamentStore(s => s.lockMatch);
  const debugLegacyPlanes    = useTournamentStore(s => s.debugLegacyPlanes);
  const setDebugLegacyPlanes = useTournamentStore(s => s.setDebugLegacyPlanes);

  // Event log
  const events = useDebugEvents();

  // ── Score Tester local state ──────────────────────────────
  const [teWinner,  setTeWinner]  = useState('TeamA');
  const [teScoreA,  setTeScoreA]  = useState(2);
  const [teScoreB,  setTeScoreB]  = useState(1);
  const [teScorer,  setTeScorer]  = useState('Player X');
  const [tePWinner, setTePWinner] = useState('TeamA');
  const [tePScoreA, setTePScoreA] = useState(2);
  const [tePScoreB, setTePScoreB] = useState(1);
  const [tePScorer, setTePScorer] = useState('Player X');
  const [testResult, setTestResult] = useState<ReturnType<typeof calculatePoints> | null>(null);

  function runTest() {
    if (!tournament) return;
    const result: MatchResult = {
      winner: teWinner,
      finalScore: { teamA: teScoreA, teamB: teScoreB },
      leadingScorer: teScorer,
    };
    const prediction: Prediction = {
      userId: 'debug',
      matchId: 'debug',
      predictedWinner: tePWinner,
      predictedScore: { teamA: tePScoreA, teamB: tePScoreB },
      predictedLeadingScorer: tePScorer,
      timestamp: new Date(),
    };
    setTestResult(calculatePoints(result, prediction, tournament.scoringRules));
  }

  // Derived helpers
  const completedMatches = tournament?.matches.filter(m => !!m.result) ?? [];
  const allMatches       = tournament?.matches ?? [];
  const now              = new Date();

  // ── Analytics helpers ─────────────────────────────────────
  function analyticsData() {
    if (!tournament) return null;
    const matchesWithPreds = new Set(predictions.map(p => p.matchId)).size;
    const coverage = allMatches.length > 0
      ? Math.round((matchesWithPreds / allMatches.length) * 100) : 0;
    const ruleHits: Record<string, number>   = {};
    const ruleTotals: Record<string, number> = {};
    for (const rule of tournament.scoringRules) {
      ruleHits[rule.ruleKey] = 0; ruleTotals[rule.ruleKey] = 0;
    }
    for (const pred of predictions) {
      const match = tournament.matches.find(m => m.id === pred.matchId);
      if (!match?.result) continue;
      const { breakdown } = calculatePoints(match.result, pred, tournament.scoringRules);
      for (const b of breakdown) {
        ruleTotals[b.ruleKey]++;
        if (b.conditionMet) ruleHits[b.ruleKey]++;
      }
    }
    const pts = users.map(u => u.totalPoints).filter(p => p > 0);
    return {
      matchesWithPreds, coverage, ruleHits, ruleTotals,
      minPts: pts.length ? Math.min(...pts) : 0,
      maxPts: pts.length ? Math.max(...pts) : 0,
      avgPts: pts.length ? Math.round(pts.reduce((a, b) => a + b, 0) / pts.length) : 0,
    };
  }
  const analytics = analyticsData();

  return (
    <>
      {/* Floating toggle */}
      <button className="dbg-toggle" onClick={() => setOpen(o => !o)} title="Debug panel">🐛</button>

      {open && (
        <div className="dbg-panel">
          {/* ── Header ──────────────────────────────────── */}
          <div className="dbg-header">
            <span className="dbg-title">⚙️ Debug Panel</span>
            <div className="dbg-tabs">
              {(Object.keys(TAB_LABELS) as Tab[]).map(t => (
                <button key={t} className={`dbg-tab ${tab === t ? 'dbg-tab--active' : ''}`} onClick={() => setTab(t)}>
                  {TAB_LABELS[t]}
                </button>
              ))}
            </div>
            <button className="dbg-close" onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="dbg-body">

            {/* ══ TAB: STATE ══════════════════════════════ */}
            {tab === 'state' && (
              <div className="dbg-section">
                <h3 className="dbg-section-title">UI Flags</h3>
                <div className="dbg-flag-row">
                  <span className="dbg-flag-label">✈️ Legacy plane sprites (old SVGs)</span>
                  <button
                    className={`dbg-flag-toggle ${debugLegacyPlanes ? 'dbg-flag-toggle--on' : ''}`}
                    onClick={() => setDebugLegacyPlanes(!debugLegacyPlanes)}
                    title="Toggle between new PNGs and old SVG planes"
                  >
                    {debugLegacyPlanes ? 'ON' : 'OFF'}
                  </button>
                </div>
                <h3 className="dbg-section-title">Session</h3>
                <Kv label="Current User"      val={currentUser ? `${currentUser.displayName} (${currentUser.email})` : '— not logged in —'} />
                <Kv label="Tournament"        val={tournament ? `${tournament.name} [${tournament.status}]` : '— none —'} />
                <Kv label="Total Predictions" val={String(predictions.length)} />
                <Kv label="Matches"           val={`${allMatches.length} total | ${completedMatches.length} with results | ${allMatches.filter(m => m.locked).length} locked`} />
                <h3 className="dbg-section-title" style={{ marginTop: 14 }}>Users & Points</h3>
                {users.length === 0 ? <p className="dbg-empty">No registered users yet.</p>
                  : users.map(u => (
                    <div key={u.id} className="dbg-user-row">
                      <span className="dbg-user-name">{u.displayName}</span>
                      <span className="dbg-user-email">{u.email}</span>
                      <span className="dbg-user-pts">{u.totalPoints} pts</span>
                    </div>
                  ))
                }
                <h3 className="dbg-section-title" style={{ marginTop: 14 }}>Scoring Rules</h3>
                {tournament?.scoringRules.map(r => (
                  <div key={r.ruleKey} className="dbg-kv">
                    <span className="dbg-key dbg-key--mono">{r.ruleKey}</span>
                    <span className="dbg-val">
                      {r.points} pts &nbsp;
                      <span className={r.enabled ? 'dbg-badge--on' : 'dbg-badge--off'}>{r.enabled ? 'ENABLED' : 'DISABLED'}</span>
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* ══ TAB: SCORE TESTER ═══════════════════════ */}
            {tab === 'tester' && (
              <div className="dbg-section">
                {!tournament && <p className="dbg-empty">No tournament loaded.</p>}
                {tournament && (<>
                  <div className="dbg-tester-grid">
                    <div className="dbg-tester-col">
                      <h4 className="dbg-col-title">🏆 Actual Result</h4>
                      <Field label="Winner"         val={teWinner}  setVal={setTeWinner} />
                      <Field label="Score A"        val={teScoreA}  setVal={setTeScoreA} num />
                      <Field label="Score B"        val={teScoreB}  setVal={setTeScoreB} num />
                      <Field label="Leading Scorer" val={teScorer}  setVal={setTeScorer} />
                    </div>
                    <div className="dbg-tester-col">
                      <h4 className="dbg-col-title">🔮 Prediction</h4>
                      <Field label="Pred. Winner"   val={tePWinner} setVal={setTePWinner} />
                      <Field label="Score A"        val={tePScoreA} setVal={setTePScoreA} num />
                      <Field label="Score B"        val={tePScoreB} setVal={setTePScoreB} num />
                      <Field label="Leading Scorer" val={tePScorer} setVal={setTePScorer} />
                    </div>
                  </div>
                  <button className="dbg-run-btn" onClick={runTest}>▶ Run Scoring Engine</button>
                  {testResult && (
                    <div className="dbg-result">
                      <div className="dbg-result-total">Total Points: <strong>{testResult.totalPoints}</strong></div>
                      <table className="dbg-table">
                        <thead><tr><th>Rule</th><th>Met</th><th>Pts</th></tr></thead>
                        <tbody>
                          {testResult.breakdown.map(row => (
                            <tr key={row.ruleKey} className={row.conditionMet ? 'dbg-row--hit' : ''}>
                              <td className="dbg-mono">{row.ruleKey}</td>
                              <td>{row.conditionMet ? '✅' : '❌'}</td>
                              <td>{row.pointsAwarded}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>)}
              </div>
            )}

            {/* ══ TAB: MATCH LOG ══════════════════════════ */}
            {tab === 'log' && (
              <div className="dbg-section">
                {completedMatches.length === 0 ? <p className="dbg-empty">No results submitted yet.</p>
                  : completedMatches.map(match => {
                    const matchPreds = predictions.filter(p => p.matchId === match.id);
                    return (
                      <div key={match.id} className="dbg-match-block">
                        <div className="dbg-match-header">
                          <span className="dbg-match-name">{match.teamA} vs {match.teamB}</span>
                          <span className="dbg-match-result">
                            {match.result!.finalScore.teamA}–{match.result!.finalScore.teamB}
                            &nbsp;· <strong>{match.result!.winner}</strong>
                            {match.result!.leadingScorer && ` · ⭐ ${match.result!.leadingScorer}`}
                          </span>
                        </div>
                        {matchPreds.length === 0 ? <p className="dbg-empty">No predictions for this match.</p>
                          : matchPreds.map(pred => {
                            const scoring = tournament ? calculatePoints(match.result!, pred, tournament.scoringRules) : null;
                            const user = users.find(u => u.id === pred.userId);
                            return (
                              <div key={pred.userId} className="dbg-pred-row">
                                <span className="dbg-pred-user">{user?.displayName ?? pred.userId}</span>
                                <span className="dbg-pred-detail">
                                  {pred.predictedWinner} &nbsp;{pred.predictedScore.teamA}–{pred.predictedScore.teamB}
                                  {pred.predictedLeadingScorer && ` · ${pred.predictedLeadingScorer}`}
                                </span>
                                {scoring && (
                                  <span className="dbg-pred-pts">
                                    {scoring.breakdown.map(b => (
                                      <span key={b.ruleKey} className={b.conditionMet ? 'dbg-chip--hit' : 'dbg-chip--miss'} title={b.ruleKey}>
                                        {b.conditionMet ? `+${b.pointsAwarded}` : '0'}
                                      </span>
                                    ))}
                                    &nbsp;= <strong>{scoring.totalPoints} pts</strong>
                                  </span>
                                )}
                              </div>
                            );
                          })
                        }
                      </div>
                    );
                  })
                }
              </div>
            )}

            {/* ══ TAB: LOCKS ══════════════════════════════ */}
            {tab === 'locks' && (
              <div className="dbg-section">
                {allMatches.length === 0 && <p className="dbg-empty">No matches loaded.</p>}
                <table className="dbg-table dbg-table--locks">
                  <thead><tr><th>Match</th><th>Rd</th><th>Start</th><th>Status</th><th>Action</th></tr></thead>
                  <tbody>
                    {allMatches.map(m => {
                      const started  = m.startTime <= now;
                      const minsLeft = Math.round((m.startTime.getTime() - now.getTime()) / 60000);
                      return (
                        <tr key={m.id}>
                          <td className="dbg-truncate">{m.teamA} vs {m.teamB}</td>
                          <td style={{ textAlign: 'center' }}>{m.round}</td>
                          <td style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            {started ? <span style={{ color: '#f87171' }}>Started</span> : `in ${minsLeft}m`}
                          </td>
                          <td>
                            {m.result ? <span className="dbg-badge--result">✓ Done</span>
                              : m.locked ? <span className="dbg-badge--locked">🔒 Locked</span>
                              : <span className="dbg-badge--open">🟢 Open</span>}
                          </td>
                          <td>
                            {!m.locked && (
                              <button className="dbg-action-btn dbg-action-btn--lock" onClick={() => lockMatch(m.id)}>Lock</button>
                            )}
                            {m.locked && !m.result && (
                              <button className="dbg-action-btn dbg-action-btn--unlock" onClick={() => debugUnlockMatch(m.id)}>Unlock</button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* ══ TAB: IMPERSONATE ════════════════════════ */}
            {tab === 'impersonate' && (
              <div className="dbg-section">
                <p className="dbg-impersonate-note">
                  Switch the active session to any user instantly — verify predictions and points from their perspective.
                </p>
                {users.length === 0 ? <p className="dbg-empty">No registered users yet.</p>
                  : users.map(u => {
                    const isActive = currentUser?.id === u.id;
                    return (
                      <div key={u.id} className={`dbg-impersonate-row ${isActive ? 'dbg-impersonate-row--active' : ''}`}>
                        <div className="dbg-impersonate-info">
                          <span className="dbg-user-name">{u.displayName}</span>
                          <span className="dbg-user-email">{u.email}</span>
                          <span className="dbg-user-pts">{u.totalPoints} pts</span>
                          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            {predictions.filter(p => p.userId === u.id).length} predictions
                          </span>
                        </div>
                        {isActive
                          ? <span className="dbg-badge--active">▶ ACTIVE</span>
                          : <button className="dbg-action-btn dbg-action-btn--impersonate" onClick={() => debugSwitchUser(u.id)}>Switch →</button>
                        }
                      </div>
                    );
                  })
                }
              </div>
            )}

            {/* ══ TAB: EVENTS ═════════════════════════════ */}
            {tab === 'events' && (
              <div className="dbg-section">
                <div className="dbg-events-toolbar">
                  <span style={{ color: '#64748b', fontSize: '0.75rem' }}>{events.length} event{events.length !== 1 ? 's' : ''}</span>
                  <button className="dbg-action-btn" onClick={clearDebugLog}>Clear</button>
                </div>
                {events.length === 0
                  ? <p className="dbg-empty">No events yet — log in, make predictions, or submit a result.</p>
                  : events.map(e => (
                    <div key={e.id} className="dbg-event-row">
                      <span className="dbg-event-time">{e.ts.toTimeString().slice(0, 8)}</span>
                      <span className="dbg-event-type" style={{ color: EVENT_COLORS[e.type] ?? '#cbd5e1' }}>
                        {e.type.toUpperCase()}
                      </span>
                      <span className="dbg-event-msg">{e.message}</span>
                      {e.detail && <span className="dbg-event-detail">{e.detail}</span>}
                    </div>
                  ))
                }
              </div>
            )}

            {/* ══ TAB: ANALYTICS ══════════════════════════ */}
            {tab === 'analytics' && (
              <div className="dbg-section">
                {!analytics ? <p className="dbg-empty">No tournament loaded.</p> : (<>
                  <h3 className="dbg-section-title">Prediction Coverage</h3>
                  <Kv label="Matches with ≥1 prediction" val={`${analytics.matchesWithPreds} / ${allMatches.length}`} />
                  <div className="dbg-progress-row">
                    <span className="dbg-key">Coverage</span>
                    <div className="dbg-progress-bar"><div className="dbg-progress-fill" style={{ width: `${analytics.coverage}%` }} /></div>
                    <span className="dbg-progress-label">{analytics.coverage}%</span>
                  </div>

                  <h3 className="dbg-section-title" style={{ marginTop: 14 }}>Rule Accuracy (scored predictions)</h3>
                  {Object.entries(analytics.ruleHits).map(([key, hits]) => {
                    const total = analytics.ruleTotals[key] ?? 0;
                    const pct   = total > 0 ? Math.round((hits / total) * 100) : 0;
                    return (
                      <div key={key} className="dbg-progress-row">
                        <span className="dbg-key dbg-key--mono" style={{ minWidth: 160 }}>{key}</span>
                        <div className="dbg-progress-bar"><div className="dbg-progress-fill dbg-progress-fill--green" style={{ width: `${pct}%` }} /></div>
                        <span className="dbg-progress-label">{hits}/{total} ({pct}%)</span>
                      </div>
                    );
                  })}

                  <h3 className="dbg-section-title" style={{ marginTop: 14 }}>Points Distribution</h3>
                  {users.filter(u => u.totalPoints > 0).length === 0
                    ? <p className="dbg-empty">No points awarded yet.</p>
                    : <>
                      <Kv label="Min" val={String(analytics.minPts)} />
                      <Kv label="Avg" val={String(analytics.avgPts)} />
                      <Kv label="Max" val={String(analytics.maxPts)} />
                      <div className="dbg-pts-bars">
                        {[...users].sort((a, b) => b.totalPoints - a.totalPoints).map(u => {
                          const pct   = analytics.maxPts > 0 ? Math.round((u.totalPoints / analytics.maxPts) * 100) : 0;
                          const isYou = u.id === currentUser?.id;
                          return (
                            <div key={u.id} className="dbg-pts-row">
                              <span className="dbg-pts-name" style={isYou ? { color: '#ffd600' } : {}}>{u.displayName}</span>
                              <div className="dbg-progress-bar">
                                <div className={`dbg-progress-fill ${isYou ? 'dbg-progress-fill--gold' : ''}`} style={{ width: `${pct}%` }} />
                              </div>
                              <span className="dbg-progress-label">{u.totalPoints}</span>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  }
                </>)}
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}

// ── Small helper sub-components (local to this file) ─────────

function Kv({ label, val }: { label: string; val: string }) {
  return (
    <div className="dbg-kv">
      <span className="dbg-key">{label}</span>
      <span className="dbg-val">{val}</span>
    </div>
  );
}

function Field({
  label, val, setVal, num,
}: {
  label: string;
  val: string | number;
  setVal: (v: any) => void;
  num?: boolean;
}) {
  return (
    <label className="dbg-label">
      {label}
      <input
        className={`dbg-input${num ? ' dbg-input--num' : ''}`}
        type={num ? 'number' : 'text'}
        min={num ? 0 : undefined}
        value={val}
        onChange={e => setVal(num ? +e.target.value : e.target.value)}
      />
    </label>
  );
}
