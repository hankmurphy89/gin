import { applySnapshot, destroy, types, detach } from "mobx-state-tree";

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
    id: types.identifier,
  })
  .views((self) => ({
    get imagePath() {
      let ip = self.flipped
        ? `/assets/cards/${self.rank}${self.suit}.png`
        : "/assets/cards/red_back.png";
      return ip;
    },
    get name() {
      let rankName;
      let suitName;
      switch (self.rank) {
        case "1":
          rankName = "ace";
          break;
        case "11":
          rankName = "jack";
          break;
        case "12":
          rankName = "queen";
          break;
        case "13":
          rankName = "king";
          break;
        default:
          rankName = self.rank;
      }
      switch (self.suit) {
        case "C":
          suitName = "clubs";
          break;
        case "D":
          suitName = "diamonds";
          break;
        case "S":
          suitName = "spades";
          break;
        default:
          suitName = "hearts";
      }

      return `${rankName} of ${suitName}`;
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
    flipFaceUp() {
      self.flipped = true;
    },
    flipFaceDown() {
      self.flipped = false;
    },
    toggleGrab() {
      self.isGrabbed = !self.isGrabbed;
    },
  }));

export const Hand = types
  .model({
    cards: types.optional(types.array(Card), []),
    name: types.string,
  })
  .actions((self) => ({
    add(card) {
      self.cards.push(card);
    },
    sendCard(card, destinationHand) {
      console.log("sending the", card.name, "to", destinationHand.name)
      let c = detach(card);
      if ((destinationHand.name == "p1_hand")|| (destinationHand.name == "discard_pile")){
        c.flipFaceUp()
      } else {
        c.flipFaceDown()
      }
      destinationHand.add(c)
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
    moveCardRight(card) {
      let c = { ...card };
      let ci = self.cards.indexOf(card);
      destroy(card);
      let ca = [...self.cards];
      ca.slice(ci);
      ca.splice(ci + 1, 0, c);
      applySnapshot(self.cards, ca);
    },
  }));
