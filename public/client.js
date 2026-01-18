// Pre-open websocket connection immediately
const socket = io();

let isRegistered = false;
let isLocked = false;
let participantName = "";

// DOM elements
const registrationSection = document.getElementById("registrationSection");
const gameSection = document.getElementById("gameSection");
const nameInput = document.getElementById("nameInput");
const registerButton = document.getElementById("registerButton");
const buzzButton = document.getElementById("buzzButton");
const resultDisplay = document.getElementById("result");
const errorMessage = document.getElementById("errorMessage");
const statusBadge = document.getElementById("statusBadge");
const teamNameDisplay = document.getElementById("teamNameDisplay");
const spacebarHint = document.getElementById("spacebarHint");

// Detect if desktop
const isDesktop = window.matchMedia("(min-width: 768px)").matches;

// Register participant
function register() {
  const name = nameInput.value.trim();
  if (!name) {
    showError("Please enter your name");
    return;
  }
  
  socket.emit("participant:register", name);
}

// Handle buzz
function buzz() {
  if (!isRegistered) {
    showError("Please register first");
    return;
  }
  
  if (isLocked) {
    // Status badge already shows it's locked, no need for notification
    return;
  }
  
  // Don't send name, server will use registered name
  socket.emit("buzz");
}

// Show error message
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add("show");
  setTimeout(() => {
    errorMessage.classList.remove("show");
  }, 3000);
}

// Update status badge
function updateStatus(locked) {
  isLocked = locked;
  if (locked) {
    statusBadge.textContent = "Locked";
    statusBadge.className = "status-badge status-locked";
    buzzButton.disabled = true;
    buzzButton.classList.add("disabled");
  } else {
    statusBadge.textContent = "Ready";
    statusBadge.className = "status-badge status-ready";
    buzzButton.disabled = false;
    buzzButton.classList.remove("disabled");
  }
}

// Show spacebar visual feedback
function showSpacebarPress() {
  const hint = document.getElementById("spacebarHint");
  if (hint) {
    hint.classList.add("pressed");
    setTimeout(() => {
      hint.classList.remove("pressed");
    }, 150);
  }
}

// Event listeners - use touchstart for mobile, click for desktop
registerButton.addEventListener("click", register);
registerButton.addEventListener("touchstart", (e) => {
  e.preventDefault();
  register();
});

nameInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    register();
  }
});

// Use touchstart for mobile (faster), click for desktop
buzzButton.addEventListener("touchstart", (e) => {
  e.preventDefault();
  e.stopPropagation();
  buzz();
}, { passive: false });

buzzButton.addEventListener("click", buzz);

// Spacebar support for desktop
let spacebarPressed = false;
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && isDesktop && !spacebarPressed) {
    e.preventDefault();
    spacebarPressed = true;
    if (isRegistered && !isLocked) {
      showSpacebarPress();
      buzz();
    }
  }
});

document.addEventListener("keyup", (e) => {
  if (e.code === "Space") {
    spacebarPressed = false;
  }
});

// Prevent spacebar from scrolling
window.addEventListener("keydown", (e) => {
  if (e.code === "Space" && e.target === document.body) {
    e.preventDefault();
  }
});

// Socket event handlers
socket.on("participant:registered", (data) => {
  isRegistered = true;
  participantName = data.name;
  registrationSection.classList.add("hidden");
  gameSection.classList.remove("hidden");
  nameInput.disabled = true;
  registerButton.disabled = true;
  
  // Show team name
  teamNameDisplay.textContent = `Team: ${participantName}`;
  teamNameDisplay.classList.remove("hidden");
  
  // Show spacebar hint for desktop
  if (isDesktop) {
    spacebarHint.classList.remove("hidden");
  }
  
  console.log("Registered as:", data.name);
});

socket.on("winner", (winnerData) => {
  const isWinner = winnerData.name === participantName;
  resultDisplay.innerHTML = `
    <div class="winner-announcement">
      <div class="winner-name">${winnerData.name}</div>
      <div class="winner-label">${isWinner ? "You Won!" : "Won!"}</div>
    </div>
  `;
  buzzButton.disabled = true;
  buzzButton.classList.add("disabled");
  updateStatus(true);
});

socket.on("reset", () => {
  resultDisplay.innerHTML = "";
  updateStatus(false);
});

socket.on("locked", () => {
  updateStatus(true);
  // Status badge already shows it's locked, no need for notification
});

socket.on("unlocked", () => {
  updateStatus(false);
  resultDisplay.innerHTML = "";
});

socket.on("error", (message) => {
  // If error says to register first, redirect to registration screen
  if (message.includes("register") || message.includes("Register") || message.includes("name first")) {
    isRegistered = false;
    registrationSection.classList.remove("hidden");
    gameSection.classList.add("hidden");
    nameInput.disabled = false;
    registerButton.disabled = false;
    nameInput.value = "";
    teamNameDisplay.classList.add("hidden");
    spacebarHint.classList.add("hidden");
  } else {
    showError(message);
  }
});

socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("disconnect", () => {
  showError("Disconnected from server. Please refresh.");
});
