const refreshPage = () => {
  window.location.reload();
  $("#player_name").val("");
  $("#num_cards").val(0);
};


const gameCards = document.querySelectorAll(".game-card");
const scoreDisplay = document.querySelector("#score");
const correctDisplay = document.querySelector("#correct");

let hasFlipped = false;
let lockBoard = false;
let firstCard, secondCard;
let score = 0;

// Flip function called when a card is clicked
function flip() {
  if (lockBoard) return; 
  if (this === firstCard) return;
  this.classList.add("flip"); 

  if (!hasFlipped) {
    // First card
    hasFlipped = true;
    firstCard = this;
    return;
  } else {
    // Second card
    secondCard = this;
  }

  //calling the function checkForMatch
  checkForMatch();
}

// checking if both the cards match or not
// if they match disableCards function is called otherwise unflip function is called
function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
  isMatch ? disableCards() : unflip();
}
// disableCards fdunction removes the matching cards and updates the score and stores the 
// current score in session storage and also updates the highest score in local storage
function disableCards() {
  setTimeout(() => {
    $(firstCard).fadeOut(500, function () {
      $(this).remove();
    });
    $(secondCard).fadeOut(500, function () {
      $(this).remove();
    });

    resetBoard();
    score++;
    sessionStorage.setItem("current_score", score);
    localStorage.setItem("highScore", score);
    $("#correct").text(
      `Current Score: ${sessionStorage.getItem("current_score")}`
    );
    $("#high_Score").text(`High Score: ${localStorage.getItem("highScore")}`);

    // Check if the player has won the game
    if (score === gameCards.length / 2) {
      alert("Congratulations! You won!");
      window.location.reload();
    }
  }, 1000);
}


function unflip() {
  lockBoard = true; 

  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");

    resetBoard();
  }, 1000);
}


function resetBoard() {
  [hasFlipped, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

$(document).ready(() => {
  // Setting the player name, num of cards and high score if available in storage
  sessionStorage.getItem("playerName") == "" ||
  sessionStorage.getItem("playerName") == null
    ? $("#player").text("")
    : $("#player").text(`Player: ${sessionStorage.getItem("playerName")}`);

  sessionStorage.getItem("numCards") == "" ||
  sessionStorage.getItem("numCards") == null
    ? $("#no_of_cards").text("")
    : $("#no_of_cards").text(
        `No. of Cards: ${sessionStorage.getItem("numCards")}`
      );
  localStorage.getItem("highScore") == "" ||
  localStorage.getItem("highScore") == null
    ? $("#high_score").text("")
    : $("#high_score").text(`High Score: ${localStorage.getItem("highScore")}`);
  $("#correct").text("Score: 0");

  // click handler for save setting button
  $("#save_settings").click(() => {
    const playerName = $("#player_name").val();
    const numCards = $("#num_cards").val();
    sessionStorage.setItem("playerName", playerName);
    sessionStorage.setItem("numCards", numCards);
    sessionStorage.setItem("current_score", 0);
    localStorage.setItem("highScore", 0); // setting high score in local storage
    refreshPage();
  });

  let temp = sessionStorage.getItem("numCards");
  if (temp == null) {
    temp = 48; //by dafault it will display 48 cards 
  }

  // Generate game cards based on the number of cards
  for (let i = 1; i <= temp; i++) {
    cardNum = Math.floor(Math.random() * 24) + 1;
    console.log(cardNum);
    $(".game-container").append(
      `<div class="game-card" data-framework="card_${cardNum}"><img src="images/card_${cardNum}.png" href="#" alt="" class="card-front"><img src="images/back.png" alt="" href="#" class="card-back"></div>`
    );
  }

  // Add event listener to each game card
  document
    .querySelectorAll(".game-card")
    .forEach((card) => card.addEventListener("click", flip));
});
