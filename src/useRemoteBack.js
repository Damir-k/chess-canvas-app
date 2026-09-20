import { useEffect, useRef } from 'react';

// A temporary entry for local interactions; root Back remains system navigation.
const scopes = new Map();
let entry = false;
let returning = false;
function syncHistory() {
  if (returning) return;
  if (scopes.size && !entry) {
    window.history.pushState({ ...window.history.state, chessRemote: true }, '');
    entry = true;
  } else if (!scopes.size && entry) {
    returning = true;
    window.history.back();
  }
}
if (typeof window !== 'undefined') window.addEventListener('popstate', () => {
  const wasReturning = returning;
  const hadEntry = entry;
  returning = false;
  entry = false;
  if (!wasReturning && hadEntry) {
    const callbacks = [...scopes.values()];
    scopes.clear();
    callbacks.at(-1)?.();
  }
  syncHistory();
});

export function useRemoteBack(active, onBack) {
  const callback = useRef(onBack);
  callback.current = onBack;
  const id = useRef(Symbol());
  useEffect(() => {
    if (!active) return;
    const token = id.current;
    scopes.set(token, () => callback.current());
    syncHistory();
    return () => { scopes.delete(token); syncHistory(); };
  }, [active]);
}
