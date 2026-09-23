const TV_SURFACES = new Set(['SBERBOX', 'TV', 'TV_HUAWEI', 'TIME', 'SATELLITE']);
const MOBILE_SURFACES = new Set(['SBOL', 'COMPANION']);

export function normalizeSurface(value) {
  return typeof value === 'string' ? value.trim().toUpperCase() : '';
}

// RUN_APP belongs to the backend protocol. It is only available here if the
// scenario forwards device in smart_app_data; SDK data events may unwrap it.
export function surfaceFromMessage(message) {
  for (const value of [message?.payload?.device?.surface, message?.device?.surface,
    message?.smart_app_data?.device?.surface, message?.smart_app_data?.payload?.device?.surface]) {
    const surface = normalizeSurface(value);
    if (surface) return surface;
  }
  return '';
}

export function detectControlMode(surface, browser = globalThis) {
  const knownSurface = normalizeSurface(surface);
  if (TV_SURFACES.has(knownSurface)) return 'tv';
  if (MOBILE_SURFACES.has(knownSurface)) return 'mobile';
  // SberPortal is a touch screen, not a phone. The text describes touch input only.
  if (knownSurface === 'STARGATE') return 'mobile';
  if (knownSurface) return 'unknown';

  const nav = browser.navigator || {};
  const ua = nav.userAgent || '';
  if (/SberBox|SmartTV|Smart-TV|Android TV|GoogleTV|HbbTV|Tizen|Web0S|WebOS|HuaweiVision/i.test(ua)) return 'tv';
  const matches = query => typeof browser.matchMedia === 'function' && browser.matchMedia(query).matches;
  const coarse = matches('(pointer: coarse)');
  const mobile = /iPhone|iPad|iPod|Android.*Mobile/i.test(ua) || nav.userAgentData?.mobile === true;
  const tablet = coarse && (/Android/i.test(ua) || (/Macintosh/i.test(ua) && nav.maxTouchPoints > 1));
  if (mobile || tablet) return 'mobile';
  if (/Windows NT|Macintosh|X11|CrOS/i.test(ua) && matches('(pointer: fine)') && matches('(hover: hover)')) return 'desktop';
  return 'unknown';
}

export const CONTROL_INSTRUCTIONS = {
  tv: 'Пульт: стрелками выберите клетку с белой фигурой и нажмите OK. Затем стрелками выберите подсвеченную клетку назначения и нажмите OK для хода. Назад — отменить выбор. Вниз с нижнего края доски — кнопки игры, вверх — обратно к доске.',
  mobile: 'Коснитесь белой фигуры, затем подсвеченной клетки назначения. Можно также перетащить фигуру на нужную клетку. Повторное касание выбранной фигуры отменяет выбор.',
  desktop: 'Мышью выберите белую фигуру и клетку назначения или перетащите фигуру.\nНа клавиатуре: стрелки — перемещение по доске, Enter — выбор фигуры и ход, Escape — отмена выбора. Вниз с нижнего края доски — кнопки игры, вверх — обратно; Tab — переход между элементами.',
  unknown: 'Выберите белую фигуру, затем одну из подсвеченных клеток назначения. Повторный выбор той же фигуры отменяет выбор. Действия «Вернуть ход» и «Сбросить игру» доступны под доской.',
};
