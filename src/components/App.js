import React from "react";
import { game } from "../main";
import Board from "./BoardView";
import ScoreBoard from "./ScoreBoard"
import { DialogBox } from "./DialogBox";

function App() {
  return (
    <div className="App">
      <header className="App-header"></header>
      <div className="game-container">
        <Board className="board-container" />
        <div className="info-container">
          <ScoreBoard />
          <DialogBox className="dialog-box" />
        </div>
      </div>
    </div>
  );
}

export default App;
