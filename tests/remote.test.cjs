// Component-handler regression tests without a browser. Uses real chess.js and
// the production JSX; a small hook harness supplies state and DOM focus doubles.
const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const { buildSync } = require('esbuild');
const React = require('react');
const { Chess } = require('chess.js');

function load(entry, hooks = {}, globals = {}) {
  const code = buildSync({ entryPoints: [entry], bundle: true, write: false,
    platform: 'node', format: 'cjs', packages: 'external', define: { 'import.meta.env': '{}' }, loader: { '.css': 'empty' } }).outputFiles[0].text;
  const module = { exports: {} };
  vm.runInNewContext(code, { module, exports: module.exports, console,
    require: name => name === 'react' ? { ...React, ...hooks } :
      name === 'react-chessboard' ? { Chessboard: 'Chessboard' } :
      name === '@headlessui/react' ? { Dialog: 'Dialog', DialogPanel: 'Panel', DialogTitle: 'Title' } : require(name),
    ...globals });
  return module.exports;
}
function event(key, target, repeat = false) {
  return { key, target, repeat, defaultPrevented: false,
    preventDefault() { this.defaultPrevented = true; }, stopPropagation() {} };
}
function board(fen) {
  const chess = new Chess(fen);
  let slots = [], index = 0, effects = [], tree, moves = [], pop;
  const window = { history: { state: null, pushState() {}, back() { pop?.(); } },
    addEventListener(name, callback) { if (name === 'popstate') pop = callback; } };
  const hooks = {
    useState(initial) { const i = index++; if (!(i in slots)) slots[i] = initial;
      return [slots[i], value => { slots[i] = typeof value === 'function' ? value(slots[i]) : value; }]; },
    useRef(initial) { const i = index++; return slots[i] ||= { current: initial }; },
    useEffect(fn, deps) { const i = index++; const old = slots[i];
      if (!old || deps.some((d, n) => !Object.is(d, old.deps[n]))) {
        effects.push(() => { old?.cleanup?.(); slots[i] = { deps, cleanup: fn() }; });
      }
    },
  };
  const { ChessboardComponent } = load('src/components/Chessboard.jsx', hooks, { window });
  const node = { focus() {}, closest() { return { querySelector() { return { focus() {} }; } }; } };
  function render() {
    index = 0; effects = [];
    tree = ChessboardComponent({ chess, onMoveMade(move) { chess.move(move); moves.push(move); return true; } });
    tree.props.children[0].props.ref.current = node;
    effects.forEach(fn => fn());
  }
  render(); render();
  return { chess, moves, render,
    get root() { return tree.props.children[0]; },
    get options() { return tree.props.children[0].props.children.props.options; },
    get dialog() { return tree.props.children[2]; },
    key(key, repeat) { const e = event(key, node, repeat); this.root.props.onKeyDown(e); render(); return e; },
    click(square) { this.options.onSquareClick({ square }); render(); },
    back() { pop(); render(); },
  };
}

