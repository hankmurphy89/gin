import React, { Component } from "react";
import { observer } from "mobx-react";
import { game } from "../main";
import "../utilities";
import { getDpCard } from "../utilities";

export class DialogBox extends Component {
  constructor() {
    super();
  }

  getMessage() {
    let dpCard = game.discardPile.cards[game.discardPile.cards.length - 1];
    try {
      game.active_message.setQuestionText(dpCard);
    } catch (err) {
      console.log(err);
    }
    return game.active_message.question_text;
  }

  render() {
    return (
      <>
        <h2 className="dialog-box-question">{this.getMessage()}</h2>
        {game.active_message.answer_options.map((answer, idx) => (
          <h3 className="dialog-box-answers" key={idx}>
            {answer}
          </h3>
        ))}
      </>
    );
  }
}

export default observer(DialogBox);
