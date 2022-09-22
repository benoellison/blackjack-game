let deck = [];

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
    console.log('Deck shuffled.');
}

class Hand {
    constructor(bet, card1, card2) {
        this.bet = bet;
        this.turn = 0;
        this.cards = [card1, card2];
        this.win = null;
    }
    get value() {
        return this.calcHandValue();
    }
    calcHandValue = function() {
        let total = 0;
        this.cards.forEach(function(card) {
            if (card.value !== 'A') total += card.value;
        });
        this.cards.forEach(function(card) {
            if (card.value === 'A') {
                if (total + 11 <= 21) total += 11;
                else total++;
            }
        });
        return total;
    }
    // bustOr21 = function() {
    //     if (this.value == 21) {
    //         this.turn = 0;
    //         return 21;
    //     }
    //     if (this.value > 21) {
    //         this.turn = 0;
    //         return 'bust';
    //     }
    // }
    checkFor21 = function() {
        if (this.value == 21) {
            this.turn = 0;
            console.log('Hand has 21.');
            return 21;
        }
        else {
            console.log('Hand does not have 21');
            return 0;
        }
    }
    checkForBlackjack = function() {
        if (this.checkFor21() && this.cards.length === 2) {
            console.log('Blackjack!');
            return true;
        }
        else {
            console.log('No blackjack.');
            return false;
        }
    }
    checkForBust = function() {
        if (this.value > 21) {
            console.log('Bust!');
            this.turn = 0;
            return 'bust';
        }
        else {
            console.log('No bust.');
            return 0;
        }
    }
    hit = function() {
        if (!this.checkFor21() && !this.checkForBust()) {
            this.cards.push(deck.pop());
            console.log('Hand hit.');
            return true;
        }
        else {
            console.log('Hand not hit.');
            return false;
        }
    }
    stand = function() {
        this.turn = 0;
        console.log('Standing.');
    }
    doubleDown = function() {
        if (this.hit()) {
            this.bet *= 2;
            this.turn = 0;
            console.log('Doubled down.');
        }
    }
    surrender = function() {
        this.bet *= 0.5;
        this.turn = 0;
        console.log('Hand surrendered.');
    }
}

let usedCards = []

class Player {
    constructor(name, money) {
        this.name = name;
        this.money = money;
        this.turn = 0;
        this.hands = [];
    }
}
let playerList = [];
const DEALER = new Player('Dealer', 1000000000);
const PLAYER1 = new Player('Player 1', 1000000);

function deal(player, bet) {
    let newHand = new Hand(bet, deck.pop(), deck.pop());
    player.hands.push(newHand);
    console.log('Cards dealt.');
}

// function checkWin(playerHand, dealerHand) {
//     if (playerHand.checkForBlackjack() && dealerHand.checkForBlackjack()) {
//         playerHand.win = null;
//         dealerHand.win = null;
//     }
//     else if (playerHand.checkForBlackjack() && !dealerHand.checkForBlackjack()) {
//         playerHand.win = 1;
//         dealerHand.win = 0;
//     }
//     else if (!playerHand.checkForBlackjack() && dealerHand.checkForBlackjack()) {
//         playerHand.win = 0;
//         dealerHand.win = 1;
//     }

