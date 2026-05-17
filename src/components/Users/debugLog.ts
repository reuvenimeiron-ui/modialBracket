// ============================================================
// debugLog — module-level event bus for the debug panel.
//
// Any module can call pushDebugLog() to record an event.
// The useDebugEvents() hook re-renders its consumer whenever
// a new event is pushed (no polling needed).
// ============================================================

import { useState, useEffect } from 'react';

export type DebugEventType =
  | 'prediction'
  | 'result'
  | 'login'
  | 'logout'
  | 'register'
  | 'lock'
  | 'info'
  | 'error';

export interface DebugEvent {
  id: number;
  ts: Date;
  type: DebugEventType;
  message: string;
  detail?: string;
}

const MAX_EVENTS = 150;
let _counter   = 0;
const _log: DebugEvent[]      = [];
const _listeners = new Set<() => void>();

/** Append an event. Called from the store or anywhere in the app. */
export function pushDebugLog(
  type: DebugEventType,
  message: string,
  detail?: string,
): void {
  _log.push({ id: _counter++, ts: new Date(), type, message, detail });
  if (_log.length > MAX_EVENTS) _log.shift();
  _listeners.forEach(fn => fn());
}

/** React hook — returns all events (newest first) and re-renders on push. */
export function useDebugEvents(): DebugEvent[] {
  const [, rerender] = useState(0);

  useEffect(() => {
    const notify = () => rerender(n => n + 1);
    _listeners.add(notify);
    return () => { _listeners.delete(notify); };
  }, []);

  return [..._log].reverse();
}

/** Clear the in-memory log. */
export function clearDebugLog(): void {
  _log.length = 0;
  _listeners.forEach(fn => fn());
}
