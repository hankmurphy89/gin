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
  let ms = [
    {
      id: 1,
      question_text: "Do you want the {card}?",
      answer_options: ["Yes", "No"],
    },
    {
      id: 2,
      question_text: "Pick a card to discard",
      answer_options: [],
    },
    {
      id: 3,
      question_text: "Discard the {card}?",
      answer_options: ["Yes", "No"],
    },
  ];
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
    },
    {
      id: "2",
      name: "player2",
      hand: Hand.create({
        cards: [],
      }),
      points: 0,
    },
  ],
  discardPile: Hand.create({
    cards: [],
  }),
  deck: getGameDeck(),
  dialog_messages: getMessages(),
  active_message: 1,
  whose_turn: "player1",
});

function dealCards() {
  for (let i = 0; i < 10; i++) {
    game.deck.sendCard(game.deck.cards[i], game.players[0].hand);
    game.deck.sendCard(game.deck.cards[i + 1], game.players[1].hand);
  }
}

export function flipP1Cards() {
  game.players[0].hand.cards.map((card) => (card.flipped ? card : card.flip()));
}

export function flipTopCard() {
  let topCard = game.deck.cards[0];
  game.deck.sendCard(topCard, game.discardPile);
  game.discardPile.cards.map((card) => (card.flipped ? card : card.flip()));
}

export function takeDpCard() {
  let c = game.discardPile.cards[0];
  console.log("test", c);
  game.discardPile.sendCard(c, game.whose_turn.hand);
  flipP1Cards();
  // flipTopCard();
}

function startGame() {
  dealCards();
  flipP1Cards();
  flipTopCard();
}

startGame();

window.game = game;
