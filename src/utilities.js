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

  getRuns(cards, flattened=false) {
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

  getRankMatches(cards, flattened=false){
    // takes cards and returns array of arrays of rank matches from
    // longest to shortest
    let ofOne = [];
    let ofTwo = [];
    let ofThree = [];
    let ofFour = [];

    let remainingCards=cards;
    while(remainingCards.length>0){
      let sameRank = remainingCards.filter((c)=> c.rank == remainingCards[0].rank)
      let allOthers = remainingCards.filter((c)=> c.rank != remainingCards[0].rank)
      switch(sameRank.length){
        case 1:
          ofOne.push(sameRank)
          break
        case 2:
          ofTwo.push(sameRank)
          break
        case 3:
          ofThree.push(sameRank)
          break
        default:
          ofFour.push(sameRank)
          break
      }
      remainingCards = allOthers
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

  organizeByTrick(cards, flattened=false){
    function hasntBeenUsed(card, usedArray) {
      for (let i = 0; i < usedArray.length; i++) {
        if (usedArray[i].id == card.id) {
          return false;
        }
      }
      return true;
    }

    let organizedByTricks = [];
    let tricksArray = []
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
      return organizedByTricks
    }
    return tricksArray;
  }

}
export const utils = new Utilities();
