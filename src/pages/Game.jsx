import React from 'react';
import {AddTask} from '../components/AddTask';
import {DeleteAll} from '../components/DeleteAll';
import {TaskItemList} from '../components/TaskItemList';
import {MakeMove} from '../components/MakeMove'
import { ChessboardComponent } from '../components/Chessboard';
import { UndoMove } from '../components/UndoMove';
import { ResetGame } from '../components/ResetGame';

export const Game = (props) => {
  const { items, onAdd, onDone, onDelete, onDeleteAll, onMoveMade, chess, onUndoMove, onGameReset } = props;
  return (
    <main className="container">
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
