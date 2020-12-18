import { types } from "mobx-state-tree";
import { Card, Hand } from "./cardModels";

export const Player = types
  .model({
    id: types.identifier,
    name: types.string,
    hand: types.maybe(Hand),
    selectedCard: types.maybe(types.reference(Card)),
    points: types.integer,
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

export const Game = types
  .model({
    players: types.array(Player),
    discardPile: types.maybe(Hand),
    deck: types.maybe(Hand),
    whose_turn: PlayerByNameReference,
    turn_stage: types.enumeration("Stage", [
      "game_lobby",
      "p1_initial_choice",
      "discard",
      "opponent_initial_choice",
      "opponent_turn",
      "p1_turn",
    ]),
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
  }))
  .views((self) => ({
    get dialogBoxContent() {
      switch (self.turn_stage) {
        case "p1_initial_choice":
          return [
            `Do you want the ${self.discardPile.cards[0].name}`,
            ["Yes", "No"],
          ];
        case "discard":
          return self.whose_turn.selectedCard
            ? [
                `Discard the ${self.whose_turn.selectedCard.name}?`,
                ["Yes", "No"],
              ]
            : ["Choose card to discard", []];
        case "opponent_initial_choice":
          return ["Opponent turn", []];
        case "opponent_turn":
          return ["Opponent turn", []];
        case "p1_turn":
          return [
            "What would you like to do",
            ["Draw from deck", "Take from discard pile"],
          ];
        default:
          return ["something went wrong", []];
      }
    },
  }));
