// ============================================================
// Bracket — one card per knockout stage, in a symmetric tree.
// Left path (A): R32 → R16 → QF → SF  (tallest → shortest)
// Center: Final card (wide)
// Right path (B): SF → QF → R16 → R32  (shortest → tallest)
// Clicking a card reveals its matches in a panel below.
// ============================================================

import { useMemo, useRef, useEffect, useState } from 'react';
import { useTournamentStore } from '../State/tournamentStore';
import { MatchSlot } from './MatchCard';
import type { Match } from '../../types';
import './Bracket.css';

interface BracketProps {
  onOpenPrediction: (matchId: string) => void;
  onOpenResult:     (matchId: string) => void;
}

interface StageCol {
  key:     string;
  label:   string;
  matches: Match[];
  isFinal: boolean;
  height:  number; // card height in px — proportional to match count
}

const SCARD_COLOR: Record<string, string> = {
  'Round of 32':        'var(--accent)',
  'Round of 16':        'var(--accent-hover)',
  'Quarter-Finals':     'var(--amber)',
  'Semi-Finals':        'var(--purple)',
  'Final':              'var(--gold)',
  '3rd Place Play-off': 'var(--green)',
};

function getRoundLabel(roundNumber: number, totalRounds: number): string {
  const fromFinal = totalRounds - roundNumber;
  switch (fromFinal) {
    case 0: return 'Final';
    case 1: return 'Semi-Finals';
    case 2: return 'Quarter-Finals';
    case 3: return 'Round of 16';
    case 4: return 'Round of 32';
    default: return `Round ${roundNumber}`;
  }
}

