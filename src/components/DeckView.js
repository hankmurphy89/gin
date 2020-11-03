import React from "react"
import Card from "./CardView"
import { observer } from "mobx-react"


function Deck( {cards} ) {
    return <ul>{ <Card card={cards.cards[0]} /> }</ul>
} 


export default observer(Deck)