//     if (playerHand.value > dealerHand.value) {
//         playerHand.win = 1;
//         dealerHand.win = 0;
//     }
//     if (playerHand.value === dealerHand.value) {
//         playerHand.win = null;
//         dealerHand.win = null;
//     }
//     else {
//         playerHand.win = 0;
//         dealerHand.win = 1;
//     }
// }
function checkWin(playerHand) {
    if (playerHand.checkForBlackjack() && DEALER.hands[0].checkForBlackjack()) {
        playerHand.win = null;
        console.log('Push. Dealer and player both have blackjack.');
    }
    else if (playerHand.checkForBlackjack() && !DEALER.hands[0].checkForBlackjack()) {
        playerHand.win = 1;
        console.log('Player wins with blackjack.');
    }
    else if (!playerHand.checkForBlackjack() && DEALER.hands[0].checkForBlackjack()) {
        playerHand.win = 0;
        console.log('Dealer wins with blackjack.');
    }
    else if (playerHand.value > DEALER.hands[0].value) {
        playerHand.win = 1;
        console.log('Player wins.');
    }
    else if (playerHand.value === DEALER.hands[0].value) {
        playerHand.win = null;
        console.log('Push.');
    }
    else if (playerHand.value < DEALER.hands[0].value) {
        playerHand.win = 0;
        console.log('Player loses.');
    }
}
function payOut(player) {
    player.hands.forEach(function(hand) {
        if (hand.win === 1) {
            player.money += hand.bet*2;
            DEALER.money -= hand.bet;
            hand.bet = 0;
            console.log('Player paid.');
        }
        else if (hand.win === 0) {
            DEALER.money += hand.bet;
            hand.bet = 0;
            console.log('Dealer paid.');
        }
        else if (hand.win === null) {
            player.money += hand.bet;
            hand.bet = 0;
            console.log('Bet returned.');
        }
    })
}
function placeBet(amount) {
    PLAYER1.money -= amount;
    console.log('Bet placed.');
    deal(PLAYER1, amount);
    deal(DEALER, 0);
    play();
}
const dealerEl = document.getElementById('dealer');
const playerEl = document.getElementById('player');

const betButtonEl = document.getElementById('bet');
const betAmountEl = document.getElementById('bet-amount');
betButtonEl.addEventListener('click', handleBetClick);
function handleBetClick(evt) {
    // let buttonClicked = evt.target;
    console.log(evt.target);
    if (!PLAYER1.hands[0]) {
        placeBet(betAmountEl.value);
    }
}

const buttonEl = document.getElementById('buttons');
// buttonEl.addEventListener('click', handleClick);
// function handleClick(evt) {
//     let buttonClicked = evt.target;
//     console.log(buttonClicked);
//     if (!PLAYER1.hands[0]) {
//         if (buttonClicked.id === 'bet') {
//             placeBet(betAmountEl.value);
//         }
//     }
//     else {
//         switch(buttonClicked.id) {
//             case 'hit':
//                 break;
//             case 'stand':
//                 break;
//             case 'double-down':
//                 break;
//             case 'split':
//                 break;
//             case 'surrender':
//                 break;
//         }
//     }
// }
function init() {
    console.log('New game started.');
    buildDeck();
    shuffle();
    playerList.push(DEALER, PLAYER1);
    console.log('Dealer and player added.');
}
function play() {  
    PLAYER1.hands.forEach(function(hand) {
        hand.turn = 1;
        while (hand.turn) {

        buttonEl.addEventListener('click', handleClick);
        function handleClick(evt) {
            let buttonClicked = evt.target;
            console.log(buttonClicked);
            switch(buttonClicked.id) {
                case 'hit':
                    hand.hit();
                    break;
                case 'stand':
                    hand.stand();
                    break;
                case 'double-down':
                    hand.doubleDown();
                    break;
                case 'split':
                    split(hand);
                    break;
                case 'surrender':
                    hand.surrender();
                    break;
            }
        }

        }

    });
}

function split(hand) {
    
}

function checkDeck() {
    if (deck.length == 0) {
        console.log('Deck empty.');
        deck = usedCards;
        console.log('Used cards added to deck.');
        shuffle();
        usedCards = [];
    }
}

function render() {
    dealerEl.innerText = dealer.cards;
    playerEl.innerText = player.cards;
}

function clearTable() {
    playerList.forEach(function(player) {       // For each Player in playerList...
        player.hands.forEach(function(hand) {   // for each hand each Player has...
            hand.cards.forEach(function(card) {       // for each Card in each Hand...
                usedCards.push(card);           // put that Card in the burn pile...
            });
        });
        player.hands = [];                      // then for each Player remove all Hands.
    });
    console.log('Cards burnt, hands empty.');
}

init();
