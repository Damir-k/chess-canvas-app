import React from "react";
import '../App.css'

export class UndoMove extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const {onUndoMove, chess} = this.props;

        return (
            <input
            className="control-button"
            type="button"
            value="Вернуть ход"
            disabled={chess.turn() === 'b' || chess.moveNumber() === 1}
            onClick={ (event) => onUndoMove()}
            />
        )
    }
}
