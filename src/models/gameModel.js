import { types } from "mobx-state-tree";
import { Hand } from "./cardModels";

export const Player = types.model({
  name: types.string,
  hand: types.maybe(Hand),
  points: types.integer,
  isMyTurn: types.boolean,
});

export const Message = types
  .model({
    question_text: types.string,
    id: types.identifierNumber,
    answer_options: types.array(types.string),
  })
  .views((self) => ({}))
  .actions((self) => ({
    setQuestionText(card) {
      let qt;
      switch (self.id) {
        case 1:
          qt = `Do you want the ${card.name}?`;
          break;
        default:
          qt = "something went wrong..";
      }
      self.question_text = qt;
    },
  }));

export const Game = types.model({
  player1: types.maybe(Player),
  player2: types.maybe(Player),
  discardPile: types.maybe(Hand),
  deck: types.maybe(Hand),
  dialog_messages: types.map(Message),
  // turnStage: types.map(Message),
});
