import React from "react"
import "../App.css"
import { observer } from "mobx-react"


const Card = ({ card }) => (
    <img src={card.imagePath} className='card'/>
)

export default observer(Card)