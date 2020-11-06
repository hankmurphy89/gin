import React from "react";
import { observer } from "mobx-react";
import { game } from "../main";
import { Card } from "./CardView";

const PlayerHand = ({ cards }) => (
  <ul>
    {cards.cards.map((card, idx) => (
      <Card key={idx} card={card} />
    ))}
  </ul>
);

export default observer(PlayerHand);
