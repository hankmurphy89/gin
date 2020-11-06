import { applySnapshot, destroy, types } from "mobx-state-tree";

export const Card = types
  .model({
    rank: types.enumeration("Rank", [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
    ]),
    suit: types.enumeration("Suit", ["H", "C", "D", "S"]),
    flipped: types.boolean,
    isGrabbed: types.boolean,
  })
  .views((self) => ({
    get imagePath() {
      let ip = self.flipped
        ? `/assets/cards/${self.rank}${self.suit}.png`
        : "/assets/cards/red_back.png";
      return ip;
    },
    get name() {
      return `${self.rank}${self.suit}`;
    },
    get className() {
      let cn = self.isGrabbed ? "card-grabbed" : "card";
      return cn;
    },
  }))
  .actions((self) => ({
    flip() {
      self.flipped = !self.flipped;
    },
    toggleGrab() {
      self.isGrabbed = !self.isGrabbed;
      console.log(`the ${self.name} is grabbed? ${self.isGrabbed}`);
    },
  }));

export const Hand = types
  .model({
    cards: types.optional(types.array(Card), []),
  })
  .actions((self) => ({
    add(card) {
      self.cards.push(card);
    },
    sendCard(card, destinationHand) {
      let c = { ...card };
      destroy(card);
      destinationHand.add(c);
    },

    shuffle() {
      let shuffledCards = [...self.cards];
      for (let i = shuffledCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i);
        let temp = shuffledCards[i];
        shuffledCards[i] = shuffledCards[j];
        shuffledCards[j] = temp;
      }
      applySnapshot(self.cards, shuffledCards);
    },

    unGrabAll() {
      self.cards.map((card) => (card.isGrabbed = false));
    },

    moveCardLeft(card) {
      let c = { ...card };
      let ci = self.cards.indexOf(card);
      destroy(card);
      let ca = [...self.cards];
      ca.slice(ci);
      ca.splice(ci - 1, 0, c);
      applySnapshot(self.cards, ca);
    },
  }));
