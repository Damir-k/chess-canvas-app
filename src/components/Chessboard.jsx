import React from 'react';
import '../App.css';
import { Chessboard } from 'react-chessboard';

export const ChessboardComponent = ({ chess, onMoveMade }) => {
  function onPieceDrop({ sourceSquare, targetSquare }) {
    if (!targetSquare || chess.turn() === 'b' || chess.isGameOver()) return false;
    return onMoveMade(sourceSquare + '-' + targetSquare);
  }
  const options = {
    id: 'main',
    position: chess.fen(),
    onPieceDrop,
    boardStyle: { width: '100%', borderRadius: '6px' },
    darkSquareStyle: { backgroundColor: '#7b9068' },
    lightSquareStyle: { backgroundColor: '#e7e8cf' },
    darkSquareNotationStyle: { color: '#faf9e9', fontWeight: 600 },
    lightSquareNotationStyle: { color: '#4b603f', fontWeight: 600 },
    allowAutoScroll: false,
    allowDragging: chess.turn() === 'w' && !chess.isGameOver(),
  };
  return <div id="main-board" aria-label="Шахматная доска"><Chessboard options={options} /></div>;
};
