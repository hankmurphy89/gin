import { Hand } from "./models/cardModels";
import { Player, Game } from "./models/gameModel";

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

export const game = Game.create({
  player1: Player.create({
    name: "player1",
    hand: Hand.create({
      cards: [],
    }),
    points: 0,
  }),
  player2: Player.create({
    name: "player2",
    hand: Hand.create({
      cards: [],
    }),
    points: 0,
  }),
  discardPile: Hand.create({
    cards: [],
  }),
  deck: getGameDeck(),
});

function dealCards() {
  for (let i = 0; i < 10; i++) {
    game.deck.sendCard(game.deck.cards[i], game.player1.hand);
    game.deck.sendCard(game.deck.cards[i + 1], game.player2.hand);
  }
}

function flipP1Cards() {
  game.player1.hand.cards.map((card) => card.flip());
}

function flipTopCard() {
  let topCard = game.deck.cards[0];
  console.log(topCard);
  game.deck.sendCard(topCard, game.discardPile);
  game.discardPile.cards[0].flip();
}

function startGame() {
  dealCards();
  flipP1Cards();
  flipTopCard();
}

startGame();

window.game = game;
