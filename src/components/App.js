import React from 'react';
import Board from './BoardView'

function App() {
  return (
    <div className="App">
      <header className="App-header"></header>
      <div className="game-container">
        <Board className="board-container"/>
        <div className="info-container"></div>
      </div>
    </div>
  );
}

export default App;
