// This file contains the client-side JavaScript code that interacts with the server via WebSocket, handling events like button clicks and displaying results.

const socket = io();

// Function to handle the buzz button click
function buzz() {
  const name = document.getElementById("nameInput").value;
  if (name) {
    socket.emit("buzz", name);
  }
}

// Listen for the winner event from the server
socket.on("winner", (name) => {
  const resultDiv = document.getElementById("result");
  resultDiv.textContent = `${name} is the winner!`;
});

// Listen for the reset event from the server
socket.on("reset", () => {
  const resultDiv = document.getElementById("result");
  resultDiv.textContent = "";
});