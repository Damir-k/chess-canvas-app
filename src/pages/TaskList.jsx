import React from 'react';
import {AddTask} from '../components/AddTask';
import {DeleteAll} from '../components/DeleteAll';
import {TaskItemList} from '../components/TaskItemList';
import {MakeMove} from '../components/MakeMove'

export const TaskList = (props) => {
  const { items, onAdd, onDone, onDelete, onDeleteAll, onMoveMade } = props;
  return (
    <main className="container">
      <AddTask
        onAdd = { onAdd }
      />
      <DeleteAll
        onDeleteAll = { onDeleteAll }
      />
      <TaskItemList
        items  = { items }
        onDone = { onDone }
        onDelete = { onDelete }
      />
      <MakeMove
        onMoveMade = { onMoveMade }
      />
    </main>
  )
}
