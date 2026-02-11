// ---------------- PLAYER DATA ----------------
const player =
  JSON.parse(localStorage.getItem("currentPlayer")) ||
  { name: "Guest", branch: "N/A" };

document.getElementById("playerName").innerText = player.name;
document.getElementById("playerBranch").innerText = player.branch;

// ---------------- GAME STATE ----------------
let runs = 0;
let balls = 0;
let frequency = [0,0,0,0,0,0,0];
let moveHistory = [];
let gameOver = false;

// ---------------- AI ----------------
function randomMove() {
  return Math.floor(Math.random()*6)+1;
}

function getAIMove() {

  if (balls <= 5) {
    document.getElementById("aiPhase").innerText = "Early Game";
    return randomMove();
  }

  if (balls <= 12) {
    document.getElementById("aiPhase").innerText = "Mid Game";
    let most = 1;
    for (let i=1;i<=6;i++) {
      if (frequency[i] > frequency[most]) most=i;
    }
    return Math.random()<0.7 ? most : randomMove();
  }

  document.getElementById("aiPhase").innerText = "End Game";
  const last = moveHistory[moveHistory.length-1];
  return Math.random()<0.8 ? last : randomMove();
}

// ---------------- PLAY BALL ----------------
function playMove(playerMove) {

  if (gameOver) return;

  balls++;
  frequency[playerMove]++;
  moveHistory.push(playerMove);

  const aiMove = getAIMove();

  document.getElementById("aiHandImage").src =
    `hand-images/${aiMove}.png`;

  document.getElementById("aiHandImage").style.display="block";
  document.getElementById("aiMoveText").innerText =
    `AI played: ${aiMove}`;

  // OUT
  if (playerMove === aiMove) {
    document.getElementById("statusText").innerText =
      "YOU ARE OUT!";
    endGame();
    return;
  }

  runs += playerMove;

  document.getElementById("statusText").innerText =
    `Scored ${playerMove} run(s)!`;

  updateStats();
}

// ---------------- UPDATE STATS ----------------
function updateStats() {
  document.getElementById("runs").innerText = runs;
  document.getElementById("balls").innerText = balls;
  document.getElementById("sr").innerText =
    ((runs/balls)*100).toFixed(2);
}

// ---------------- MANUAL BUTTON ----------------
function manualPlay(n) {
  if (gameOver) return;
  playMove(n);
}

// ---------------- END GAME ----------------
function endGame() {

  gameOver = true;

  saveScore();

  // Stop camera
  if (typeof stopGame === "function") {
    stopGame();
  }

  // Disable manual buttons
  document.querySelectorAll(".offline-controls button")
    .forEach(btn=>btn.disabled=true);

  // Hide detect button
  const detectBtn = document.getElementById("detectBtn");
  if (detectBtn) detectBtn.style.display="none";

  // Show face button
  document.getElementById("faceBtn").style.display="block";
}

// ---------------- SAVE SCORE ----------------
function saveScore() {

  let lb =
    JSON.parse(localStorage.getItem("leaderboard")) || [];

  lb.push({
    name:player.name,
    runs:runs,
    balls:balls,
    sr:((runs/balls)*100).toFixed(2)
  });

  localStorage.setItem("leaderboard",JSON.stringify(lb));

  renderLeaderboard();
}

// ---------------- LEADERBOARD ----------------
function renderLeaderboard() {

  const body =
    document.getElementById("leaderboardBody");

  body.innerHTML="";

  const lb =
    JSON.parse(localStorage.getItem("leaderboard")) || [];

  lb.sort((a,b)=>
    b.runs-a.runs ||
    b.sr-a.sr ||
    a.balls-b.balls
  );

  lb.forEach(p=>{
    body.innerHTML += `
      <tr>
        <td>${p.name}</td>
        <td>${p.runs}</td>
        <td>${p.balls}</td>
        <td>${p.sr}</td>
      </tr>
    `;
  });
}

// ---------------- FACE PAGE ----------------
function goToFace(){
  window.location.href="face.html";
}

// ---------------- INIT ----------------
renderLeaderboard();

window.playMove = playMove;
window.manualPlay = manualPlay;