test('OK selects e2, marks legal squares, arrows and OK play e2-e4 once', () => {
  const b = board(); b.key('Enter');
  assert.ok(b.options.squareStyles.e3); assert.ok(b.options.squareStyles.e4);
  b.key('ArrowUp'); b.key('ArrowUp'); b.key('Enter');
  assert.equal(b.chess.get('e4').type, 'p'); assert.equal(b.moves.length, 1);
  b.key('Enter', true); assert.equal(b.moves.length, 1);
});
test('invalid move retains selection; Escape and native Back cancel', () => {
  const b = board(); b.key('Enter'); b.key('ArrowRight'); b.key('ArrowUp'); b.key('Enter');
  assert.equal(b.moves.length, 0); assert.ok(b.options.squareStyles.e4);
  assert.equal(b.key('Escape').defaultPrevented, true);
  assert.equal(b.options.squareStyles.e4, undefined);
  assert.equal(b.key('Escape').defaultPrevented, false);
  b.click('e2'); b.back(); assert.equal(b.options.squareStyles.e4, undefined);
  assert.equal(b.key('Home').defaultPrevented, false);
});
test('mouse/touch square selection and drag use the same move callback', () => {
  const b = board(); b.click('d2'); b.click('d4'); assert.equal(b.chess.get('d4').type, 'p');
  const c = board(); assert.equal(c.options.onPieceDrop({ sourceSquare: 'e2', targetSquare: 'e4' }), true);
  assert.equal(c.chess.get('e4').type, 'p');
});
test('all four promotions, cancellation, and drag promotion', () => {
  for (let i = 0; i < 4; i++) {
    const b = board('7k/P7/8/8/8/8/8/7K w - - 0 1');
    b.click('a7'); b.click('a8'); assert.equal(b.dialog.props.open, true);
    assert.equal(b.moves.length, 0);
    b.dialog.props.children.props.children[0][i].props.onClick(); b.render();
    assert.equal(b.chess.get('a8').type, ['q', 'r', 'b', 'n'][i]);
  }
  const b = board('7k/P7/8/8/8/8/8/7K w - - 0 1');
  assert.equal(b.options.onPieceDrop({ sourceSquare: 'a7', targetSquare: 'a8' }), false); b.render();
  b.dialog.props.onClose(); b.render(); assert.equal(b.moves.length, 0);
  assert.equal(b.chess.get('a7').type, 'p');
});
test('castling, en passant and check restrictions come from chess.js', () => {
  const b = board('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1');
  b.click('e1'); b.click('g1'); assert.equal(b.chess.get('f1').type, 'r');
  const c = board('7k/8/8/3pP3/8/8/8/7K w - d6 0 2');
  c.click('e5'); c.click('d6'); assert.equal(c.chess.get('d5'), undefined);
  const d = board('k3r3/8/8/8/8/8/P7/4K3 w - - 0 1');
  d.click('a2'); d.click('a3'); assert.equal(d.moves.length, 0);
});
test('black turn and game over reject human moves; changed position clears hints', () => {
  const b = board(); b.click('e2'); b.chess.move('d4'); b.render();
  assert.equal(b.options.squareStyles.e4, undefined); b.click('e7'); b.click('e5'); assert.equal(b.moves.length, 0);
  const c = board('7k/6Q1/5K2/8/8/8/8/8 b - - 0 1');
  assert.equal(c.chess.isCheckmate(), true); assert.equal(c.options.allowDragging, false);
});
test('spatial controls move according to layout and suppress repeated OK', () => {
  const document = { activeElement: null };
  const { navigateControls } = load('src/remote.js', {}, { document });
  let clicks = 0;
  const controls = [0, 1, 2].map(i => ({ getBoundingClientRect: () => ({ left: 0, right: 100, top: i * 60, bottom: i * 60 + 40 }),
    focus() { document.activeElement = this; }, click() { clicks++; } }));
  document.activeElement = controls[0];
  const dispatch = (key, repeat) => { const e = event(key, document.activeElement, repeat);
    e.currentTarget = { querySelectorAll: () => controls }; navigateControls(e); };
  dispatch('ArrowDown'); assert.equal(document.activeElement, controls[1]);
  dispatch('Enter'); dispatch('Enter', true); assert.equal(clicks, 1);
  dispatch('ArrowUp'); assert.equal(document.activeElement, controls[0]);
});

test('existing App pipeline accepts object moves, delayed engine reply, undo and reset', () => {
  const timers = [];
  const { App } = load('src/App.jsx', {}, { setTimeout: fn => { timers.push(fn); return timers.length; }, clearTimeout() {} });
  const app = Object.create(App.prototype);
  const listeners = new Set();
  const engine = { addListener: fn => listeners.add(fn), removeListener: fn => listeners.delete(fn), setPosition() {}, sendCommand() {} };
  app.state = { chess: new Chess(), stockfish: engine, gameState: 'in-progress' };
  app.setState = update => Object.assign(app.state, update);
  app.say_phrase = () => {};
  assert.equal(app.handleTextInput({ from: 'e2', to: 'e4' }), true);
  assert.equal(app.state.chess.turn(), 'b'); assert.equal(listeners.size, 1);
  for (const fn of [...listeners]) fn('bestmove e7e5');
  assert.equal(app.state.chess.turn(), 'w'); assert.equal(listeners.size, 0);
  assert.equal(app.take_back(), true); assert.equal(app.state.chess.history().length, 0);
  app.make_move('d4'); const stale = [...listeners][0]; app.reset_game();
  stale('bestmove d7d5'); assert.equal(app.state.chess.history().length, 0);
  assert.equal(listeners.size, 0);
});

test('a complete game reaches checkmate and the result, then resets', () => {
  const timers = [];
  const { App } = load('src/App.jsx', {}, { setTimeout: fn => { timers.push(fn); return timers.length; }, clearTimeout() {} });
  const app = Object.create(App.prototype);
  const listeners = new Set();
  app.state = { chess: new Chess(), gameState: 'in-progress', stockfish: {
    addListener: fn => listeners.add(fn), removeListener: fn => listeners.delete(fn), setPosition() {}, sendCommand() {},
  } };
  app.setState = update => Object.assign(app.state, update); app.say_phrase = () => {};
  app.handleTextInput({ from: 'f2', to: 'f3' });
  for (const fn of [...listeners]) fn('bestmove e7e5');
  app.handleTextInput({ from: 'g2', to: 'g4' });
  for (const fn of [...listeners]) fn('bestmove d8h4');
  assert.equal(app.state.chess.isCheckmate(), true);
  timers.forEach(fn => fn()); assert.equal(app.state.gameState, 'player-lost');
  app.reset_game(); assert.equal(app.state.gameState, 'in-progress');
  assert.equal(app.state.showDifficultyModal, true);
});

