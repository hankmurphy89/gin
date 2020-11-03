import React from "react"
import Card from "./CardView"
import { observer } from "mobx-react"

const OpponentHand = ({ cards }) => (
    <ul>{cards.cards.map((card, idx) => <Card key={idx} card={card} />)}</ul>
)


export default observer(OpponentHand)