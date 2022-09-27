let deck = [];
let usedCards = [];

// Classes
class Card {
    constructor(face) {
        this.face = face;
    }
    get value() {
        return this.calcCardValue();
    }
    calcCardValue = function() {
        let rank = this.face.slice(1);
        if (rank == 'A') return 'A';
        else if (!isNaN(rank)) return ~~rank;   //  Double tilde is conversion to Number
        else return 10;
    }
}

let player = {
    hand: [],
    bet: null,
    money: 1000000,
    turn: null
    
}
let dealer = {
    hand: []
}

//  Populate deck with Cards
const suits = ['s', 'h', 'd', 'c']
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A']
function buildDeck() {
    ranks.forEach(function(suit) {
        suits.forEach(function(rank) {
            deck.push(new Card(rank + suit));
        })
    })
    console.log('Deck built.');
}

//  Randomize (shuffle) cards in deck
function shuffle() {
    deck.sort(() => Math.random() - 0.5);
    // renderMessage('Deck shuffled');
    console.log('Deck shuffled.');
}

// DOM Elements
const dealerEl = document.getElementById('dealer');
const playerEl = document.getElementById('player');
const buttonEl = document.getElementById('buttons');
const betAmountEl = document.getElementById('bet-amount');

buttonEl.addEventListener('click', handleClick());
function handleClick(evt) {
    let buttonClicked = evt.target;
    // if (!bet)
    if (player.turn === 1) {
        switch(buttonClicked.id) {
            case 'bet':
                if (player.bet === null && !betAmountEl.value) {
                    player.bet = betAmountEl.value;
                }
                break;
            case 'hit':
                hit(player.hand);
                break;
            case 'stand':
                player.turn = 0;
        }
    }
}
function playerTurnEnd() {
    if (getHandValue(player.hand) < 21) return 0;
    else if (getHandValue(player.hand) === 21) {
        player.turn = 0;
        return 21;
    }
    else {
        player.turn = 0;
        return 'BUST';
    }
}
function dealerTurnEnd() {
    if (getHandValue(dealer.hand) < 17) return 0;
    else return 1;
}
function checkWin() {
    
}
function renderPlayerHand() {
    playerEl.innerHTML = '';
    player.hand.forEach(function(card) {
        let newCard = document.createElement('div');
        newCard.classList.add('card', card.face)
        playerEl.appendChild(newCard);
    });
}
function renderDealerHand() {
    dealerEl.innerHTML = '';
    dealer.hand.forEach(function(card) {
        let newCard = document.createElement('div');
        newCard.classList.add('card', card.face)
        dealerEl.appendChild(newCard);
    });
}
function getHandValue(hand) {
    let total = 0;
    hand.forEach(function(card) {
        if (card.value !== 'A') total += card.value;
    });
    hand.forEach(function(card) {
        if (card.value === 'A') {
            if (total + 11 <= 21) total += 11;
            else total++;
        }
    });
}
function deal() {
    player.hand.push(deck.pop(), deck.pop());
    dealer.hand.push(deck.pop(), deck.pop());
}
function hit(hand) {
    hand.push(deck.pop());
}

function init() {

}