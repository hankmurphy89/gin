import React from "react";
import Card from "./CardView";
import { observer } from "mobx-react";

function Deck({ cards }) {
  return cards.length > 0 ? (<ul>{ <Card card={cards[0]} />}</ul>) : (<ul/>);
}

export default observer(Deck);
