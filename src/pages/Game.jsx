// Game.jsx

import React from 'react';
import {MakeMove} from '../components/MakeMove'
import { ChessboardComponent } from '../components/Chessboard';
import { UndoMove } from '../components/UndoMove';
import { ResetGame } from '../components/ResetGame';
import HelpSidebar from '../components/HelpSidebar/HelpSidebar';

export const Game = (props) => {
  const { onMoveMade, chess, onUndoMove, onGameReset, difficulty} = props;
  // console.log('Game получил difficulty:', difficulty); // для проверки
  // console.log('ВСЕ пропсы:', props);
  // Функция для получения названия 
  const getDifficultyDisplay = (difficulty) => {
    switch(difficulty) {
      case 'easy': return { text: 'Лёгкая', color: '#4CAF50' };
      case 'medium': return { text: 'Средняя', color: '#FFC107' };
      case 'hard': return { text: 'Сложная', color: '#f44336' };
      default: return { text: 'Некая', color: '#09658a' };
    }
  };
  
  const diffDisplay = getDifficultyDisplay(difficulty);

  return (
    
    <main className="container">

      <div className='difficulty-mark' style={{
        backgroundColor: diffDisplay.color,
      }}>
        {diffDisplay.text}
      </div>
{/*       
      <MakeMove
        chess = { chess }
        onMoveMade = { onMoveMade }
      />
       */}
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
      <HelpSidebar />
    </main>
  )
}
