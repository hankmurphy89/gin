import { game } from "./main";

export function getDpCard() {
  console.log("getDpCard ran");
  return game.discardPile.cards[game.discardPile.cards - 1];
}
