let dealerSum = 0,
    yourSum = 0,
    dealerAceCount = 0,
    yourAceCount = 0,
    hidden,
    deck,
    canHit = true,
    canDealerHit = true;

window.onload = function () {
    buildDeck();
    shuffleDeck();
    startGame();
}

function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let suits = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < suits.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + suits[i]); // Iterates through each suit and assigns the value: A-C -> K-C, A-D -> K-D...
        }
    }
    // console.log(deck);
}

// Shuffles the deck by getting a random number and then swapping that card position until loop ends.
function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length); // Math.random gives a number 0-1. Math floor rounds that number down.
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    console.log(deck);
}

function startGame() {
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);

    giveYourCard();
    giveDealerCard();
    giveYourCard();

    console.log("Dealer's down card is: " + hidden);
    console.log("Dealer's total is: " + dealerSum);
    // console.log("Your total is: " + yourSum);

    checkForLoss();

    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
    document.getElementById("restart").addEventListener("click", restart);
}

function checkForLoss() {
    dealerSum = reduceDealerAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    if (dealerSum === 21) {
        stay();
    }

    if (yourSum === 21) {
        stay();
    }

    if (yourSum > 21) {
        stay();
    }
}

function giveYourCard() {
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);

    if (yourSum > 21 && yourAceCount > 0) {
        let tempDisplay = yourSum - 10;
        document.getElementById("your-sum").innerText = tempDisplay;
    }
    else {
        document.getElementById("your-sum").innerText = yourSum;
    }
}

function giveDealerCard() {
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    dealerSum += getValue(card);
    dealerAceCount += checkAce(card);
    document.getElementById("dealer-cards").append(cardImg);
}

function hit() {
    if (reduceAce(yourSum, yourAceCount) > 21) {
        canHit = false;
    }
    
    if (!canHit) {
        return;
    }
    else {
        giveYourCard();
        checkForLoss();
        reduceAce(yourSum, yourAceCount);
    }
}

function dealerHits() {
    if (reduceDealerAce(dealerSum, dealerAceCount) > 21) {
        canDealerHit = false;
    }
    
    if (!canDealerHit) {
        return
    }
    else {
        while(dealerSum < 17) {
            giveDealerCard();
        }
        reduceDealerAce(dealerSum, dealerAceCount);
    }
}

function stay() {
    canHit = false;

    // Reveal dealer's hidden card
    document.getElementById("hidden").src = "./cards/" + hidden + ".png";

    dealerHits();

    dealerSum = reduceDealerAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    let message = "";
    if (yourSum > 21) {
        message = "Bust!";
        document.getElementById("results").style.color = "Red";
    }
    else if (dealerSum > 21) {
        message = "You win!";
        document.getElementById("results").style.color = "Green";
    }
    else if (yourSum === dealerSum) {
        message = "Push.";
    }
    else if (yourSum > dealerSum) {
        message = "You win!";
        document.getElementById("results").style.color = "Green";
    }
    else if (yourSum < dealerSum) {
        message = "You lose!";
        document.getElementById("results").style.color = "Red";
    }

    displayResults(yourSum, dealerSum, message);
}

function getValue(card) {
    let data = card.split("-");
    let value = data[0];

    if (isNaN(value)) { // First check to see if face card. If A, return 11. If J, Q, K, return 10.
        if (value === "A") {
            return 11;
        }
        else {
            return 10;
        }
    }
    else {
        return parseInt(value);
    }
}

function checkAce(card) {
    if (card[0] === "A") {
        return 1;
    }
    return 0;
}

function reduceAce(yourSum, yourAceCount) {
    while (yourSum > 21 && yourAceCount > 0) {
        yourSum -= 10;
        yourAceCount -= 1;
    }
    return yourSum;
}

function reduceDealerAce(dealerSum, dealerAceCount) {
    while (dealerSum > 21 && dealerAceCount > 0) {
        dealerSum -= 10;
        dealerAceCount -= 1;
    }
    return dealerSum;
}

function displayResults(yourSum, dealerSum, message) {
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("results").innerText = message;
    document.getElementById("restart").style.visibility = "visible";
}

function restart() {
    location.reload();
}