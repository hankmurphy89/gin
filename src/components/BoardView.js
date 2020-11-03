import React from 'react';
import PlayerHand from './PlayerHandView'
import OpponentHand from './OpponentHandView'
import DiscardPile from './DiscardPileView'
import Deck from './DeckView'
import { gameDeck } from "../main"
import { observer } from "mobx-react"


function Board() {
  // gameDeck.shuffle()
  

  return (
        <div className="board-container">
          <OpponentHand cards={gameDeck}/>
          <div>
            <Deck cards={gameDeck}/>
            <DiscardPile cards={gameDeck}/>
          </div>
          <PlayerHand cards={gameDeck}/>
        </div>
        
  );
}

export default observer(Board);
