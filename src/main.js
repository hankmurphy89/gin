import { Hand } from "./models/cardModels";
import { Player, Game, Message } from "./models/gameModel";

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
      };
      cardArray.push(c);
    }
  }
  const d = Hand.create({
    cards: cardArray,
  });

  d.shuffle();

  return d;
}

function getMessages() {
  let ms = {
    initial_message: {
      question_text: "Do you want the",
      id: 1,
      answer_options: ["Yes", "No"],
    },
  };
  return ms;
}

export const game = Game.create({
  players: [
    {
      id: "1",
      name: "player1",
      hand: Hand.create({
        cards: [],
      }),
      points: 0,
      // isMyTurn: true,
    },
    {
      id: "2",
      name: "player2",
      hand: Hand.create({
        cards: [],
      }),
      points: 0,
      // isMyTurn: false,
    },
  ],
  discardPile: Hand.create({
    cards: [],
  }),
  deck: getGameDeck(),
  dialog_messages: getMessages(),
  whose_turn: "player1",
});

function dealCards() {
  for (let i = 0; i < 10; i++) {
    game.deck.sendCard(game.deck.cards[i], game.players[0].hand);
    game.deck.sendCard(game.deck.cards[i + 1], game.players[1].hand);
  }
}

function flipP1Cards() {
  game.players[0].hand.cards.map((card) => card.flip());
}

function flipTopCard() {
  let topCard = game.deck.cards[0];
  game.deck.sendCard(topCard, game.discardPile);
  game.discardPile.cards[0].flip();
}

function startGame() {
  dealCards();
  flipP1Cards();
  flipTopCard();
}

// function takeDpCard() {}

startGame();

window.game = game;
