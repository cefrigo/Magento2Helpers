const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext("2d");
const intro = document.querySelector("#intro");
const reveal = document.querySelector("#reveal");
const playerForm = document.querySelector("#playerForm");
const playerNameInput = document.querySelector("#playerName");
const relationInput = document.querySelector("#relation");
const playAgainButton = document.querySelector("#playAgainButton");
const newPlayerButton = document.querySelector("#newPlayerButton");
const scoreEl = document.querySelector("#score");
const hintEl = document.querySelector("#hint");
const playerBadge = document.querySelector("#playerBadge");
const revealTitle = document.querySelector("#revealTitle");
const revealMessage = document.querySelector("#revealMessage");
const controls = document.querySelectorAll("[data-control]");

const world = {
  width: 1040,
  height: 560,
  gravity: 0.72,
};

const keys = {
  left: false,
  right: false,
  jump: false,
};

const player = {
  x: 58,
  y: 390,
  width: 46,
  height: 58,
  vx: 0,
  vy: 0,
  grounded: false,
  facing: 1,
  jumpsLeft: 1,
};

const platforms = [
  { x: 0, y: 500, w: 1040, h: 60, color: "#a96234" },
  { x: 126, y: 392, w: 128, h: 24, color: "#dd6f3c" },
  { x: 306, y: 326, w: 132, h: 24, color: "#dd6f3c" },
  { x: 496, y: 405, w: 120, h: 24, color: "#dd6f3c" },
  { x: 660, y: 318, w: 132, h: 24, color: "#dd6f3c" },
  { x: 838, y: 248, w: 132, h: 24, color: "#dd6f3c" },
];

const hazards = [
  { x: 262, y: 476, w: 44, h: 24 },
  { x: 628, y: 476, w: 48, h: 24 },
];

const relicsStart = [
  {
    x: 180,
    y: 346,
    found: false,
    label: "corazon",
    message: "Pista 1: hay un nombre secreto esperando el momento justo.",
  },
  {
    x: 370,
    y: 280,
    found: false,
    label: "estrella",
    message: "Pista 2: una nueva alegria ya esta iluminando todo.",
  },
  {
    x: 554,
    y: 360,
    found: false,
    label: "flor",
    message: "Pista 3: la aventura esta cambiando de color.",
  },
  {
    x: 726,
    y: 272,
    found: false,
    label: "luna",
    message: "Pista 4: va a necesitar muchos abrazos expertos.",
  },
  {
    x: 906,
    y: 202,
    found: false,
    label: "llave",
    message: "Pista 5: ya casi se abre el huevo secreto.",
  },
  {
    x: 920,
    y: 454,
    found: false,
    label: "cinta",
    message: "Pista 6: corre al huevo grande y salta para abrirlo.",
  },
];

const finalEgg = {
  x: 875,
  y: 384,
  width: 92,
  height: 118,
};

const relationCopy = {
  abuela: {
    badge: "Abuela",
    title: "Vas a ser abuela de Lucy",
    final: "Abuela {name}, Lucy viene en camino y ya tiene a quien llenarla de mimos.",
  },
  abuelo: {
    badge: "Abuelo",
    title: "Vas a ser abuelo de Lucy",
    final: "Abuelo {name}, Lucy viene en camino y ya tiene a quien pedirle historias, juegos y abrazos.",
  },
  tia: {
    badge: "Tia",
    title: "Vas a ser tia de Lucy",
    final: "Tia {name}, oficialmente queda habilitado el modo consentidora.",
  },
  tio: {
    badge: "Tio",
    title: "Vas a ser tio de Lucy",
    final: "Tio {name}, ya podes ir practicando las mejores caras graciosas.",
  },
  prima: {
    badge: "Prima",
    title: "Vas a ser prima de Lucy",
    final: "Prima {name}, Lucy viene en camino y ya tiene companera de secretos y aventuras.",
  },
  primo: {
    badge: "Primo",
    title: "Vas a ser primo de Lucy",
    final: "Primo {name}, Lucy viene en camino y ya tiene con quien jugar, crecer y compartir.",
  },
  amiga: {
    badge: "Amiga",
    title: "Lucy viene en camino",
    final: "Amiga {name}, Lucy ya tiene una persona hermosa de la familia esperandola con amor.",
  },
  amigo: {
    badge: "Amigo",
    title: "Lucy viene en camino",
    final: "Amigo {name}, Lucy ya tiene alguien de la familia listo para celebrarla.",
  },
  familia: {
    badge: "Familia",
    title: "Lucy viene en camino",
    final: "Familia {name}, Lucy viene en camino y ya tiene una familia enorme esperandola.",
  },
};

