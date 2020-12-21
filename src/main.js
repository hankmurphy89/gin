import { Hand } from "./models/cardModels";
import { Player, Game } from "./models/gameModel";
import { Bot } from "./bot";

const bot = new Bot("easy");

function getGameDeck() {
  let cardArray = [];

  let ranks = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
  ];
  let suits = ["H", "C", "D", "S"];

  for (let ri = 0; ri < ranks.length; ri++) {
    for (let si = 0; si < suits.length; si++ in suits) {
      let c = {
        rank: ranks[ri],
        suit: suits[si],
        flipped: false,
        isGrabbed: false,
        id: `${ranks[ri]}${suits[si]}`,
      };
      cardArray.push(c);
    }
  }
  const d = Hand.create({
    cards: cardArray,
    name: "deck",
  });

  d.shuffle();

  return d;
}


export const game = Game.create({
  players: [
    {
      id: "1",
      name: "player1",
      hand: Hand.create({
        cards: [],
        name: "p1_hand",
      }),
      points: 0,
    },
    {
      id: "2",
      name: "player2",
      hand: Hand.create({
        cards: [],
        name: "opponent_hand",
      }),
      points: 0,
    },
  ],
  discardPile: Hand.create({
    cards: [],
    name: "discard_pile",
  }),
  deck: getGameDeck(),
  whose_turn: "player1",
  turn_stage: "game_lobby",
});

function dealCards() {
  for (let i = 0; i < 10; i++) {
    game.deck.sendCard(game.deck.cards[i], game.players[0].hand);
    game.deck.sendCard(game.deck.cards[i + 1], game.players[1].hand);
  }
}

// export function flipP1Cards() {
//   game.players[0].hand.cards.map((card) => (card.flipped ? card : card.flip()));
// }

export function flipTopCard() {
  let topCard = game.deck.cards[0];
  game.deck.sendCard(topCard, game.discardPile);
  // game.discardPile.cards.map((card) => (card.flipped ? card : card.flip()));
}

export function takeDpCard() {
  let c = game.discardPile.cards[game.discardPile.cards.length-1];
  game.discardPile.sendCard(c, game.whose_turn.hand);
  game.whose_turn.setSelectedCard(undefined)
}

export function drawFromDeck() {
  let c = game.deck.cards[0];
  game.deck.sendCard(c, game.whose_turn.hand);
  game.whose_turn.setSelectedCard(undefined)
}

export function discard(card) {
  game.whose_turn.hand.sendCard(card, game.discardPile);
  game.whose_turn.setSelectedCard(undefined)
}

//get the current player's cards
//add an onfocus so that when card is focused, display
//that card's name in the dialog box
// if answer option "yes" is  selected, move the card in
// focus to the discard pile

export function advanceTurnStage(stage) {
  game.changeTurnStage(stage);
  switch (game.turn_stage) {
    case "game_lobby":
      break;
    case "p1_initial_choice": //game start
      dealCards();
      flipTopCard();
      break;
    case "discard":
      break;
    case "opponent_initial_choice":
      game.changeTurn();
      setTimeout(()=>{bot.decision()}, 2000);
      break;
    case "opponent_turn":
      game.changeTurn();
      setTimeout(()=>{bot.decision()}, 2000);
      break;
    case "opponent_passes":
      break;
    case "opponent_takes_dp":
      takeDpCard();
      setTimeout(()=>{bot.discard()}, 2000);
      break;
    case "opponent_draws_from_deck":
      drawFromDeck();
      setTimeout(()=>{bot.discard()}, 2000);
      break;
    case "p1_turn":
      game.changeTurn();
      break;
  }
}

advanceTurnStage("p1_initial_choice"); //start game

window.game = game;