test('help renders appropriate instructions for every documented surface', () => {
  const { renderToStaticMarkup } = require('react-dom/server');
  const { detectControlMode } = load('src/controlInstructions.js');
  const HelpSidebar = load('src/components/HelpSidebar/HelpSidebar.jsx').default;
  const surfaces = {
    SBERBOX: 'tv', TV: 'tv', TV_HUAWEI: 'tv', TIME: 'tv', SATELLITE: 'tv',
    SBOL: 'mobile', COMPANION: 'mobile', STARGATE: 'mobile',
    SBERBOOM: 'unknown', SBERBOOM_MINI: 'unknown', FUTURE_SURFACE: 'unknown',
  };
  for (const [surface, expected] of Object.entries(surfaces)) {
    const controlMode = detectControlMode(surface, { navigator: { userAgent: 'iPhone' } });
    assert.equal(controlMode, expected, surface);
    const html = renderToStaticMarkup(React.createElement(HelpSidebar, { controlMode }));
    const instructions = html.match(/id="remote-help">([^<]+)/)[1];
    if (expected === 'tv') {
      assert.match(instructions, /стрелками.*OK.*Назад/);
      assert.doesNotMatch(instructions, /мыш|касани|клавиатур|Enter|Escape/i);
    } else if (expected === 'mobile') {
      assert.match(instructions, /Коснитесь/);
      assert.doesNotMatch(instructions, /пульт|мыш|Enter|Escape|клавиатур/i);
    } else assert.doesNotMatch(instructions, /пульт|мыш|касани|Enter|Escape|клавиатур|OK/i);
  }
  const desktop = renderToStaticMarkup(React.createElement(HelpSidebar, { controlMode: 'desktop' }));
  assert.match(desktop, /Мышью/); assert.match(desktop, /Enter/); assert.match(desktop, /Escape/);
  assert.doesNotMatch(desktop, /Пульт:|Коснитесь/);
});

test('browser fallback distinguishes TV, phones, tablets, touch PCs and unknown devices', () => {
  const { detectControlMode } = load('src/controlInstructions.js');
  const cases = [
    ['Mozilla Android SmartTV Mobile', ['(pointer: coarse)'], 10, 'tv'],
    ['SberBox', [], 0, 'tv'],
    ['iPhone', ['(pointer: coarse)'], 5, 'mobile'],
    ['Android Mobile', ['(pointer: coarse)'], 5, 'mobile'],
    ['Android Tablet', ['(pointer: coarse)'], 5, 'mobile'],
    ['Macintosh', ['(pointer: coarse)'], 5, 'mobile'],
    ['Windows NT 10.0', ['(pointer: fine)', '(hover: hover)'], 10, 'desktop'],
    ['Macintosh', ['(pointer: fine)', '(hover: hover)'], 0, 'desktop'],
    ['X11; Linux x86_64', ['(pointer: fine)', '(hover: hover)'], 0, 'desktop'],
    ['Unknown touch display', ['(pointer: coarse)'], 10, 'unknown'],
    ['Android', [], 0, 'unknown'],
    ['', [], 0, 'unknown'],
  ];
  for (const [userAgent, media, maxTouchPoints, expected] of cases) {
    const browser = { navigator: { userAgent, maxTouchPoints }, matchMedia: q => ({ matches: media.includes(q) }) };
    assert.equal(detectControlMode('', browser), expected, userAgent);
    assert.equal(detectControlMode('TV', browser), 'tv', 'SDK takes priority');
  }
  assert.equal(detectControlMode('', {}), 'unknown');
  assert.equal(detectControlMode('', { navigator: { userAgentData: { mobile: true } } }), 'mobile');
});

test('surface metadata works in RUN_APP, initial SDK data and later events', () => {
  const { surfaceFromMessage } = load('src/controlInstructions.js');
  for (const message of [
    { messageName: 'RUN_APP', payload: { device: { surface: 'TV' } } },
    { device: { surface: ' tv ' } },
    { type: 'smart_app_data', smart_app_data: { device: { surface: 'TV' } } },
    { type: 'smart_app_data', smart_app_data: { payload: { device: { surface: 'TV' } } } },
  ]) assert.equal(surfaceFromMessage(message), 'TV');
  for (const message of [null, {}, { device: { surface: 1 } }, { payload: { device: null } }]) {
    assert.equal(surfaceFromMessage(message), '');
  }
  const handlers = {};
  const assistant = { on: (name, fn) => { handlers[name] = fn; },
    getInitialData: () => [{ type: 'smart_app_data', smart_app_data: { device: { surface: 'TIME' } } }] };
  const { App } = load('src/App.jsx', {}, {
    require: name => name === '@salutejs/client' ? { createAssistant: () => assistant } :
      name === 'react-chessboard' ? { Chessboard: 'Chessboard' } : require(name),
  });
  const app = new App({}); app.setState = update => Object.assign(app.state, update);
  handlers.start(); assert.equal(app.state.controlMode, 'tv');
  handlers.data({ type: 'character' }); assert.equal(app.state.controlMode, 'tv');
  handlers.data({ type: 'smart_app_data', device: { surface: 'COMPANION' } });
  assert.equal(app.state.controlMode, 'mobile');
  handlers.command({ payload: { device: { surface: 'TV_HUAWEI' } } });
  assert.equal(app.state.controlMode, 'tv');
  app.state.showDifficultyModal = false;
  assert.equal(app.render().props.children[1].props.controlMode, 'tv');
});
