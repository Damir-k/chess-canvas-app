import React from "react";
import '../App.css'

export class ResetGame extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const {onGameReset, chess} = this.props;

        return (
            <input
            className="control-button"
            type="button"
            value="Reset the game"
            disabled={false}
            onClick={ (event) => onGameReset()}
            />
        )
    }
}
