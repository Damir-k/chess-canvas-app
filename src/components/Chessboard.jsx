import React from "react";
import '../App.css'
import { Chessboard } from "react-chessboard";


export const ChessboardComponent = (props) => {
    const { chess, onMoveMade } = props;

    // handle piece drop
    function onPieceDrop({
      sourceSquare,
      targetSquare
    }) {
      // type narrow targetSquare potentially being null (e.g. if dropped off board)
      if (!targetSquare || chess.turn() === 'b') {
        return false;
      }
      let successful = onMoveMade(sourceSquare + '-' + targetSquare)
      return successful
    }

    // set the chessboard options
    const chessboardOptions = {
      position: chess.fen(),
      onPieceDrop: onPieceDrop,
      id: 'main',
      boardStyle: {
        width: '100%',
        height: '100%',
      }
    };

    // render the chessboard
    return <Chessboard 
        options={chessboardOptions} 
    />;
}