import React, { Component } from "react";
import { observer } from "mobx-react";
import { game, flipTopCard, flipP1Cards, takeDpCard } from "../main";
import "../utilities";
import { getDpCard } from "../utilities";

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
    try {
      let dpCard = game.discardPile.cards[game.discardPile.cards.length - 1];
      game.active_message.setQuestionText(dpCard);
      return game.active_message.question_text;
    } catch (err) {
      console.log(err);
      return "no card to be found";
    }
  }
  handleAnswerClick(e) {
    let answer = e.target.innerText;
    switch (game.active_message.id) {
      case 1: // initial message "do you want the {card}?"
        if (answer === "Yes") {
          takeDpCard();
        } else {
          console.log(
            "placeholder for pass turn, i.e. player doesn't want card"
          );
        }
        break;
      default:
        console.log("placeholder for message with id 2");
    }
  }
}

export default observer(DialogBox);
