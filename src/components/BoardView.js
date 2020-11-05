import React from "react";
import PlayerHand from "./PlayerHandView";
import OpponentHand from "./OpponentHandView";
import DiscardPile from "./DiscardPileView";
import Deck from "./DeckView";
import { game } from "../main";
import { observer } from "mobx-react";

function Board() {
  return (
    <div className="board-container">
      <OpponentHand cards={game.player2.hand} />
      <div className="deck-dp-container">
        <Deck cards={game.deck} />
        <DiscardPile cards={game.discardPile} />
      </div>
      <PlayerHand cards={game.player1.hand} />
    </div>
  );
}

export default observer(Board);
