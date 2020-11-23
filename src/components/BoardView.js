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
      <OpponentHand cards={game.players[1].hand.cards} />
      <div className="deck-dp-container">
        <Deck cards={game.deck.cards} />
        <DiscardPile cards={game.discardPile.cards} />
      </div>
      <PlayerHand cards={game.players[0].hand.cards} />
    </div>
  );
}

export default observer(Board);
