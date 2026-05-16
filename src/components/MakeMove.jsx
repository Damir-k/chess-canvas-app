import React from "react";

import "../App.css";


export class MakeMove extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      move: '',
    }
  }

  render () {
    const { onMoveMade, chess } = this.props;

    return (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (chess.turn() === 'w') {
            onMoveMade(this.state.move) || alert("Неверный ход!")
          } else {
            alert("Подождите вашего хода")
          }
          this.setState({
            move: '',
          })
        }}
      >
        <input
          className   = "make-move"
          type        = "text"
          placeholder = "Make a move"
          value       = { this.state.move }
          onChange    = {({ target: { value } }) => this.setState({
            move: value,
          })}
          required
          autoFocus
        />
      </form>
    )
  }

}