function freshRelics() {
  return relicsStart.map((item) => ({ ...item }));
}

let relics = freshRelics();
let score = 0;
let started = false;
let won = false;
let confetti = [];
let lastTime = 0;
let playerData = {
  name: "Invitada",
  relation: "familia",
};

function cleanName(value) {
  const trimmed = value.trim().replace(/\s+/g, " ");
  return trimmed || "Invitada";
}

function getCopy() {
  return relationCopy[playerData.relation] || relationCopy.familia;
}

function formatMessage(template) {
  return template.replace("{name}", playerData.name);
}

function resetGame() {
  player.x = 58;
  player.y = 390;
  player.vx = 0;
  player.vy = 0;
  player.grounded = false;
  player.facing = 1;
  player.jumpsLeft = 1;
  relics = freshRelics();
  score = 0;
  won = false;
  confetti = [];
  keys.left = false;
  keys.right = false;
  keys.jump = false;
  reveal.classList.remove("is-visible");
  reveal.setAttribute("aria-hidden", "true");
  updateHud("Junta las 6 reliquias para abrir el huevo.");
}

function updateHud(message) {
  const copy = getCopy();
  scoreEl.textContent = `${score} / ${relics.length}`;
  hintEl.textContent = message;
  playerBadge.textContent = `${copy.badge} ${playerData.name}`;
}

function startGame() {
  resetGame();
  started = true;
  intro.classList.add("is-hidden");
  canvas.focus();
}

function submitPlayer(event) {
  event.preventDefault();
  playerData = {
    name: cleanName(playerNameInput.value),
    relation: relationInput.value,
  };
  startGame();
}

function revealSecret() {
  if (won) return;
  won = true;
  burstConfetti();
  document.title = "Lucy viene en camino";
  revealTitle.textContent = getCopy().title;
  revealMessage.textContent = formatMessage(getCopy().final);
  setTimeout(() => {
    reveal.classList.add("is-visible");
    reveal.setAttribute("aria-hidden", "false");
  }, 650);
}

function burstConfetti() {
  const colors = ["#ff73ac", "#ffd65a", "#73d7ff", "#ffffff", "#ff9fc8", "#31b558"];
  confetti = Array.from({ length: 120 }, () => ({
    x: finalEgg.x + finalEgg.width / 2,
    y: finalEgg.y + finalEgg.height / 2,
    vx: (Math.random() - 0.5) * 12,
    vy: -Math.random() * 12 - 4,
    size: Math.random() * 7 + 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    spin: Math.random() * Math.PI,
  }));
}

function mapKey(event, value) {
  if (event.code === "ArrowLeft" || event.code === "KeyA") keys.left = value;
  if (event.code === "ArrowRight" || event.code === "KeyD") keys.right = value;
  if (event.code === "Space" || event.code === "ArrowUp" || event.code === "KeyW") {
    keys.jump = value;
    event.preventDefault();
  }
}

function setControl(name, value) {
  if (name === "left") keys.left = value;
  if (name === "right") keys.right = value;
  if (name === "jump") keys.jump = value;
}

