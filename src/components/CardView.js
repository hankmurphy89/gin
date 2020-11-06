import React, { useState, Component } from "react";
import "../App.css";
import { observer } from "mobx-react";
import { getParent } from "mobx-state-tree";

// export class Card extends Component {
//   constructor() {
//     super();
//     this.enableArrangement = this.enableArrangement.bind(this);
//   }

//   enableArrangement(e) {
//     return console.log("does this even work?");
//     // if (e.key == "ArrowUp") {
//     //   console.log("arrow up works");
//     //   e.target.style.paddingBottom = 10;
//     // }
//   }

//   render() {
//     const { card } = this.props;
//     return getParent(card, 3).isMyTurn ? (
//       <img
//         src={card.imagePath}
//         className="card"
//         id={card.name}
//         onKeyPressCapture={(e) => this.enableArrangement(e)}
//       />
//     ) : null;
//   }
// }

export class Card extends Component {
  constructor() {
    super();
  }
  rearrangeCard(e, card) {
    console.log("rearrangeCard was fired");
    // to do: make it so onlyone card can be selected at a time
    if (card.isGrabbed && e.key == "ArrowLeft") {
      console.log("move me left");
      let currentPlayerHand = getParent(card, 2);
      currentPlayerHand.moveCardLeft(card);
      console.log(currentPlayerHand);
    }
    if (e.key == "ArrowUp" || e.key == "ArrowDown") {
      console.log("arrow up was triggered");
      card.toggleGrab();
    }
  }

  render() {
    const { card } = this.props;
    return getParent(card, 3).isMyTurn ? (
      <img
        src={card.imagePath}
        onKeyDown={(e) => this.rearrangeCard(e, card)}
        tabIndex="0"
        className={card.className}
      />
    ) : (
      <img src={card.imagePath} className="card" />
    );
  }
}

export default observer(Card);
