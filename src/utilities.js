class Utilities{
  matchesRank(card, cards){
    let mr = cards.filter(
      (c) =>(c.rank == card.rank && c.suit != card.suit)
    )
    return mr
  }

  makesRun(card, cards){
    let mr = cards.filter(
      (c) =>
        c.suit == card.suit &&
        (parseInt(c.rank) == parseInt(card.rank) || parseInt(c.rank) == parseInt(card.rank) - 1 || parseInt(c.rank) == parseInt(card.rank) + 1)
    )
    let res = mr.length == 0 ?  false : mr
    return res
  }

//   checkForTricks(sortedCards){
//     let tricks = []
//     let candidate = []
//     for(let i; i<sortedCards.length; i++){
//       this.makesRun(sortedCards[i], sortedCards) 
//     }

//     //return array of trick cards
//   }
//   checkForAlmostTricks(sortedCards){
//     //return array of trick cards
//   }
}
export const utils = new Utilities