import { types } from "mobx-state-tree";
import { Hand } from "./cardModels";

export const Player = types.model({
  id: types.identifier,
  name: types.string,
  hand: types.maybe(Hand),
  points: types.integer,
});

export const Message = types
  .model({
    id: types.identifierNumber,
    question_text: types.string,
    answer_options: types.array(types.string),
  })
  .actions((self) => ({
    setQuestionText(card) {
      let qt;
      switch (self.id) {
        case 1:
          qt = `Do you want the ${card.name}?`;
          break;
        case 2:
          qt = `Pick a card to discard.`;
          break;
        default:
          qt = "something went wrong..";
      }
      self.question_text = qt;
    },
  }));

//This reference model lets me resolve players for whose_turn by name instead of ID
//I think this makes the code more readable ;)
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
  }));
