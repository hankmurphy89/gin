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
  hasntBeenUsed(card, usedArray) {
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

  includesCard(cards, card){
    for (let i =0; i<cards.length; i++){
      if (cards[i].id == card.id){
        return true
      }
    }
    return false
  }


  checkExtras(longTrick, trickType, alreadyUsed, allCards) {
    let testForTricks = [];
    // set the ineligibleCards array to those that have already been 
    let ineligibleCards;
    // used in another trick


    if (trickType=="runs"){
      //get the extra cards to be tested for tricks
      let rem = longTrick.length % 3;
      let front = longTrick.slice(0, rem);
      let back = longTrick.slice(rem - 2);
      for (let i = 0; i < rem; i++) {
        testForTricks.push(front[i]);
        testForTricks.push(back[back.length - 1 - i]);
      }
      console.log(
        "testForTricks, should be two cards for a \
      trick of four and 4 cards for a trick of five",
        testForTricks
      );
    } else {
      // for four of a kind, test all four cards
      testForTricks = longTrick
    }

    // for each extra card
    for (let i = 0; i < testForTricks.length; i++) {
      // give me the other cards in the trick
      let otherCardsInTrick = longTrick.filter(
        (c) => c.id != testForTricks[i].id
      );
      ineligibleCards = [...alreadyUsed];
      //add them to the ineligible cards array
      ineligibleCards.push(...otherCardsInTrick);

      //create eligibleCards array by removing ineligible cards from
      // all cards
      let eligibleCards = allCards.filter((c) =>
        this.hasntBeenUsed(c, ineligibleCards)
      );
      console.log(
        "eligibleCards should be the current \
      extra card, along with the cards not already in a longer trick \
      or in the long trick in question",
        eligibleCards
      );
      // check for tricks in the eligibleCards that must contain
      //current extra card.
      let otherTricksAndRuns = []
      let runs = this.getRuns(eligibleCards)
      otherTricksAndRuns.push(...runs)
      let mr = this.getRankMatches(eligibleCards)
      otherTricksAndRuns.push(...mr)
      console.log("otherTricksAndRuns should be \
      an array of arrays of runs and rank matches, some overlapping", otherTricksAndRuns)
      let tricksWithExtra = otherTricksAndRuns.filter(
        (a) => a.length >= 3 && this.includesCard(a, testForTricks[i])
      );
      console.log(
        "tricksWithExtra should be an array of tricks containing the extra  \
      card",
        tricksWithExtra
      );
      if (tricksWithExtra.length != 0) {
        return tricksWithExtra[0];
      }
    }
    // if none of the extras create tricks with length >= 3, return false
    return false
  }


  organizeByTrick(cards, flattened = false) {
    cards = [...cards]
    


    let organizedByTricks = [];
    // this is the array returned for the snapshot
    let tricksArray = [];
    // TODO: make thie reference a copy of cards:  [...cards]
    // and get rid of the one above
    let remainingCards = cards;
    while (remainingCards.length > 0) {
      // While there are remaining cards, 
      let sameRanksArray = this.getRankMatches(remainingCards);
      // give me the array of rankMatches
      console.log("1. sameRanksArray should be array of rank matches\n2.are there duplicates across matches?\n", sameRanksArray)
      let runsArray = this.getRuns(remainingCards);
      // give me the array of run matches
      console.log("runsArray should be array of run matches ", runsArray)
      let orderedCards;
      // orderedCards will be the current run or rank match
      // from either the runsArray or sameRanksArray, 
      // depending on the length of the 0th element comparison
      // from the runsArray if same length or the runsArray is 
      // longer
      let trickType;
      if (runsArray[0].length >= sameRanksArray[0].length) {
        // if the 0th element in the runsArray is longer or equal 
        // length to the 0th element in the sameRanksArray
        orderedCards = runsArray[0]
        // set the orderedCards variable to be the 0th runsArray
        // element
        trickType = "runs"
      } else {
        orderedCards = sameRanksArray[0]
        trickType = "runs"

      }
      if (orderedCards.length > 3) {
        // if orderedCards is a long trick, checkExtras
        let extraTrick = this.checkExtras(orderedCards, trickType, organizedByTricks, cards);
        //checkExtras returns false if the extra cards in the long trick
        // can't be used to create another trick, otherwise it returns an array of cards
        // with the new trick in it
        if (extraTrick){
          orderedCards = extraTrick
          // if the extra card could be used to make a trick 
          // with the other eligible cards, assign the extra trick
          // to orderedCards so this extra trick can be added
          // to organizedByTricks, the array whose snapshot
          // will be applied to the state tree. This will make
          // the extra from the long trick ineligible to be considered
          // for another trick
        } 
        else {
          // otherwise, set orderedCards to equal only the cards in 
          // itself that aren't already in organizedByTricks
          // why is this filter needed? Shouldn't orderedCards already 
          // avoid cards already used 
          orderedCards = orderedCards.filter((c)=> this.hasntBeenUsed(c, organizedByTricks))
        }
      }
      console.log("orderedCards should be the long trick if the extras couldnt \
      make another trick; should be extra and others if it could make a trick", orderedCards)
      organizedByTricks.push(...orderedCards);
      // add the elements from orderedCards to organizedByTricks
      tricksArray.push(orderedCards);
      // add the orderedCards array to tricksArray
      remainingCards = remainingCards.filter((c) =>
        this.hasntBeenUsed(c, organizedByTricks)
      );
      // set remainingCards equal to the cards in itself
      // that haven't been added to organizedByTricks
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
