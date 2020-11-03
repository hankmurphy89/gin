import React from "react"
import "../app.css"
import { observer } from "mobx-react"


const Card = ({ card }) => (
    <img src={card.imagePath} className='card'/>
)

export default observer(Card)