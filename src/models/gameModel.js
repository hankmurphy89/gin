import { types } from "mobx-state-tree";
import { Card, Hand } from "./cardModels";

export const Player = types
  .model({
    id: types.identifier,
    name: types.string,
    hand: types.maybe(Hand),
    selectedCard: types.maybe(types.reference(Card)),
  })
  .actions((self) => ({
    setSelectedCard(card) {
      self.selectedCard = card;
    },
  }));

//This reference model lets me resolve players for whose_turn by name instead of ID
//benefit is more readable code
export const PlayerByNameReference = types.maybeNull(
  types.reference(Player, {
    get(identifier /*name string*/, parent /*game*/) {
      return parent.players.find((p) => p.name === identifier) || null;
    },
    set(value /* Player */) {
      return value.name;
    },
  })
);

export const RoundScore = types
  .model({
    roundNumber: types.identifierNumber,
    p1Score: types.number,
    p2Score: types.number,
    key: types.string,
  })
  .actions((self) => ({
    updateScores(p1Points, p2Points) {
      self.p1Score = p1Points;
      self.p2Score = p2Points;
      self.key = `${self.roundNumber}-${p1Points}-${p2Points}`;
    },
  }));

export const Game = types
  .model({
    players: types.array(Player),
    discardPile: types.maybe(Hand),
    deck: types.maybe(Hand),
    whose_turn: PlayerByNameReference,
    turn_stage: types.enumeration("Stage", [
      "game_lobby",
      "p1_initial_choice",
      "p1_initial_rebuttal",
      "opponent_initial_choice",
      "discard",
      "opponent_initial_rebuttal",
      "opponent_turn",
      "opponent_takes_dp",
      "opponent_draws_from_deck",
      "opponent_passes",
      "p1_turn",
      "round_over",
    ]),
    roundNumber: types.number,
    score: types.array(RoundScore),
  })
  .actions((self) => ({
    changeTurn() {
      let newPlayer =
        self.whose_turn.name === "player1" ? "player2" : "player1";
      self.whose_turn = newPlayer;
    },
    changeTurnStage(stageName) {
      self.turn_stage = stageName;
    },
    advanceRound() {
      self.roundNumber += 1;
      self.score.push({
        roundNumber: self.roundNumber,
        p1Score: 0,
        p2Score: 0,
        key: `${self.roundNumber}-0-0`,
      });
    },
    updateScoreboard() {
      let p1Points = self.players[0].hand.score();
      let p2Points = self.players[1].hand.score();
      let winner;
      if (p1Points > p2Points) {
        winner = "p2";
      } else if (p1Points < p2Points) {
        winner = "p1";
      } else {
        winner = "tie";
      }
      //deck runs out of cards and current player didn't gin
      if (self.deck.cards.length == 0 && self.whose_turn.hand.score() !== 0) {
        switch (winner) {
          case "p2":
            self.score[self.roundNumber - 1].updateScores(
              0,
              p1Points - p2Points
            );
            break;
          case "p1":
            self.score[self.roundNumber - 1].updateScores(
              p2Points - p1Points,
              0
            );
            break;
          case "tie":
            break;
        }
      }
      //gin
      winner == "p1"
        ? self.score[self.roundNumber - 1].updateScores(25 + p2Points, 0)
        : self.score[self.roundNumber - 1].updateScores(0, 25 + p1Points);

      //11 card
      if (
        self.whose_turn.hand.cards.length == 11 &&
        self.whose_turn.hand.score() == 0
      ) {
        winner == "p1"
          ? self.score[self.roundNumber - 1].updateScores(25 + p2Points * 2, 0)
          : self.score[self.roundNumber - 1].updateScores(0, 25 + p1Points * 2);
      }
    },
    clearCards() {
      self.discardPile.clearAll();
      self.deck.clearAll();
      self.players[0].hand.clearAll();
      self.players[1].hand.clearAll();
    },
    getDeck(deck) {
      self.deck = deck;
    },
  }))
  .views((self) => ({
    get dialogBoxContent() {
      switch (self.turn_stage) {
        case "p1_initial_choice":
          return self.discardPile.cards.length > 0
            ? [
                `Do you want the ${self.discardPile.cards[0].name}`,
                ["Yes", "No"],
              ]
            : ["loading", []];
        case "p1_initial_rebuttal":
          return self.discardPile.cards.length > 0
            ? [
                `Do you want the ${self.discardPile.cards[0].name}`,
                ["Yes", "No"],
              ]
            : ["loading", []];
        case "discard":
          return self.whose_turn.selectedCard
            ? [
                `Discard the ${self.whose_turn.selectedCard.name}?`,
                ["Yes", "No"],
              ]
            : ["Choose card to discard", []];
        case "opponent_initial_rebuttal":
          return ["Opponent turn", []];
        case "opponent_initial_choice":
          return ["Opponent turn", []];
        case "opponent_turn":
          return ["Opponent turn", []];
        case "opponent_takes_dp":
          return ["Opponent takes from discard pile", []];
        case "opponent_draws_from_deck":
          return ["Opponent draws from the deck", []];
        case "opponent_passes":
          return ["Opponent passes", []];
        case "p1_turn":
          return [
            "What would you like to do",
            ["Draw from deck", "Take from discard pile"],
          ];
        case "round_over":
          return [`${self.whose_turn.name} gins!`, []];
        default:
          return ["something went wrong", []];
      }
    },
  }));
