import { types } from "mobx-state-tree";
import { Hand } from "./cardModels";

export const Player = types.model({
  name: types.string,
  hand: types.maybe(Hand),
  points: types.integer,
  isMyTurn: types.boolean,
});

export const Game = types.model({
  player1: types.maybe(Player),
  player2: types.maybe(Player),
  discardPile: types.maybe(Hand),
  deck: types.maybe(Hand),
});