export function Bracket({ onOpenPrediction, onOpenResult }: BracketProps) {
  const tournament = useTournamentStore(s => s.tournament);
  const wrapRef    = useRef<HTMLDivElement>(null);
  const fieldRef   = useRef<HTMLDivElement>(null);
  const [scaledH, setScaledH]     = useState<number | undefined>(undefined);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  // Auto-scale the bracket tree to fit the viewport width
  useEffect(() => {
    const update = () => {
      const wrap  = wrapRef.current;
      const field = fieldRef.current;
      if (!wrap || !field) return;
      field.style.transform = 'none';
      const s = Math.min(1, wrap.clientWidth / field.scrollWidth);
      field.style.transform       = `scale(${s})`;
      field.style.transformOrigin = 'top center';
      setScaledH(field.scrollHeight * s);
    };
    const raf = requestAnimationFrame(update);
    window.addEventListener('resize', update);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', update); };
  }, [tournament]);

  const { leftCols, centerCol, rightCols, thirdPlaceCol } = useMemo(() => {
    if (!tournament) return { leftCols: [], centerCol: null, rightCols: [], thirdPlaceCol: null };

    const mainMatches = tournament.matches.filter(m => !m.isThirdPlace);
    const thirdPlace  = tournament.matches.find(m => m.isThirdPlace) ?? null;

    const roundMap = new Map<number, Match[]>();
    for (const m of mainMatches) {
      if (!roundMap.has(m.round)) roundMap.set(m.round, []);
      roundMap.get(m.round)!.push(m);
    }

    const sorted      = Array.from(roundMap.keys()).sort((a, b) => a - b);
    const totalRounds = sorted.length;
    const allRounds   = sorted.map(rn => ({
      rn,
      label:   getRoundLabel(rn, totalRounds),
      matches: roundMap.get(rn)!,
    }));

    const prelim     = allRounds.slice(0, -1);
    const finalRound = allRounds[allRounds.length - 1];

    // Left: first half of each round (path A), outermost round first
    const leftCols: StageCol[] = prelim.map(r => {
      const matches = r.matches.slice(0, Math.ceil(r.matches.length / 2));
      return { key: `left-${r.rn}`, label: r.label, matches, isFinal: false, height: Math.max(80, matches.length * 36) };
    });

    // Right: second half reversed so SF is nearest center (path B)
    const rightCols: StageCol[] = prelim.map(r => {
      const matches = r.matches.slice(Math.ceil(r.matches.length / 2));
      return { key: `right-${r.rn}`, label: r.label, matches, isFinal: false, height: Math.max(80, matches.length * 36) };
    }).reverse();

    const centerCol: StageCol = {
      key:     'final',
      label:   'Final',
      matches: finalRound.matches,
      isFinal: true,
      height:  110,
    };

    const thirdPlaceCol: StageCol | null = thirdPlace
      ? { key: '3rd', label: '3rd Place Play-off', matches: [thirdPlace], isFinal: false, height: 80 }
      : null;

    return { leftCols, centerCol, rightCols, thirdPlaceCol };
  }, [tournament]);

  if (!tournament) {
    return <div className="bracket bracket--empty"><p>No tournament loaded.</p></div>;
  }

  const allCols   = [...leftCols, ...(centerCol ? [centerCol] : []), ...rightCols, ...(thirdPlaceCol ? [thirdPlaceCol] : [])];
  const activeCol = allCols.find(c => c.key === activeKey) ?? null;
  const champion  = centerCol?.matches[0]?.result?.winner ?? null;
  const toggle    = (key: string) => setActiveKey(prev => prev === key ? null : key);

  return (
    <div className="bracket">
      {/* Video background — sits behind crowd silhouette */}
      <video
        className="bracket__bg-video"
        src="https://radcom.com/wp-content/uploads/2025/02/shutterstock_1102408479_1.mp4"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />

      <div className="bracket__header">
        <img src="/new%20symbols/World-Cup-2026-Logo-V3.png" alt="FIFA World Cup 2026" className="bracket__header-logo" />
        <span className="bracket__header-title">WORLD CUP 2026</span>
      </div>

      {/* Bracket tree — one card per stage */}
      <div
        className="bracket__scale-wrap"
        ref={wrapRef}
        style={scaledH !== undefined ? { height: scaledH + 24 } : undefined}
      >
        <div className="bracket__field" ref={fieldRef}>
          {/* Path A */}
          <div className="bracket__half">
            {leftCols.map(col => (
              <StageCard key={col.key} col={col}
                isActive={activeKey === col.key}
                onClick={() => toggle(col.key)}
              />
            ))}
          </div>

          {/* Final */}
          {centerCol && (
            <StageCard col={centerCol}
              isActive={activeKey === centerCol.key}
              onClick={() => toggle(centerCol.key)}
              champion={champion}
            />
          )}

          {/* Path B */}
          <div className="bracket__half">
            {rightCols.map(col => (
              <StageCard key={col.key} col={col}
                isActive={activeKey === col.key}
                onClick={() => toggle(col.key)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 3rd Place play-off card — sits below the tree, centred */}
      {thirdPlaceCol && (
        <div className="bracket__third-row">
          <StageCard
            col={thirdPlaceCol}
            isActive={activeKey === thirdPlaceCol.key}
            onClick={() => toggle(thirdPlaceCol.key)}
          />
        </div>
      )}

      {/* Matches panel — slides in below when a card is clicked */}
      {activeCol && (
        <div className="bmatches">
          <div className="bmatches__header">
            <span className="bmatches__title">{activeCol.label}</span>
            <span className="bmatches__count">{activeCol.matches.length} matches</span>
          </div>
          <div className="bmatches__grid">
            {activeCol.matches.map(m => (
              <MatchSlot key={m.id} match={m}
                isFinal={activeCol.isFinal}
                onOpenPrediction={onOpenPrediction}
                onOpenResult={onOpenResult}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Stage card ────────────────────────────────────────────────

interface StageCardProps {
  col:       StageCol;
  isActive:  boolean;
  onClick:   () => void;
  champion?: string | null;
}

function StageCard({ col, isActive, onClick, champion }: StageCardProps) {
  const done  = col.matches.filter(m => m.result).length;
  const total = col.matches.length;
  const pct   = total ? Math.round((done / total) * 100) : 0;
  const color = SCARD_COLOR[col.label] ?? 'var(--accent)';

  return (
    <button
      className={`scard ${isActive ? 'scard--active' : ''} ${col.isFinal ? 'scard--final' : ''}`}
      style={{ height: col.height, '--scard-color': color } as React.CSSProperties}
      onClick={onClick}
      aria-expanded={isActive}
    >
      <span className="scard__label">{col.label}</span>
      {col.isFinal && champion && (
        <span className="scard__champion">🏆 {champion}</span>
      )}
      <span className="scard__progress-text">{done}/{total}</span>
      <span className="scard__bar">
        <span className="scard__bar-fill" style={{ height: `${pct}%` }} />
      </span>
    </button>
  );
}




