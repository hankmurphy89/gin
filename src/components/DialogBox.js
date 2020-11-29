import React, { Component } from "react";
import { observer } from "mobx-react";
import { game, takeDpCard, advanceTurnStage } from "../main";
import "../utilities";

export class DialogBox extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <>
        <h2 className="dialog-box-question">{this.getMessage()}</h2>
        {game.active_message.answer_options.map((answer, idx) => (
          <h3
            className="dialog-box-answers"
            key={idx}
            onClick={(e) => this.handleAnswerClick(e)}
          >
            {answer}
          </h3>
        ))}
      </>
    );
  }
  getMessage() {
    switch (game.turn_stage) {
      case "p1_initial_choice":
        let dpCard = game.discardPile.cards[game.discardPile.cards.length - 1];
        game.active_message.setQuestionText(dpCard);
        return game.active_message.question_text;
      case "discard":
        return game.active_message.question_text;
      default:
        console.log("stage after discard");
    }
  }
  handleAnswerClick(e) {
    let answer = e.target.innerText;
    switch (game.active_message.id) {
      case 1: // initial message "do you want the {card}?"
        if (answer === "Yes") {
          takeDpCard();
          advanceTurnStage("discard");
        } else {
          console.log(
            "placeholder for pass turn, i.e. player doesn't want card"
          );
        }
        break;
      case 3: // discard "discard the {card}?"
        if (answer === "Yes") {
          console.log("hello");
          let sc = game.whose_turn.selectedCard;
          console.log(sc);
          game.whose_turn.hand.sendCard(sc, game.discardPile);
          // advanceTurnStage("discard");
        } else {
          game.changeActiveMessage(2);
        }
        break;
      default:
        console.log("placeholder for message with id 2");
    }
  }
}

export default observer(DialogBox);