function rectanglesOverlap(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function respawn() {
  player.x = 58;
  player.y = 390;
  player.vx = 0;
  player.vy = 0;
  player.grounded = false;
  player.jumpsLeft = 1;
  updateHud("Cuidado con los pinches. Intentalo otra vez.");
}

function updatePlayer() {
  const speed = 4.6;
  player.vx *= 0.82;

  if (keys.left) {
    player.vx = -speed;
    player.facing = -1;
  }

  if (keys.right) {
    player.vx = speed;
    player.facing = 1;
  }

  if (keys.jump && player.jumpsLeft > 0) {
    player.vy = player.grounded ? -13.8 : -12;
    player.grounded = false;
    player.jumpsLeft -= 1;
    keys.jump = false;
  }

  player.vy += world.gravity;
  player.x += player.vx;
  player.y += player.vy;
  player.x = Math.max(12, Math.min(world.width - player.width - 12, player.x));
  player.grounded = false;

  for (const platform of platforms) {
    const wasAbove = player.y + player.height - player.vy <= platform.y;
    const insideX = player.x + player.width > platform.x && player.x < platform.x + platform.w;
    const falling = player.vy >= 0;

    if (falling && wasAbove && insideX && player.y + player.height >= platform.y) {
      player.y = platform.y - player.height;
      player.vy = 0;
      player.grounded = true;
      player.jumpsLeft = 1;
    }
  }

  const playerBox = { x: player.x, y: player.y, width: player.width, height: player.height };
  if (hazards.some((hazard) => rectanglesOverlap(playerBox, hazard))) respawn();
  if (player.y > world.height) respawn();
}

function updateRelics() {
  const playerBox = { x: player.x, y: player.y, width: player.width, height: player.height };

  for (const item of relics) {
    if (!item.found && rectanglesOverlap(playerBox, { x: item.x - 22, y: item.y - 22, width: 44, height: 44 })) {
      item.found = true;
      score += 1;
      updateHud(item.message);
    }
  }

  if (score === relics.length) {
    updateHud("El huevo esta listo. Tocarlo abre la sorpresa.");
    if (rectanglesOverlap(playerBox, finalEgg)) revealSecret();
  }
}

function updateConfetti() {
  for (const piece of confetti) {
    piece.vy += 0.22;
    piece.x += piece.vx;
    piece.y += piece.vy;
    piece.spin += 0.17;
  }
  confetti = confetti.filter((piece) => piece.y < world.height + 40);
}

function drawRoundedRect(x, y, w, h, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.rect(x, y, w, h);
  }
  ctx.fill();
}

function drawPlatform(platform) {
  drawRoundedRect(platform.x, platform.y, platform.w, platform.h, 5, platform.color);
  ctx.fillStyle = "#b9502e";
  for (let x = platform.x + 10; x < platform.x + platform.w; x += 34) {
    ctx.fillRect(x, platform.y + 11, 20, 4);
  }
  ctx.fillStyle = "#31b558";
  ctx.fillRect(platform.x, platform.y - 8, platform.w, 9);
}

function drawHazard(hazard) {
  ctx.fillStyle = "#e03b84";
  for (let x = hazard.x; x < hazard.x + hazard.w; x += 14) {
    ctx.beginPath();
    ctx.moveTo(x, hazard.y + hazard.h);
    ctx.lineTo(x + 7, hazard.y);
    ctx.lineTo(x + 14, hazard.y + hazard.h);
    ctx.closePath();
    ctx.fill();
  }
}

function drawStar(x, y, size, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.sin(Date.now() / 240 + x) * 0.12);
  ctx.fillStyle = color;
  ctx.strokeStyle = "#b98500";
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const radius = i % 2 === 0 ? size : size * 0.45;
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawHeart(x, y, size) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 28, size / 28);
  ctx.fillStyle = "#ff73ac";
  ctx.strokeStyle = "#c82172";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 10);
  ctx.bezierCurveTo(-24, -8, -12, -30, 0, -16);
  ctx.bezierCurveTo(12, -30, 24, -8, 0, 10);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawRelic(item) {
  const y = item.y + Math.sin(Date.now() / 250 + item.x) * 5;
  if (item.label === "corazon" || item.label === "cinta") {
    drawHeart(item.x, y, 26);
  } else {
    drawStar(item.x, y, 18, item.label === "llave" ? "#73d7ff" : "#ffd65a");
  }
}

