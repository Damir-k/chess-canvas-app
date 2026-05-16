import React from 'react';
import {AddTask} from '../components/AddTask';
import {DeleteAll} from '../components/DeleteAll';
import {TaskItemList} from '../components/TaskItemList';
import {MakeMove} from '../components/MakeMove'
import { ChessboardComponent } from '../components/Chessboard';
import { UndoMove } from '../components/UndoMove';

export const Game = (props) => {
  const { items, onAdd, onDone, onDelete, onDeleteAll, onMoveMade, chess, onUndoMove } = props;
  return (
    <main className="container">
      {/* <AddTask
        onAdd = { onAdd }
      />
      <DeleteAll
        onDeleteAll = { onDeleteAll }
      />
      <TaskItemList
        items  = { items }
        onDone = { onDone }
        onDelete = { onDelete }
      /> */}
      <MakeMove
        chess = { chess }
        onMoveMade = { onMoveMade }
      />
      <UndoMove
        chess = {chess}
        onUndoMove = { onUndoMove }
      />
      <ChessboardComponent 
        chess = { chess }
        onMoveMade = { onMoveMade }
      />
    </main>
  )
}
