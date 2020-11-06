import React from "react";
import Card from "./CardView";
import { observer } from "mobx-react";

export const DiscardPile = observer(({ cards }) => (
  <ul>
    {cards.cards.map((card, idx) => (
      <Card key={idx} card={card} />
    ))}
  </ul>
));

export default DiscardPile;
