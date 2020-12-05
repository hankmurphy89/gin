import React, { Component } from "react";
import Card from "./CardView";
import { observer } from "mobx-react";

export class DiscardPile extends Component {
  constructor() {
    super();
  }

  render() {
    const { cards } = this.props;
    return cards.length === 0 ? null : (
      <ul>{<Card card={cards[cards.length - 1]} />}</ul>
    );
  }
}
export default observer(DiscardPile);
