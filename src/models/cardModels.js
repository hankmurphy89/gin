import { types } from "mobx-state-tree"



export const Card = types.model({
    rank: types.enumeration("Rank", ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"]),
    suit: types.enumeration("Suit", ["H", "C", "D", "S"]),
    flipped: types.boolean,
})
    .views(self => ({
        get imagePath() {
            let ip = self.flipped ? `/assets/cards/${self.rank}${self.suit}.png` : '/assets/cards/red_back.png'
            return ip
        },
        get name() {
            return `${self.rank} of ${self.suit}`
        }
    }))
    .actions(self =>({
        flip() {
            self.flipped = !self.flipped
        },
    }))

export const Hand = types.model({
    cards: types.optional(types.array(Card), [])
})
    .actions(self => ({
        add(card) {
            self.cards.push(card)
        },
        sendCard(card, destinationHand) {
            let c = self.cards.pop(card);
            destinationHand.cards.add(c)
        },
        //This doesn't work
        shuffle() {
            let shuffledCards = self.cards;
            for (let i = shuffledCards.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * i);
                let temp = shuffledCards[i];
                console.log("temp inside shuffle", temp)
                shuffledCards[i] = shuffledCards[j];
                shuffledCards[j] = temp;
            }
            console.log('still in shuffle', shuffledCards)
            self.cards = shuffledCards;
        }
    }))
