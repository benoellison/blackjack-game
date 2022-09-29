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
    turn: null,
    win: null

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
}

//  Randomize (shuffle) cards in deck
function shuffle() {
    deck.sort(() => Math.random() - 0.5);
    console.log('Deck shuffled.');
}
function renderMessage() {
    if (getHandValue(player.hand) > 21) messageEl.innerText = 'PLAYER BUSTS'
    if (getHandValue(dealer.hand) > 21) messageEl.innerText = 'DEALER BUSTS'
}

// DOM Elements
const dealerEl = document.getElementById('dealer');
const playerEl = document.getElementById('player');
const buttonEl = document.getElementById('buttons');
const betAmountEl = document.getElementById('bet-amount');
const messageEl = document.getElementById('message');

buttonEl.addEventListener('click', handleClick);
function handleClick(evt) {
    let buttonClicked = evt.target;
    // if (!bet)
    // if (player.turn === 1) {
        switch(buttonClicked.id) {
            case 'bet':
                if (player.bet === null) {
                    player.bet = ~~betAmountEl.value;
                    player.money -= ~~betAmountEl.value;
                }
                break;
            case 'hit':
                if (player.turn === 0) break;
                hit(player.hand);
                if (getHandValue(player.hand) >= 21) {
                    player.turn = 0;
                    payOut();
                }
                render();
                break;
            case 'stand':
                player.turn = 0;
                dealerPlay();
                render();
                break;
            case 'double-down':
                if (player.turn === 0) break;
                hit(player.hand);
                player.turn = 0;
                if (getHandValue(player.hand) <= 21) dealerPlay();
                else player.win = 0;
                render();
                payOut();
                break;
        }
    // }
}
function payOut() {
    if (player.win === 1) player.money += bet*2;
    player.bet = null;
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
function dealerPlay() {
    while (getHandValue(dealer.hand) < 17) {
        hit(dealer.hand);
    }
    if (getHandValue(dealer.hand) > 21) {
        player.win = 1;
    }
    else checkWin();
    payOut();
}
function dealerTurnEnd() {
    if (getHandValue(dealer.hand) < 17) return 0;
    else return 1;
}
function checkWin() {
    if (getHandValue(player.hand) > getHandValue(dealer.hand)) {
        player.win = 1; 
        messageEl.innerText = 'PLAYER WINS'
    }
    else if (getHandValue(player.hand) < getHandValue(dealer.hand)) {
        player.win = 0;
        messageEl.innerText = 'DEALER WINS'
    }
    else messageEl.innerText = 'PUSH'
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
    if (player.turn != 0) {
        let faceDownCard = document.createElement('div');
        let faceUpCard = document.createElement('div');
        faceDownCard.classList.add('card', 'back-blue')
        faceUpCard.classList.add('card', dealer.hand[1].face)
        dealerEl.appendChild(faceDownCard);
        dealerEl.appendChild(faceUpCard);
    }
    else {
        dealer.hand.forEach(function(card) {
        let newCard = document.createElement('div');
        newCard.classList.add('card', card.face)
        dealerEl.appendChild(newCard);
        }); 
    }
}
function render() {
    renderPlayerHand();
    renderDealerHand();
    renderMessage();
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
    return total;
}
function deal() {
    player.hand.push(deck.pop(), deck.pop());
    dealer.hand.push(deck.pop(), deck.pop());
}
function hit(hand) {
    hand.push(deck.pop());
}

function init() {
    buildDeck();
    shuffle();
    deal();
    render();
    player.turn = 1;
}

init();