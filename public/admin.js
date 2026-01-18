const socket = io();

let isAuthenticated = false;
let participants = [];
let currentWinner = null;
let isLocked = false;

// DOM elements
const loginScreen = document.getElementById("loginScreen");
const adminDashboard = document.getElementById("adminDashboard");
const passwordInput = document.getElementById("passwordInput");
const loginButton = document.getElementById("loginButton");
const loginError = document.getElementById("loginError");
const lockButton = document.getElementById("lockButton");
const unlockButton = document.getElementById("unlockButton");
const resetButton = document.getElementById("resetButton");
const logoutButton = document.getElementById("logoutButton");
const participantCount = document.getElementById("participantCount");
const participantList = document.getElementById("participantList");
const winnerDisplay = document.getElementById("winnerDisplay");
const statusText = document.getElementById("statusText");
const statusDot = document.getElementById("statusDot");
const debugLog = document.getElementById("debugLog");

// Debug logging
function addDebugLog(message, type = "info") {
  const timestamp = new Date().toLocaleTimeString();
  const logEntry = document.createElement("div");
  logEntry.className = `debug-entry debug-${type}`;
  logEntry.innerHTML = `<span class="debug-time">[${timestamp}]</span> ${message}`;
  debugLog.insertBefore(logEntry, debugLog.firstChild);
  
  // Keep only last 50 entries
  while (debugLog.children.length > 50) {
    debugLog.removeChild(debugLog.lastChild);
  }
}

// Update UI state
function updateUI() {
  // Update status
  if (isLocked) {
    statusText.textContent = "Status: Locked";
    statusDot.className = "status-dot status-locked";
    lockButton.disabled = true;
    unlockButton.disabled = false;
  } else {
    statusText.textContent = "Status: Ready";
    statusDot.className = "status-dot status-ready";
    lockButton.disabled = false;
    unlockButton.disabled = true;
  }
  
  // Update participant count
  participantCount.textContent = participants.length;
  
  // Update participant list
  if (participants.length === 0) {
    participantList.innerHTML = "<div class='empty-state'>No participants yet</div>";
  } else {
    participantList.innerHTML = participants
      .map((p) => `<div class="participant-item">${p.name}</div>`)
      .join("");
  }
  
  // Update winner display
  if (currentWinner) {
    winnerDisplay.innerHTML = `
      <div class="winner-name-large">${currentWinner.name}</div>
      <div class="winner-time">${new Date(currentWinner.timestamp).toLocaleTimeString()}</div>
    `;
  } else {
    winnerDisplay.innerHTML = '<div class="no-winner">No winner yet</div>';
  }
}

// Admin login
function login() {
  const password = passwordInput.value;
  if (!password) {
    loginError.textContent = "Please enter password";
    return;
  }
  
  socket.emit("admin:login", password);
}

// Admin actions
lockButton.addEventListener("click", () => {
  socket.emit("admin:lock");
  addDebugLog("Locking buzzer...", "action");
});

unlockButton.addEventListener("click", () => {
  socket.emit("admin:unlock");
  addDebugLog("Unlocking buzzer...", "action");
});

resetButton.addEventListener("click", () => {
  socket.emit("admin:reset");
  addDebugLog("Resetting game...", "action");
});

logoutButton.addEventListener("click", () => {
  socket.emit("admin:logout");
});

loginButton.addEventListener("click", login);
passwordInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    login();
  }
});

// Socket event handlers
socket.on("admin:authenticated", (data) => {
  isAuthenticated = true;
  isLocked = data.locked;
  currentWinner = data.winner;
  participants = data.participants || [];
  
  loginScreen.classList.add("hidden");
  adminDashboard.classList.remove("hidden");
  
  updateUI();
  addDebugLog("Admin authenticated successfully", "success");
});

socket.on("admin:error", (message) => {
  loginError.textContent = message;
  addDebugLog(`Login error: ${message}`, "error");
});

socket.on("admin:state-updated", (data) => {
  isLocked = data.locked;
  currentWinner = data.winner;
  updateUI();
  addDebugLog(`State updated - Locked: ${data.locked}`, "info");
});

socket.on("admin:winner", (winnerData) => {
  currentWinner = winnerData;
  updateUI();
  addDebugLog(`Winner: ${winnerData.name}`, "success");
});

socket.on("admin:participant-joined", (data) => {
  participants.push({ name: data.name });
  updateUI();
  addDebugLog(`Participant joined: ${data.name} (Total: ${data.totalParticipants})`, "info");
});

socket.on("admin:participant-left", (data) => {
  participants = participants.filter((p) => p.name !== data.name);
  updateUI();
  addDebugLog(`Participant left: ${data.name} (Total: ${data.totalParticipants})`, "info");
});

socket.on("connect", () => {
  addDebugLog("Connected to server", "success");
});

socket.on("admin:logged-out", () => {
  isAuthenticated = false;
  loginScreen.classList.remove("hidden");
  adminDashboard.classList.add("hidden");
  passwordInput.value = "";
  loginError.textContent = "";
  addDebugLog("Logged out successfully", "info");
});

socket.on("disconnect", () => {
  addDebugLog("Disconnected from server", "error");
  if (isAuthenticated) {
    loginError.textContent = "Connection lost. Please refresh.";
    loginScreen.classList.remove("hidden");
    adminDashboard.classList.add("hidden");
    isAuthenticated = false;
  }
});

// Initialize
addDebugLog("Admin panel loaded", "info");
