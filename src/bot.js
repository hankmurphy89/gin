import {game, takeDpCard, discard, drawFromDeck, advanceTurnStage} from "./main"

export class Bot {
    contructor(difficulty){
        this.difficulty = difficulty
    }


    //TODO: when do I need to bind this?
    chooseRandomCard(){
        let botCards = game.whose_turn.hand.cards
        let rc = botCards[(Math.random() * Math.floor(botCards.length))]
        console.log("this random card is:", rc.name)
        return rc

    }

    findBestOption(){
        console.log("bot finding best option")
        console.log("game turnstage is: ", game.turn_stage )
        switch(game.turn_stage){
            case "opponent_initial_choice":
                console.log("opponent initial choice!")
                return "take from dp"
            case "opponent_turn":
                return "draw from deck"
            default:
                return "some other thing"
        }
    }

    decision(){
        let bo = this.findBestOption();
        if (bo == "take from dp"){
            console.log("bot takes from dp")
            takeDpCard()}
        else if (bo == "pass"){
            advanceTurnStage("p1_turn")
        } else if (bo == "draw from deck") {
            drawFromDeck()
        }
        discard(this.chooseRandomCard())
        setTimeout(advanceTurnStage("p1_turn"), 4000)
        
        }
        
}