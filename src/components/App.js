import React from "react";
import { game } from "../main";
import Board from "./BoardView";
import { DialogBox } from "./DialogBox";

function App() {
  return (
    <div className="App">
      <header className="App-header"></header>
      <div className="game-container">
        <Board className="board-container" />
        <div className="info-container">
          <div className="scoreboard" />
          <DialogBox className="dialog-box" />
        </div>
      </div>
    </div>
  );
}

export default App;
