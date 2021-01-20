import { game, discard, advanceTurnStage } from "./main";
import { utils } from "./utilities";

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
    game.whose_turn.hand.organizeByTrick();
    switch (this.difficulty) {
      case "easy":
        const shortestRunHighestRank =
          game.whose_turn.hand.cards[game.whose_turn.hand.cards.length - 1];
        discard(shortestRunHighestRank);
        // check for gin
        if (utils.checkForGin(game.whose_turn.hand)) {
          return advanceTurnStage("round_over");
        } else {
          return setTimeout(() => {
            advanceTurnStage("p1_turn");
          }, 2000);
        }
    }
  }

  dpHelps() {
    //TO DO: dp helps only if it creates a run bigger than the smallest run
    // if the new run is the same size as the bot's smallest run (that doesn't make a trick, so either of length 1 or 2)
    // only take it if it would reduce the points in the player's hand
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
      case "opponent_initial_rebuttal":
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
  }
}
