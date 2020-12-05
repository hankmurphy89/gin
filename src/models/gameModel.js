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

export const Message = types
  .model({
    id: types.identifierNumber,
    prompt_text: types.string,
    answer_options: types.array(types.string),
  })
  .actions((self) => ({
    setPromptText(card) {
      //
      let qt;
      switch (self.id) {
        case 1:
          qt = `Do you want the ${card.name}?`;
          break;
        case 2:
          qt = `Pick a card to discard.`;
          break;
        case 3:
          qt = `Discard the ${card.name}?`;
          break;
        default:
          qt = "something went wrong..";
      }
      self.prompt_text = qt;
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
    dialog_messages: types.array(Message),
    active_message: types.reference(Message),
    whose_turn: PlayerByNameReference,
    turn_stage: types.enumeration("Stage", [
      "game_start",
      "p1_initial_choice",
      "discard",
      "p2_initial_choice",
    ]),
  })
  .actions((self) => ({
    changeTurn() {
      let newPlayer =
        self.whose_turn.name === "player1" ? "player2" : "player1";
      self.whose_turn = newPlayer;
    },
    changeActiveMessage(id) {
      self.active_message = id;
    },
    changeTurnStage(stageName) {
      self.turn_stage = stageName;
    },
  }));
