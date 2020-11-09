import React from "react";
import Card from "./CardView";
import { observer } from "mobx-react";

export const DiscardPile = observer(({ cards }) => (
  <ul>{<Card card={cards.cards[cards.cards.length - 1]} />}</ul>
));

export default DiscardPile;
