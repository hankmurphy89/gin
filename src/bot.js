import {
  game,
  takeDpCard,
  discard,
  drawFromDeck,
  advanceTurnStage,
} from "./main";

export class Bot {
  constructor(difficulty) {
    this.difficulty = difficulty;
  }

  //TODO: when do I need to bind this?
  chooseRandomCard() {
    let botCards = game.whose_turn.hand.cards;
    let rc = botCards[Math.random() * Math.floor(botCards.length)];
    console.log("this random card is:", rc.name);
    return rc;
  }

  discard() {
    switch (this.difficulty) {
      case "easy":
        discard(this.chooseRandomCard());
    }
  }

  dpHelps() {
    let dp = game.discardPile.cards[game.discardPile.cards.length - 1];
    let currentPlayerCards = game.whose_turn.hand.cards;
    let matchingRankCount = currentPlayerCards.filter(
      (card) => card.rank == dp.rank
    ).length;
    let matchingRunCount = currentPlayerCards.filter(
      (card) =>
        card.suit == dp.suit &&
        (card.rank == dp.rank - 1 || card.rank == dp.rank + 1)
    ).length;
    return matchingRunCount > 0 || matchingRankCount > 0 ? true : false;
  }

  findBestOption() {
    switch (game.turn_stage) {
      case "opponent_initial_choice":
        return this.dpHelps() ? "opponent_takes_dp" : "opponent_passes";
      case "opponent_turn":
        return this.dpHelps()
          ? "opponent_takes_dp"
          : "opponent_draws_from_deck";
      default:
        return "some other thing";
    }
  }

  decision() {
    let bo = this.findBestOption();
    advanceTurnStage(bo);
    setTimeout(() => {
      advanceTurnStage("p1_turn");
    }, 2000);
  }
}
