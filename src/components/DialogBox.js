import React, { Component } from "react";
import { observer } from "mobx-react";
import { game, takeDpCard, advanceTurnStage, discard, drawFromDeck } from "../main";
import { utils } from "../utilities";

export class DialogBox extends Component {
  constructor() {
    super();
    this.handleAnswerClick = this.handleAnswerClick.bind(this);
  }

  render() {
    return (
      <>
        <h2 className="dialog-box-question">{game.dialogBoxContent[0]}</h2>
        {game.dialogBoxContent[1].map((answer, idx) => (
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

  handleAnswerClick(e) {
    let answer = e.target.innerText;
    switch (game.turn_stage) {
      case "p1_initial_choice": // initial message "do you want the {card}?"
        if (answer === "Yes") {
          takeDpCard();
          if(utils.roundOver(game)){
            return advanceTurnStage("round_over")
          } else {
            return advanceTurnStage("discard");
          }
        } else {
          return advanceTurnStage("opponent_initial_rebuttal");
        }
      case "p1_initial_rebuttal": // initial message "do you want the {card}?"
        if (answer === "Yes") {
          takeDpCard();
          if(utils.roundOver(game)){
            return advanceTurnStage("round_over")
          } else {
            return advanceTurnStage("discard");
          }
        } else {
          return advanceTurnStage("opponent_initial_rebuttal");
        }
      case "discard": // discard "discard the {card}?"
        if (answer === "Yes") {
          let sc = game.whose_turn.selectedCard;
          discard(sc);
          // check for gin
          if(utils.roundOver(game)){
            return advanceTurnStage("round_over")
          } else {
            return advanceTurnStage("opponent_turn");
          }
        }
        break;
      case "p1_turn": // discard "discard the {card}?"
        if (answer === "Draw from deck") {
          drawFromDeck()
        } else {
          takeDpCard()
        }
        if(utils.roundOver(game)){
          return advanceTurnStage("round_over")
        } else {
          return advanceTurnStage("discard");
        }

      default:
    }
  }
}

export default observer(DialogBox);
