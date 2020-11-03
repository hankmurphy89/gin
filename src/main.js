import { Hand } from "./models/cardModels"

function getGameDeck() {
    let cardArray = []

    let ranks = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"]
    let suits = ["H", "C", "D", "S"]

    for (let ri = 0; ri < ranks.length; ri++) {
        for (let si = 0; si < suits.length; si++ in suits) {
            let c = {
                rank: ranks[ri],
                suit: suits[si],
                flipped: true
            }
            cardArray.push(c)
        }
    }

    return cardArray
}


export const gameDeck = Hand.create({
    cards: getGameDeck()
})

window.gameDeck = gameDeck
