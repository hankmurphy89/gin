import React, { Component } from "react";
import "../App.css";
import { observer } from "mobx-react";
import { getParent } from "mobx-state-tree";
import { game } from "../main";

export class Card extends Component {
  constructor() {
    super();
  }
  rearrangeCard(e, card) {
    let currentPlayerHand = getParent(card, 2);
    let ci = currentPlayerHand.cards.indexOf(card);
    let p1cards = document.getElementById("player-hand");

    //if card is grabbed and user keys left arrow, move card left and move focus with it
    if (card.isGrabbed && e.key === "ArrowLeft" && ci > 0) {
      currentPlayerHand.moveCardLeft(card);
      p1cards.childNodes[ci - 1].focus();

      //if card is grabbed and user keys right arrow, move card right and move focus with it
    } else if (
      card.isGrabbed &&
      e.key === "ArrowRight" &&
      ci < currentPlayerHand.cards.length - 1
    ) {
      currentPlayerHand.moveCardRight(card);
      p1cards.childNodes[ci + 1].focus();
    } else {
      // the following block is nested because if either of the above conditions are satisfied, the
      // references to card will no longer be pointing to the card intended for the actions below
      if (e.key === "ArrowUp") {
        getParent(card, 2).unGrabAll();
        card.toggleGrab();
      } else if (card.isGrabbed && e.key === "ArrowDown") {
        card.toggleGrab();
      } else if (!card.isGrabbed && e.key === "ArrowLeft" && ci > 0) {
        p1cards.childNodes[ci - 1].focus();
      } else if (
        !card.isGrabbed &&
        e.key === "ArrowRight" &&
        ci < currentPlayerHand.cards.length - 1
      ) {
        p1cards.childNodes[ci + 1].focus();
      }
    }
  }

  render() {
    const { card } = this.props;
    // console.log(getParent(game.discardPile.cards[0], 3));
    return getParent(card, 3).name === game.whose_turn.name ? (
      <img
        src={card.imagePath}
        onKeyDown={(e) => this.rearrangeCard(e, card)} //To do: refactor rearrangeCards to be more general e.g. "handleOnKeyDown"
        tabIndex="0"
        className={card.className}
        alt={card.name}
      />
    ) : (
      <img src={card.imagePath} className="card" alt="facedown card" />
    );
  }
}

export default observer(Card);
