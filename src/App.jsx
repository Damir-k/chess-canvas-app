import React from 'react';
import { createAssistant, createSmartappDebugger } from '@salutejs/client';

import './App.css';
import { Game } from './pages/Game';
import { Chess, DEFAULT_POSITION } from 'chess.js'

const initializeAssistant = (getState /*: any*/, getRecoveryState) => {
  if (import.meta.env.NODE_ENV === 'development' || true) {
    return createSmartappDebugger({
      token: import.meta.env.VITE_APP_TOKEN ?? '',
      initPhrase: `Запусти ${import.meta.env.VITE_APP_SMARTAPP}`,
      getState,                                           
      // getRecoveryState: getState,                                           
      nativePanel: {
        defaultText: 'Говорите!',
        screenshotMode: false,
        tabIndex: -1,
    },
    });
  } else {
  return createAssistant({ getState });
  }
};

const initializeChessMatch = (fen=DEFAULT_POSITION) => {
  let chess = new Chess(fen)
  let today = new Date()

  chess.setHeader('Event', 'Онлайн игра')
  chess.setHeader('Site', 'SmartApp приложение Салют')
  chess.setHeader('Date', `${today.getFullYear()}.${today.getMonth()}.${today.getDate()}`)
  chess.setHeader('Round', '-')
  chess.setHeader('White', 'Пользователь')
  chess.setHeader('Black', 'Салют')

  return chess;
}

export class App extends React.Component {
  constructor(props) {
    super(props);
    console.log('constructor');

    this.state = {
      notes: [{ id: Math.random().toString(36).substring(7), title: 'тест', completed: false }],
      chess: initializeChessMatch()
    };

    this.assistant = initializeAssistant(() => this.getStateForAssistant());

    this.assistant.on('data', (event /*: any*/) => {
      console.log(`assistant.on(data)`, event);
      if (event.type === 'character') {
        console.log(`assistant.on(data): character: "${event?.character?.id}"`);
      } else if (event.type === 'insets') {
        console.log(`assistant.on(data): insets`);
      } else {
        const { action } = event;
        this.dispatchAssistantAction(action);
      }
    });

    this.assistant.on('start', (event) => {
      let initialData = this.assistant.getInitialData();

      console.log(`assistant.on(start)`, event, initialData);
    });

    this.assistant.on('command', (event) => {
      console.log(`assistant.on(command)`, event);
    });

    this.assistant.on('error', (event) => {
      console.log(`assistant.on(error)`, event);
    });

    this.assistant.on('tts', (event) => {
      console.log(`assistant.on(tts)`, event);
    });
  }

  getStateForAssistant() {
    console.log('getStateForAssistant: this.state:', this.state);
    const state = {
      item_selector: {
        items: this.state.notes.map(({ id, title }, index) => ({
          number: index + 1,
          id,
          title,
        })),
        ignored_words: [
          'добавить','установить','запиши','поставь','закинь','напомнить', // addNote.sc
          'удалить', 'удали',  // deleteNote.sc
          'выполни', 'выполнил', 'сделал' // выполнил|сделал
        ],
      },
    };
    console.log('getStateForAssistant: state:', state);
    return state;
  }

  dispatchAssistantAction(action) {
    console.log('dispatchAssistantAction', action);
    if (action) {
      switch (action.type) {
        case 'add_note':
          return this.add_note(action);

        case 'done_note':
          return this.done_note(action);

        case 'delete_note':
          return this.delete_note(action);

        case 'delete_all_notes':
          return this.delete_all_notes(action);

        default:
          throw new Error();
      }
    }
  }

  _send_action_value(action_id, value) {
    const data = {
      action: {
        action_id: action_id,
        parameters: {
          // значение поля parameters может быть любым, но должно соответствовать серверной логике
          value: value, // см.файл src/sc/noteDone.sc смартаппа в Studio Code
        },
      },
    };
    const unsubscribe = this.assistant.sendData(data, (data) => {
      // функция, вызываемая, если на sendData() был отправлен ответ
      const { type, payload } = data;
      console.log('sendData onData:', type, payload);
      unsubscribe();
    });
  }

  play_done_note(id) {
    const completed = this.state.notes.find(({ id }) => id)?.completed;
    if (!completed) {
      const texts = ['Молодец!', 'Красавица!', 'Супер!'];
      const idx = Math.floor(Math.random() * texts.length);
      this._send_action_value('done', texts[idx]);
    }
  }

  // When modifying Chess object in any way, create a new clone first so React notices
  update_chess() {
    const newChess = initializeChessMatch(this.state.chess.fen())
    newChess.loadPgn(this.state.chess.pgn())
    this.setState({ chess: newChess })
    return newChess
  }

  make_move(move) {
    const newChess = this.update_chess()

    try {
      newChess.move(move);
    } catch {
      return false
    }
    if (newChess.turn() === 'b') {
      let blackMoves = newChess.moves()
      let randomMove = blackMoves[Math.floor(Math.random()* blackMoves.length)]
      setTimeout(() => this.make_move(randomMove), 2000)
      console.log("black's turn is going to be: ", randomMove)
    }
    return true
    // console.log(newChess.ascii())
  }

  take_back() {
    const newChess = this.update_chess()
    try {
      newChess.undo()
      newChess.undo()
    } catch {
      return false
    }
    return true
  }

  reset_game() {
    const newChess = initializeChessMatch()
    this.setState({ chess: newChess })
  }

  render() {
    console.log('render');
    return (
      <>
        <Game
          chess={this.state.chess}
          onMoveMade={(move) => {
            return this.make_move(move)
          }}
          onUndoMove={() => {
            return this.take_back()
          }}
          onGameReset={() => {
            return this.reset_game()
          }}
        />
      </>
    );
  }
}
