// Game.jsx

import React from 'react';
import {AddTask} from '../components/AddTask';
import {DeleteAll} from '../components/DeleteAll';
import {TaskItemList} from '../components/TaskItemList';
import {MakeMove} from '../components/MakeMove'
import { ChessboardComponent } from '../components/Chessboard';
import { UndoMove } from '../components/UndoMove';
import { ResetGame } from '../components/ResetGame';

export const Game = (props) => {
  const { items, onAdd, onDone, onDelete, onDeleteAll, onMoveMade, chess, onUndoMove, onGameReset, difficulty} = props;
  // console.log('Game получил difficulty:', difficulty); // для проверки
  // console.log('ВСЕ пропсы:', props);
  // Функция для получения названия 
  const getDifficultyDisplay = (level) => {
    switch(level) {
      case 'easy': return { text: 'Лёгкая', color: '#4CAF50' };
      case 'medium': return { text: 'Средняя', color: '#FFC107' };
      case 'hard': return { text: 'Сложная', color: '#f44336' };
      default: return { text: 'Некая', color: '#09658a' };
    }
  };

  const diffDisplay = getDifficultyDisplay(difficulty);

  return (
    
    <main className="container">

      <div style={{
        position: 'fixed',
        top: '10px',
        right: '290px', 
        backgroundColor: diffDisplay.color,
        color: 'white',
        padding: '8px 16px',
        borderRadius: '20px',
        fontWeight: 'bold',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        zIndex: 101,
        fontSize: '14px'
      }}>
        {diffDisplay.text}
      </div>

      <MakeMove
        chess = { chess }
        onMoveMade = { onMoveMade }
      />
      <div className='buttons'>
      <UndoMove
        chess = { chess }
        onUndoMove = { onUndoMove }
      />
      <ResetGame
        chess = { chess }
        onGameReset = { onGameReset }
      />
      </div>
      <ChessboardComponent 
        chess = { chess }
        onMoveMade = { onMoveMade }
      />
    </main>
  )
}
