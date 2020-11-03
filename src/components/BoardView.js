import React from 'react';
import Hand from './HandView'
import { gameDeck } from "../main"
import { observer } from "mobx-react"


function Board( {cards} ) {
  return (
        <div className="board-container">
          <Hand cards={gameDeck}/>
          <Hand cards={gameDeck}/>
          <Hand cards={gameDeck}/>
        </div>
        
  );
}

export default observer(Board);
