import { applySnapshot, destroy, types, detach } from "mobx-state-tree";
import { utils } from "../utilities";

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
  .views((self) => ({
    score() {
      let points = 0;
      let organizedCards = utils.organizeByTrick(self.cards);
      console.log("organizedCards:", organizedCards);
      let nonTricks = organizedCards.filter((a) => a.length <= 2);
      for (let a of nonTricks) {
        console.log("array in nonTricks:", a);
        for (let c of a) {
          let p = c.rank >= 10 ? 10 : parseInt(c.rank);
          points += p;
        }
      }
      console.log("nonTricks:", nonTricks);
      return points;
    },
  }))
  .actions((self) => ({
    add(card) {
      self.cards.push(card);
    },
    sendCard(card, destinationHand) {
      console.log("sending the", card.name, "to", destinationHand.name);
      let c = detach(card);
      if (
        destinationHand.name == "p1_hand" ||
        destinationHand.name == "discard_pile" ||
        destinationHand.name == "opponent_hand"
      ) {
        c.flipFaceUp();
      } else {
        c.flipFaceDown();
      }
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
    moveCardRight(card) {
      let c = { ...card };
      let ci = self.cards.indexOf(card);
      destroy(card);
      let ca = [...self.cards];
      ca.slice(ci);
      ca.splice(ci + 1, 0, c);
      applySnapshot(self.cards, ca);
    },

    organize() {
      const organizedCards = utils.organize(self.cards);
      applySnapshot(self.cards, organizedCards);
    },
    organizeByRun() {
      // let newCards = [];
      let runsArray = utils.getRuns(self.cards, true);
      console.log(runsArray);
      console.log(utils.getRuns(self.cards));
      applySnapshot(self.cards, runsArray);
    },

    organizeByRank() {
      let sameRanksArray = utils.getRankMatches(self.cards, true);
      applySnapshot(self.cards, sameRanksArray);
    },

    organizeByTrick() {
      // function hasntBeenUsed(card, usedArray) {
      //   for (let i = 0; i < usedArray.length; i++) {
      //     if (usedArray[i].id == card.id) {
      //       return false;
      //     }
      //   }
      //   return true;
      // }

      // let organizedByTricks = [];
      // let remainingCards = self.cards;
      // while (remainingCards.length > 0) {
      //   let sameRanksArray = utils.getRankMatches(remainingCards);
      //   let runsArray = utils.getRuns(remainingCards);
      //   let orderedCards;
      //   if (runsArray[0].length >= sameRanksArray[0].length) {
      //     orderedCards = runsArray[0];
      //   } else {
      //     orderedCards = sameRanksArray[0];
      //   }
      //   organizedByTricks.push(...orderedCards);
      //   console.log("should be highest trick", orderedCards);
      //   remainingCards = remainingCards.filter((c) =>
      //     hasntBeenUsed(c, organizedByTricks)
      //   );
      // }
      const organizedTricks = utils.organizeByTrick(self.cards, true);
      applySnapshot(self.cards, organizedTricks);
    },

    // superOrganize() {
    //   let newCards = [];
    //   let tricks = [];
    //   let almostTricks = [];
    //   let nothin = [];
    //   let run = [];
    //   for (let i = 0; i < self.cards.length; i++) {
    //     run.push({ ...self.cards[i] });
    //     //RUNS
    //     let j = i + 1;
    //     while (
    //       j < self.cards.length &&
    //       self.cards[i].suit == self.cards[j].suit &&
    //       parseInt(self.cards[i].rank) == parseInt(self.cards[j].rank) - 1
    //     ) {
    //       run.push({ ...self.cards[j] });
    //       i += 1;
    //       j += 1;
    //     }
    //     switch (run.length) {
    //       case 1:
    //         nothin.push(...run);
    //         break;
    //       case 2:
    //         almostTricks.push(...run);
    //         break;
    //       default:
    //         tricks.push(...run);
    //         break;
    //     }
    //     run = [];
    //   }
    //   newCards.push(...tricks, ...almostTricks, ...nothin);
    //   applySnapshot(self.cards, newCards);
    // },

    // organize(){
    //   let disorganizedCards = [...self.cards]
    //   let tricks = []
    //   let almostTricks = []
    //   let loneWolves = []
    //   for (let c of disorganizedCards){
    //     let othersInRun = utils.makesRun(c, disorganizedCards)
    //     console.log("others in run:", othersInRun)
    //     console.log("c:", c)
    //     let othersMatchingRank = utils.matchesRank(c, disorganizedCards)
    //     console.log("others matching rank:", othersMatchingRank)
    //     if (othersInRun.length >= 2){
    //       tricks.push({...c})
    //       tricks.concat(othersInRun)
    //     } else if(othersInRun.length == 1){
    //       almostTricks.push({...c})
    //       almostTricks.concat(othersInRun)
    //     } else if(othersMatchingRank.length >= 2){
    //       tricks.push({...c})
    //       tricks.concat(othersMatchingRank)
    //     } else if(othersMatchingRank.length == 1){
    //       almostTricks.push({...c})
    //       almostTricks.concat(othersMatchingRank)
    //     } else {
    //       loneWolves.push({...c})
    //     }
    //     }
    //   console.log("tricks:", tricks)
    //   console.log("Almosttricks:", almostTricks)
    //   console.log("loneWolves:", loneWolves)
    //   let organizedCards = tricks.concat(almostTricks, loneWolves)
    //   console.log(organizedCards)
    //   applySnapshot(self.cards, organizedCards)
    // }
  }));
