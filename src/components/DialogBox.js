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
    game.dialog_messages.get("initial_message").setQuestionText(dpCard);
    return game.dialog_messages.get("initial_message").question_text;
  }

  render() {
    return (
      <>
        <h2 className="dialog-box-question">{this.getMessage()}</h2>
        {game.dialog_messages
          .get("initial_message")
          .answer_options.map((answer) => (
            <h3 className="dialog-box-answers">{answer}</h3>
          ))}
      </>
    );
  }
}

export default observer(DialogBox);
