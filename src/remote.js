// DOM keyboard values for Canvas App, not Android KeyEvent codes.
export function remoteKey(event) {
  if (event.altKey || event.ctrlKey || event.metaKey) return '';
  return event.key && event.key !== 'Unidentified' ? event.key : event.code && event.code !== 'Unidentified' ? event.code :
    ({ 13: 'Enter', 27: 'Escape', 8: 'Backspace', 37: 'ArrowLeft',
      38: 'ArrowUp', 39: 'ArrowRight', 40: 'ArrowDown' }[event.keyCode] || '');
}

export const isBack = key => ['Escape', 'Backspace', 'BrowserBack', 'GoBack'].includes(key);
export function consume(event) {
  event.preventDefault();
  event.stopPropagation();
}

// Spatial navigation within a single focus scope. Layout may be a row or column.
export function navigateControls(event) {
  if (event.defaultPrevented) return;
  const key = remoteKey(event);
  const controls = [...event.currentTarget.querySelectorAll('button:not(:disabled), input[type="button"]:not(:disabled)')];
  const active = document.activeElement;
  if (!controls.includes(active)) return;
  if (key === 'Enter') {
    consume(event);
    if (!event.repeat) active.click();
    return;
  }
  if (!key.startsWith('Arrow')) return;
  consume(event);
  const rect = active.getBoundingClientRect();
  const horizontal = key === 'ArrowLeft' || key === 'ArrowRight';
  const sign = key === 'ArrowLeft' || key === 'ArrowUp' ? -1 : 1;
  const candidates = controls.filter(el => el !== active).map(el => {
    const r = el.getBoundingClientRect();
    const dx = (r.left + r.right - rect.left - rect.right) / 2;
    const dy = (r.top + r.bottom - rect.top - rect.bottom) / 2;
    return { el, forward: sign * (horizontal ? dx : dy), cross: Math.abs(horizontal ? dy : dx) };
  }).filter(item => item.forward > 1).sort((a, b) => (a.forward + a.cross * 2) - (b.forward + b.cross * 2));
  candidates[0]?.el.focus();
}
