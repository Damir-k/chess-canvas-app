import React from 'react';
import { ChessboardComponent } from '../components/Chessboard';
import { UndoMove } from '../components/UndoMove';
import { ResetGame } from '../components/ResetGame';
import HelpSidebar from '../components/HelpSidebar/HelpSidebar';
import { GameOverModal } from '../components/GameOverModal';
import { consume, isBack, navigateControls, remoteKey } from '../remote';
import { useRemoteBack } from '../useRemoteBack';

const difficultyLabels = { easy: 'Лёгкая', medium: 'Средняя', hard: 'Сложная' };

export const Game = ({ onMoveMade, chess, onUndoMove, onGameReset, difficulty, gameState, onGameOverChoice }) => {
  useRemoteBack(!['in-progress', 'viewing-game'].includes(gameState), () => onGameOverChoice('return'));
  const status = chess.isGameOver() ? 'Партия завершена' : chess.turn() === 'w'
    ? (chess.isCheck() ? 'Вам шах · ваш ход' : 'Ваш ход') : 'Ход Салюта';
  return (
    <main className="container">
      <GameOverModal gameState={gameState} onGameOverChoice={onGameOverChoice} difficulty={difficulty} />
      <header className="game-header">
        <div className="game-brand">
          <span className="brand-piece" aria-hidden="true">♞</span>
          <div><p className="eyebrow">ИГРА С АССИСТЕНТОМ</p><h1>Шахматы с Салютом</h1></div>
        </div>
        <span className={`difficulty-mark difficulty-${difficulty}`}>
          <span className="difficulty-dot" aria-hidden="true" />
          {difficultyLabels[difficulty] || 'Средняя'} сложность
        </span>
      </header>
      <div className="game-layout">
        <section className="play-area" aria-label="Шахматная партия">
          <div className="player-row">
            <div className="player-info"><span className="player-avatar" aria-hidden="true">С</span><div><strong>Салют</strong><span>Чёрные фигуры</span></div></div>
            <span className="turn-status" role="status">{status}</span>
          </div>
          <ChessboardComponent chess={chess} onMoveMade={onMoveMade} />
          <div className="player-row player-row-bottom">
            <div className="player-info"><span className="player-avatar player-avatar-light" aria-hidden="true">В</span><div><strong>Вы</strong><span>Белые фигуры</span></div></div>
            <span className="move-number">Ход {chess.moveNumber()}</span>
          </div>
          <div className="buttons" aria-label="Управление партией" onKeyDown={event => {
            const key = remoteKey(event);
            if (key === 'ArrowUp' || isBack(key)) {
              consume(event);
              event.currentTarget.closest('.play-area').querySelector('#main-board').focus();
            } else navigateControls(event);
          }}>
            <UndoMove chess={chess} onUndoMove={onUndoMove} />
            <ResetGame chess={chess} onGameReset={onGameReset} />
          </div>
        </section>
        <HelpSidebar />
      </div>
    </main>
  );
};
