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

async function postChessApi(data = {}) {
    const response = await fetch("https://chess-api.com/v1", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    });
    return response.json();
}

export class App extends React.Component {
  constructor(props) {
    super(props);
    // console.log('constructor');

    this.state = {
      notes: [{ id: Math.random().toString(36).substring(7), title: 'тест', completed: false }],
      chess: initializeChessMatch()
    };

    this.assistant = initializeAssistant(() => this.getStateForAssistant());

    this.assistant.on('data', (event /*: any*/) => {
      // console.log(`assistant.on(data)`, event);
      if (event.type === 'character') {
        // console.log(`assistant.on(data): character: "${event?.character?.id}"`);
      } else if (event.type === 'insets') {
        // console.log(`assistant.on(data): insets`);
      } else {
        const { action } = event;
        this.dispatchAssistantAction(action);
      }
    });

    this.assistant.on('start', (event) => {
      let initialData = this.assistant.getInitialData();

      // console.log(`assistant.on(start)`, event, initialData);
    });

    this.assistant.on('command', (event) => {
      // console.log(`assistant.on(command)`, event);
    });

    this.assistant.on('error', (event) => {
      console.log(`assistant.on(error)`, event);
    });

    this.assistant.on('tts', (event) => {
      // console.log(`assistant.on(tts)`, event);
    });
  }

  getStateForAssistant() {
    // console.log('getStateForAssistant: this.state:', this.state);
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
      fen: this.state.chess.fen()
    };
    // console.log('getStateForAssistant: state:', state);
    return state;
  }

  dispatchAssistantAction(action) {
    // console.log('dispatchAssistantAction', action);
    if (action) {
      switch (action.type) {
        case 'reset_game':
          return this.reset_game()
        
        case 'undo_move':
          return this.handle_undo_move_attempt()

        case 'make_move':
          return this.handle_make_move_attempt(action.move)
        
        default:
          console.error("unknown action type:", action.type)
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

  handle_undo_move_attempt() {
    if(this.take_back()) {
      this.say_phrase("Возвращаю Ваш ход.")
    } else {
      setTimeout(() => {
        if(this.take_back()) {
          this.say_phrase("Возвращаю Ваш ход.")
        } else {
          this.say_phrase("Вернуть ход не получилось.")
        }  
      }, 500)
    }
  }

  handle_make_move_attempt(move) {
    const { parseTree, piece, file, rank } = move;
    // console.log("make_move: ", parseTree)
    console.info("Piece:", piece, "file:", file, "rank:", rank)
    const file_dictionary = {
      "a": "a",
      "а": "a",
      "b": "b",
      "б": "b",
      "бэ": "b",
      "би": "b",
      "ц": "c",
      "це": "c",
      "цэ": "c",
      "си": "c",
      "c": "c",
      "d": "d",
      "д": "d",
      "дэ": "d",
      "ди": "d",
      "e": "e",
      "е": "e",
      "и": "e",
      "f": "f",
      "эф": "f",
      "ф": "f",
      "фэ": "f",
      "g": "g",
      "джи": "g",
      "дже": "g",
      "жи": "g",
      "же": "g",
      "ж": "g",
      "г": "g",
      "гэ": "g",
      "h": "h",
      "х": "h",
      "ха": "h",
      "хэ": "h",
      "эйч": "h",
      "аш": "h",
      "ш": "h",
      
    }

    if (piece === undefined) {
      const parsedMove = file_dictionary[file.toLowerCase()] + rank
      console.info("Parsed move:", parsedMove)
      this.make_move(parsedMove) || console.warn(parsedMove, "failed")
    }
  }

  say_phrase(phrase) {
    this._send_action_value('say_phrase', phrase)
  }

  // When modifying Chess object in any way, create a new clone first so React notices
  update_chess() {
    const newChess = initializeChessMatch(this.state.chess.fen())
    newChess.loadPgn(this.state.chess.pgn())
    this.setState({ chess: newChess })
    return newChess
  }

  show_result(chess) {
    console.log(chess)
    if (chess.isCheckmate()) {
      if (chess.turn() === 'w') {
        alert("Black won!")
      } else {
        alert("White won!")
      }
    } else if (chess.isDraw() || chess.isDrawByFiftyMoves() || chess.isStalemate() || 
    chess.isInsufficientMaterial() || chess.isThreefoldRepetition()) {
      alert("It's a draw!")
    } else {
      alert("What is happening")
    }
  }

  make_move(move) {
    const newChess = this.update_chess()

    try {
      newChess.move(move);
    } catch {
      return false
    }

    if (newChess.isGameOver()) {
      setTimeout(() => this.show_result(newChess), 1000)
      return true
    }

    if (newChess.turn() === 'b') {
      let blackMoves = newChess.moves()
      let responseMove = blackMoves[Math.floor(Math.random()* blackMoves.length)]
      console.log("black's turn is going to be: ", responseMove)
      setTimeout(() => this.make_move(responseMove), 500)
      // let previous_moves = newChess.history().join(' ')
      // console.log(previous_moves)

      // postChessApi({ input: previous_moves }).then((data) => {
      //   console.log(data)
      //   setTimeout(() => this.make_move(data.san), 500)
      // })

    }
    return true
  }

  take_back() {
    const newChess = this.update_chess()

    return newChess.turn() === 'w' && (newChess.undo() !== null && newChess.undo() !== null)
  }

  reset_game() {
    const newChess = initializeChessMatch()
    this.setState({ chess: newChess })
  }

  render() {
    // console.log('render');
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
