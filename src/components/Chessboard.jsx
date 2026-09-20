import React, { useEffect, useRef, useState } from 'react';
import '../App.css';
import { Chessboard } from 'react-chessboard';
import { consume, isBack, remoteKey } from '../remote';
import { useRemoteBack } from '../useRemoteBack';
import { RemoteDialog } from './RemoteDialog';

export const ChessboardComponent = ({ chess, onMoveMade }) => {
  const board = useRef(null);
  const [cursor, setCursor] = useState('e2');
  const [focused, setFocused] = useState(false);
  const [selection, setSelection] = useState(null);
  const [promotion, setPromotion] = useState(null);
  const [message, setMessage] = useState('');
  const fen = chess.fen();
  const selected = selection?.fen === fen ? selection.square : null;
  const pending = promotion?.fen === fen ? promotion : null;
  const canMove = chess.turn() === 'w' && !chess.isGameOver();
  const moves = selected && canMove ? chess.moves({ square: selected, verbose: true }) : [];
  useEffect(() => { board.current?.focus(); }, []);
  useEffect(() => { setSelection(null); setPromotion(null); setMessage(''); }, [fen]);
  const cancel = () => { setSelection(null); setPromotion(null); setMessage('Выбор отменён'); };
  useRemoteBack(Boolean(selected || pending), cancel);

  function attemptMove(from, to, piece) {
    if (!canMove || !to) return false;
    const legal = chess.moves({ square: from, verbose: true }).filter(move => move.to === to);
    if (!legal.length) { setMessage('Недопустимый ход. Выберите подсвеченную клетку.'); return false; }
    if (legal.some(move => move.promotion) && !piece) {
      setPromotion({ from, to, fen });
      return false; // Keep the pawn in place until the promotion is chosen.
    }
    const accepted = onMoveMade({ from, to, ...(piece ? { promotion: piece } : {}) });
    if (accepted) { setSelection(null); setPromotion(null); setMessage(''); }
    return accepted;
  }

  function activate(square) {
    setCursor(square);
    if (!canMove) { setMessage(chess.isGameOver() ? 'Партия завершена' : 'Дождитесь хода Салюта'); return; }
    if (selected === square) { cancel(); return; }
    if (chess.get(square)?.color === 'w') {
      setSelection({ square, fen });
      setMessage(chess.moves({ square }).length ? `Выбрана ${square}. Выберите клетку назначения.` : `У фигуры на ${square} нет допустимых ходов.`);
    } else if (selected) attemptMove(selected, square);
    else setMessage('Выберите белую фигуру');
  }

  function onKeyDown(event) {
    if (event.target !== board.current || event.defaultPrevented) return;
    const key = remoteKey(event);
    if (key.startsWith('Arrow')) {
      consume(event);
      const file = cursor.charCodeAt(0) - 97;
      const rank = Number(cursor[1]);
      if (key === 'ArrowDown' && rank === 1) {
        board.current.closest('.play-area')?.querySelector('.buttons input:not(:disabled)')?.focus();
        return;
      }
      const x = Math.max(0, Math.min(7, file + (key === 'ArrowRight' ? 1 : key === 'ArrowLeft' ? -1 : 0)));
      const y = Math.max(1, Math.min(8, rank + (key === 'ArrowUp' ? 1 : key === 'ArrowDown' ? -1 : 0)));
      setCursor(String.fromCharCode(97 + x) + y);
    } else if (key === 'Enter' || key === ' ') {
      consume(event);
      if (!event.repeat) activate(cursor);
    } else if (isBack(key) && (selected || pending)) {
      consume(event);
      if (!event.repeat) cancel();
    }
  }

  const squareStyles = {};
  for (const move of moves) squareStyles[move.to] = {
    backgroundImage: chess.get(move.to)
      ? 'radial-gradient(circle, transparent 55%, #125927bb 57%)'
      : 'radial-gradient(circle, #125927aa 23%, transparent 26%)',
  };
  if (selected) squareStyles[selected] = { backgroundColor: '#f2c14e' };
  if (focused) squareStyles[cursor] = { ...squareStyles[cursor], boxShadow: 'inset 0 0 0 4px #fff, inset 0 0 0 8px #1263cb' };
  const options = {
    id: 'main', position: fen, squareStyles,
    onSquareClick: ({ square }) => { board.current?.focus(); activate(square); },
    onPieceDrop: ({ sourceSquare, targetSquare }) => attemptMove(sourceSquare, targetSquare),
    boardStyle: { width: '100%', borderRadius: '6px' },
    darkSquareStyle: { backgroundColor: '#7b9068' },
    lightSquareStyle: { backgroundColor: '#e7e8cf' },
    darkSquareNotationStyle: { color: '#faf9e9', fontWeight: 600 },
    lightSquareNotationStyle: { color: '#4b603f', fontWeight: 600 },
    allowAutoScroll: false, allowDragging: canMove && !pending,
  };
  return <>
    <div id="main-board" ref={board} tabIndex={0} role="group"
      aria-label={`Шахматная доска. Клетка ${cursor}${selected ? `. Выбрана ${selected}` : ''}`}
      aria-describedby="remote-help" onKeyDown={onKeyDown}
      onFocus={event => setFocused(event.target === board.current)} onBlur={() => setFocused(false)}>
      <Chessboard options={options} />
    </div>
    <p className="board-feedback" role="status">{message || `Клетка ${cursor} · OK — выбрать`}</p>
    <RemoteDialog open={Boolean(pending)} title="Превращение пешки" onClose={() => setPromotion(null)}>
      <div className="difficulty-buttons">
        { [['q', 'Ферзь'], ['r', 'Ладья'], ['b', 'Слон'], ['n', 'Конь']].map(([piece, label], index) =>
          <button key={piece} data-autofocus={index === 0 || undefined}
            onClick={() => pending && attemptMove(pending.from, pending.to, piece)}>{label}</button>) }
        <button onClick={() => setPromotion(null)}>Отмена</button>
      </div>
    </RemoteDialog>
  </>;
};
