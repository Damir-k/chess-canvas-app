import React, { useEffect, useRef, useState } from "react";
import "../App.css";
import { Chessboard } from "react-chessboard";
import { consume, isBack, remoteKey } from "../remote";

const files = "abcdefgh";

export const ChessboardComponent = ({ chess, onMoveMade }) => {
  const [cursor, setCursor] = useState("e2");
  const [selected, setSelected] = useState(null);
  const boardRef = useRef(null);
  const position = chess.fen();
  const canPlay = chess.turn() === "w" && !chess.isGameOver();
  const legalMoves = selected && canPlay
    ? chess.moves({ square: selected, verbose: true })
    : [];
  const destinations = new Set(legalMoves.map(move => move.to));

  // A move changes the position synchronously through the parent. Clear stale
  // selection hints and keep the cursor on the square that was just played.
  useEffect(() => {
    setSelected(null);
  }, [position]);

  useEffect(() => {
    boardRef.current?.focus();
  }, []);

  function playMove(from, to) {
    const move = legalMoves.find(candidate => candidate.to === to);
    if (!move) return false;
    const promotion = move.promotion ? "q" : "";
    const accepted = onMoveMade(`${from}-${to}${promotion}`);
    if (accepted) {
      setCursor(to);
      setSelected(null);
    }
    return accepted;
  }

  function activateSquare(square) {
    setCursor(square);
    if (selected) {
      if (playMove(selected, square)) return;
      if (selected === square) {
        setSelected(null);
        return;
      }
    }
    const piece = chess.get(square);
    setSelected(canPlay && piece?.color === "w" ? square : null);
  }

  function onKeyDown(event) {
    const key = remoteKey(event);
    if (isBack(key)) {
      if (selected) {
        consume(event);
        if (!event.repeat) setSelected(null);
      }
      return;
    }
    const directions = {
      ArrowLeft: [-1, 0], ArrowRight: [1, 0],
      ArrowUp: [0, 1], ArrowDown: [0, -1],
    };
    if (directions[key]) {
      consume(event);
      if (event.repeat) return;
      const [dx, dy] = directions[key];
      const file = files.indexOf(cursor[0]) + dx;
      const rank = Number(cursor[1]) + dy;
      if (file >= 0 && file < 8 && rank >= 1 && rank <= 8) {
        setCursor(`${files[file]}${rank}`);
      }
      return;
    }
    if (key === "Enter" || key === " ") {
      consume(event);
      if (!event.repeat) activateSquare(cursor);
    }
  }

  function onPieceDrop({ sourceSquare, targetSquare }) {
    if (!targetSquare || !canPlay) return false;
    const piece = chess.get(sourceSquare);
    const promotion = piece?.type === "p" && (targetSquare[1] === "8" || targetSquare[1] === "1") ? "q" : "";
    return onMoveMade(`${sourceSquare}-${targetSquare}${promotion}`);
  }

  const squareStyles = {};
  if (selected) squareStyles[selected] = { background: "rgba(246, 246, 105, 0.6)" };
  for (const square of destinations) {
    squareStyles[square] = {
      ...squareStyles[square],
      background: "radial-gradient(circle, rgba(40, 120, 70, 0.55) 22%, transparent 24%)",
    };
  }
  squareStyles[cursor] = {
    ...squareStyles[cursor],
    boxShadow: "inset 0 0 0 4px #1688ff",
  };

  const options = {
    id: "main",
    position,
    onPieceDrop,
    onSquareClick: ({ square }) => activateSquare(square),
    squareStyles,
    boardStyle: { width: "100%", borderRadius: "6px" },
    darkSquareStyle: { backgroundColor: "#7b9068" },
    lightSquareStyle: { backgroundColor: "#e7e8cf" },
    darkSquareNotationStyle: { color: "#faf9e9", fontWeight: 600 },
    lightSquareNotationStyle: { color: "#4b603f", fontWeight: 600 },
    allowAutoScroll: false,
    allowDragging: canPlay,
  };
  return (
    <div
      id="main-board"
      aria-label="Шахматная доска"
      role="application"
      tabIndex={0}
      ref={boardRef}
      onKeyDown={onKeyDown}
    >
      <Chessboard options={options} />
    </div>
  );
};
