import { types } from "mobx-state-tree"
import { Deck, DiscardPile } from './cardModels'


export const Player = types.model({
    name: types.string,
    cards: types.optional(Hand),
    points: types.integer,
})


export const Game = types.model({
    player1: types(Player),
    player2: types(Player),
    discardPile: types(Hand),
    deck: types(Hand),
})

