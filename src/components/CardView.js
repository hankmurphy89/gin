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
    // to do: make it so onlyone card can be selected at a time
    if (card.isGrabbed && e.key == "ArrowLeft") {
      let currentPlayerHand = getParent(card, 2);
      currentPlayerHand.moveCardLeft(card);
      // let ph = document.getElementById("player-hand");
      // console.log(ph);
    } else {
      if (e.key == "ArrowUp") {
        getParent(card, 2).unGrabAll();
        card.toggleGrab();
      }
      if (card.isGrabbed && e.key == "ArrowDown") {
        card.toggleGrab();
      }
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
