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
          console.log("should be array of one object", ofOne)
          break
        case 2:
          ofTwo.push(sameRank)
          console.log("should be array of two objects", ofTwo)
          break
        case 3:
          ofThree.push(sameRank)
          console.log("should be array of three object", ofThree)
          break
        default:
          ofFour.push(sameRank)
          console.log("should be array of four objects", ofFour)
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

}
export const utils = new Utilities();
