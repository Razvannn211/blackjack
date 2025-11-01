function asteapta(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const semne = ["♥", "♦", "♣", "♠"];
const valori = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];
let deck = [];
let dealerSum;
let playerSum;
let playerAces;
let dealerAces;
let dealerCardCnt;
let playerCardCnt;

const cardGive = new Audio("sounds/cardflip.mp3");
const HitBtn = document.getElementById("btnHit");
const StandBtn = document.getElementById("btnStand");
const dealerSumD = document.getElementById("dealerSum");
const playerSumD = document.getElementById("playerSum");
const winner = document.getElementById("winner");
const playAgainBtn = document.getElementById("play-again");

function creeazaPachet() {
  deck = [];
  for (let semn of semne) {
    for (let valoare of valori) {
      deck.push({ semn, valoare });
    }
  }
}

function amestecaPachet() {
  playAgainBtn.classList.add("hidden");
  dealerSum = 0;
  playerSum = 0;
  dealerAces = 0;
  playerAces = 0;
  playerCardCnt = 0;
  dealerCardCnt = 0;
  deck.sort(() => Math.random() - 0.5);
}

function valoareCarte(carte) {
  if (carte.valoare === "A") return 11;
  if (["J", "Q", "K"].includes(carte.valoare)) return 10;
  return parseInt(carte.valoare);
}

function trageCarte() {
  return deck.pop();
}

function afiseazaCarte(containerId, carte, ascunsa = false) {
  const container = document.getElementById(containerId);
  const div = document.createElement("div");
  div.classList.add("card");

  if (ascunsa) {
    div.classList.add("hidden-card");
    div.textContent = ""; // nu arătăm valoarea
  } else {
    if (carte.semn === "♥" || carte.semn === "♦") div.style.color = "red";
    div.textContent = `${carte.valoare}${carte.semn}`;
  }

  container.appendChild(div);
}

function adjAces(sum, aces) {
  if (sum > 21 && aces > 0) {
    sum -= 10;
    aces--;
  }
  return { sum, aces };
}
function dealerTrage() {
  const carte = trageCarte();
  afiseazaCarte("dealer-cards", carte);
  dealerSum += valoareCarte(carte);
  if (carte.valoare == "A") {
    dealerAces++;
  }
  let rezultat = adjAces(dealerSum, dealerAces);
  dealerSum = rezultat.sum;
  dealerAces = rezultat.aces;

  dealerSumD.textContent = dealerSum;
}
function playerTrage() {
  const carte = trageCarte();
  afiseazaCarte("player-cards", carte);
  playerSum += valoareCarte(carte);
  if (carte.valoare == "A") {
    playerAces++;
  }
  let rezultat = adjAces(playerSum, playerAces);
  playerSum = rezultat.sum;
  playerAces = rezultat.aces;

  playerSumD.textContent = playerSum;
  if (playerSum > 21) {
    StandBtn.disabled = true;
    HitBtn.disabled = true;
    winner.textContent = "Ai pierdut!";
    playAgainBtn.classList.remove("hidden");
  }
  if (playerSum == 21) {
    StandBtn.disabled = true;
    HitBtn.disabled = true;
    stand();
  }
}
async function stand() {
  // Întoarcem cartea ascunsă
  const dealerCardsContainer = document.getElementById("dealer-cards");
  const hiddenDiv = dealerCardsContainer.querySelector(".hidden-card");
  if (hiddenDiv) {
    hiddenDiv.classList.remove("hidden-card");
    if (hiddenCard.semn === "♥" || hiddenCard.semn === "♦")
      hiddenDiv.style.color = "red";
    hiddenDiv.textContent = `${hiddenCard.valoare}${hiddenCard.semn}`;
  }

  // Adăugăm valoarea ei la sumă
  dealerSum += valoareCarte(hiddenCard);
  if (hiddenCard.valoare === "A") dealerAces++;

  let rezultat = adjAces(dealerSum, dealerAces);
  dealerSum = rezultat.sum;
  dealerAces = rezultat.aces;
  dealerSumD.textContent = dealerSum;

  // Dealer trage până la 17
  while (dealerSum < 17) {
    dealerTrage();
    cardGive.play;
    await asteapta(800);
  }

  if (dealerSum > 21) {
    winner.textContent = "Ai câștigat!";
  } else if (dealerSum > playerSum) {
    winner.textContent = "Ai pierdut!";
  } else if (dealerSum === playerSum) {
    winner.textContent = "Egalitate!";
  } else {
    winner.textContent = "Ai câștigat!";
  }

  playAgainBtn.classList.remove("hidden");
}

// Inițializare joc
creeazaPachet();
amestecaPachet();

// Dealer primește prima carte vizibilă
dealerTrage();

// Dealer primește a doua carte ascunsă
hiddenCard = trageCarte();
afiseazaCarte("dealer-cards", hiddenCard, true);
async function playerStart() {
  cardGive.play();
  playerTrage();
  await asteapta(800);
  playerTrage();
  cardGive.play();
  await asteapta(800);
}
playerStart();
HitBtn.addEventListener("click", () => {
  playerTrage();
});
StandBtn.addEventListener("click", () => {
  stand();
});
playAgainBtn.addEventListener("click", () => {
  creeazaPachet();
  amestecaPachet();
  document.getElementById("dealer-cards").innerHTML = "";
  document.getElementById("player-cards").innerHTML = "";
  dealerTrage();

  // Dealer primește a doua carte ascunsă
  hiddenCard = trageCarte();
  afiseazaCarte("dealer-cards", hiddenCard, true);
  playerStart();

  StandBtn.disabled = false;
  HitBtn.disabled = false;
  winner.textContent = "";
});
