import React from 'react';
import {AddTask} from '../components/AddTask';
import {DeleteAll} from '../components/DeleteAll';
import {TaskItemList} from '../components/TaskItemList';
import {MakeMove} from '../components/MakeMove'
import { ChessboardComponent } from '../components/Chessboard';

export const TaskList = (props) => {
  const { items, onAdd, onDone, onDelete, onDeleteAll, onMoveMade, chess } = props;
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
      <ChessboardComponent 
        chess = { chess }
        onMoveMade = { onMoveMade }
      />
    </main>
  )
}