function drawPlayer() {
  const x = player.x;
  const y = player.y;

  ctx.save();
  ctx.translate(x + player.width / 2, y + player.height / 2);
  ctx.scale(player.facing, 1);
  ctx.translate(-player.width / 2, -player.height / 2);

  ctx.fillStyle = "#24a958";
  ctx.beginPath();
  ctx.ellipse(23, 29, 22, 25, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#fff8ef";
  ctx.beginPath();
  ctx.ellipse(25, 35, 15, 16, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#24314f";
  ctx.beginPath();
  ctx.arc(31, 20, 3.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ff566d";
  ctx.beginPath();
  ctx.arc(38, 31, 5, 0, Math.PI);
  ctx.fill();

  ctx.fillStyle = "#f2a84a";
  ctx.fillRect(8, 51, 13, 6);
  ctx.fillRect(26, 51, 13, 6);
  ctx.restore();
}

function drawEgg() {
  const locked = score < relics.length;
  const x = finalEgg.x;
  const y = finalEgg.y;
  ctx.save();
  ctx.translate(x + finalEgg.width / 2, y + finalEgg.height / 2);
  if (!locked) ctx.rotate(Math.sin(Date.now() / 130) * 0.07);

  ctx.fillStyle = "#fff8ef";
  ctx.strokeStyle = locked ? "#506079" : "#e03b84";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.ellipse(0, 0, finalEgg.width / 2, finalEgg.height / 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  const spotColor = locked ? "#73d7ff" : "#ff73ac";
  ctx.fillStyle = spotColor;
  ctx.beginPath();
  ctx.arc(-20, -22, 12, 0, Math.PI * 2);
  ctx.arc(18, 8, 14, 0, Math.PI * 2);
  ctx.arc(-4, 34, 10, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = locked ? "rgba(36, 49, 79, 0.72)" : "#e03b84";
  ctx.font = "900 20px Trebuchet MS";
  ctx.textAlign = "center";
  ctx.fillText(locked ? `${relics.length - score}` : "Lucy", 0, 8);
  ctx.restore();
}

function drawConfetti() {
  for (const piece of confetti) {
    ctx.save();
    ctx.translate(piece.x, piece.y);
    ctx.rotate(piece.spin);
    ctx.fillStyle = piece.color;
    ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.65);
    ctx.restore();
  }
}

function drawScene() {
  ctx.clearRect(0, 0, world.width, world.height);

  for (const platform of platforms) drawPlatform(platform);
  for (const hazard of hazards) drawHazard(hazard);
  for (const item of relics) {
    if (!item.found) drawRelic(item);
  }

  drawEgg();
  drawPlayer();
  drawConfetti();

  ctx.fillStyle = "rgba(36, 49, 79, 0.72)";
  ctx.font = "900 16px Trebuchet MS";
  ctx.fillText("PC: flechas/WASD + espacio", 20, 32);
}

function loop(time) {
  const elapsed = time - lastTime;
  lastTime = time;
  if (elapsed < 80 && started && !won) {
    updatePlayer();
    updateRelics();
  }
  updateConfetti();
  drawScene();
  requestAnimationFrame(loop);
}

window.addEventListener("keydown", (event) => mapKey(event, true));
window.addEventListener("keyup", (event) => mapKey(event, false));
playerForm.addEventListener("submit", submitPlayer);
playAgainButton.addEventListener("click", startGame);
newPlayerButton.addEventListener("click", () => {
  reveal.classList.remove("is-visible");
  reveal.setAttribute("aria-hidden", "true");
  intro.classList.remove("is-hidden");
  started = false;
  playerNameInput.focus();
});

for (const button of controls) {
  const control = button.dataset.control;
  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    button.setPointerCapture(event.pointerId);
    setControl(control, true);
  });
  button.addEventListener("pointerup", () => setControl(control, false));
  button.addEventListener("pointercancel", () => setControl(control, false));
  button.addEventListener("pointerleave", () => setControl(control, false));
}

resetGame();
drawScene();
requestAnimationFrame(loop);
