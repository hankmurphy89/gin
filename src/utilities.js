class Utilities {
  matchesRank(card, cards) {
    let mr = cards.filter((c) => c.rank == card.rank && c.suit != card.suit);
    return mr;
  }

  makesRun(card, cards) {
    let mr = cards.filter(
      (c) =>
        c.suit == card.suit &&
        (parseInt(c.rank) == parseInt(card.rank) ||
          parseInt(c.rank) == parseInt(card.rank) - 1 ||
          parseInt(c.rank) == parseInt(card.rank) + 1)
    );
    let res = mr.length == 0 ? false : mr;
    return res;
  }

  organize(cards) {
    let organizedCards = [...cards];
    // sort by suit then rank
    organizedCards.sort((a, b) =>
      a.suit > b.suit
        ? 1
        : a.suit === b.suit
        ? parseInt(a.rank) > parseInt(b.rank)
          ? 1
          : -1
        : -1
    );
    return organizedCards;
  }

  getRuns(cards, flattened = false) {
    // size can
    cards = this.organize(cards);
    let ofOne = [];
    let ofTwo = [];
    let ofThree = [];
    let ofMore = [];
    let run = [];
    for (let i = 0; i < cards.length; i++) {
      run.push({ ...cards[i] });
      //RUNS
      let j = i + 1;
      while (
        j < cards.length &&
        cards[i].suit == cards[j].suit &&
        parseInt(cards[i].rank) == parseInt(cards[j].rank) - 1
      ) {
        run.push({ ...cards[j] });
        i += 1;
        j += 1;
      }
      switch (run.length) {
        case 1:
          ofOne.push(run);
          break;
        case 2:
          ofTwo.push(run);
          break;
        case 3:
          ofThree.push(run);
          break;
        default:
          ofMore.push(run);
          break;
      }
      run = [];
    }
    let allRuns = [];
    allRuns.push(...ofMore, ...ofThree, ...ofTwo, ...ofOne);
    if (flattened) {
      let flattendRuns = [];
      let r;
      for (r of allRuns) {
        flattendRuns.push(...r);
      }
      allRuns = flattendRuns;
    }
    return allRuns;
  }

  getRankMatches(cards, flattened = false) {
    // takes cards and returns array of arrays of rank matches from
    // longest to shortest
    let ofOne = [];
    let ofTwo = [];
    let ofThree = [];
    let ofFour = [];

    let remainingCards = cards;
    while (remainingCards.length > 0) {
      let sameRank = remainingCards.filter(
        (c) => c.rank == remainingCards[0].rank
      );
      let allOthers = remainingCards.filter(
        (c) => c.rank != remainingCards[0].rank
      );
      switch (sameRank.length) {
        case 1:
          ofOne.push(sameRank);
          break;
        case 2:
          ofTwo.push(sameRank);
          break;
        case 3:
          ofThree.push(sameRank);
          break;
        default:
          ofFour.push(sameRank);
          break;
      }
      remainingCards = allOthers;
    }
    let allRuns = [];
    allRuns.push(...ofFour, ...ofThree, ...ofTwo, ...ofOne);
    if (flattened) {
      let flattendRuns = [];
      let r;
      for (r of allRuns) {
        flattendRuns.push(...r);
      }
      allRuns = flattendRuns;
    }
    return allRuns;
  }

  organizeByTrick(cards, flattened = false) {
    function hasntBeenUsed(card, usedArray) {
      //takes a card and array, returns false if the card is in the array
      // and true if it's not in the array. Use to filter out ineligible cards
      // when searching for a trick
      for (let i = 0; i < usedArray.length; i++) {
        if (usedArray[i].id == card.id) {
          return false;
        }
      }
      return true;
    }
    
    function checkExtras(longTrick, alreadyUsed, allCards) {
      let rem = longTrick.length % 3;
      let front = longTrick.slice(0, rem);
      let back = longTrick.slice(rem - 2);
      let backAndFront = [];
      for (let i = 0; i < rem; i++) {
        backAndFront.push(front[i]);
        backAndFront.push(back[back.length - 1 - i]);
      }
      console.log(
        "backAndFront, should be two cards for a \
      trick of four and 4 cards for a trick of five",
        backAndFront
      );
      for (let i = 0; i < backAndFront.length; i++) {
        let ineligibleCards = alreadyUsed;
        let otherCardsInTrick = longTrick.filter(
          (c) => c.id != backAndFront[i].id
        );
        ineligibleCards.push(...otherCardsInTrick);
        let eligibleCards = allCards.filter((c) =>
          hasntBeenUsed(c, ineligibleCards)
        );
        console.log(
          "eligibleCards should be the current \
        extra card, along with the cards not already in a longer trick \
        or in the long trick in question",
          eligibleCards
        );
        // check for tricks in the eligibleCards that must contain
        //current extra card.
        let otherTricksAndRuns = organizeByTrick(eligibleCards);
        let tricksWithExtra = otherTricksAndRuns.filter(
          (a) => a.length >= 3 && a.includes(backAndFront[i])
        );
        console.log(
          "tricksWithExtra should be an array of tricks containing the extra  \
        card",
          tricksWithExtra
        );
        if (tricksWithExtra.length == 0) {
          return false;
        } else {
          return tricksWithExtra[0];
        }
      }
    }

    let organizedByTricks = [];
    let tricksArray = [];
    let remainingCards = cards;
    while (remainingCards.length > 0) {
      let sameRanksArray = this.getRankMatches(remainingCards);
      let runsArray = this.getRuns(remainingCards);
      let orderedCards;
      if (runsArray[0].length >= sameRanksArray[0].length) {
        orderedCards = runsArray[0];
      } else {
        orderedCards = sameRanksArray[0];
      }
      if (orderedCards.length > 3) {
        let extraTrick = checkExtras(orderedCards, organizedByTricks, cards);
        //checkExtras returns false if the extra cards in the long trick
        // can't be used to create another trick, otherwise it returns an array of cards
        // with the new trick in it
        if (extraTrick){
          orderedCards = extraTrick
        }
      }
      organizedByTricks.push(...orderedCards);
      tricksArray.push(orderedCards);
      remainingCards = remainingCards.filter((c) =>
        hasntBeenUsed(c, organizedByTricks)
      );
    }
    if (flattened) {
      // let flattendTricks = [];
      // let r;
      // for (r of flattendTricks) {
      //   flattendTricks.push(...r);
      // }
      // organizedByTricks = flattendTricks;
      return organizedByTricks;
    }
    return tricksArray;
  }
}
export const utils = new Utilities();
