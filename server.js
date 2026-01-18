const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Game state
let locked = false;
let winner = null;
const adminPassword = "admin123"; // Change this to your desired password
let adminSocket = null;
const participants = new Map(); // socketId -> {name, connectedAt}

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Debug logging function
function debugLog(message, data = null) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`, data ? JSON.stringify(data, null, 2) : "");
}

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/secret69", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  debugLog("New connection", { socketId: socket.id, ip: socket.handshake.address });

  // Handle admin login
  socket.on("admin:login", (password) => {
    if (password === adminPassword) {
      if (adminSocket) {
        // Disconnect previous admin
        adminSocket.emit("admin:error", "Another admin is already connected");
        debugLog("Admin login rejected - already connected", { socketId: socket.id });
      } else {
        adminSocket = socket;
        socket.join("admin");
        socket.emit("admin:authenticated", {
          locked,
          winner,
          participants: Array.from(participants.values()),
        });
        debugLog("Admin authenticated", { socketId: socket.id });
      }
    } else {
      socket.emit("admin:error", "Invalid password");
      debugLog("Admin login failed - invalid password", { socketId: socket.id });
    }
  });

  // Handle participant registration
  socket.on("participant:register", (name) => {
    if (!name || name.trim() === "") {
      socket.emit("error", "Please enter your name");
      return;
    }
    
    const trimmedName = name.trim();
    
    // Check for duplicate names (case-insensitive)
    const nameExists = Array.from(participants.values()).some(
      (p) => p.name.toLowerCase() === trimmedName.toLowerCase()
    );
    
    if (nameExists) {
      socket.emit("error", "This name is already taken. Please choose another.");
      debugLog("Registration rejected - duplicate name", { socketId: socket.id, name: trimmedName });
      return;
    }
    
    participants.set(socket.id, {
      name: trimmedName,
      connectedAt: new Date().toISOString(),
      socketId: socket.id,
    });
    
    socket.emit("participant:registered", { name: trimmedName });
    
    // Notify admin
    if (adminSocket) {
      adminSocket.emit("admin:participant-joined", {
        name: trimmedName,
        totalParticipants: participants.size,
      });
    }
    
    debugLog("Participant registered", { socketId: socket.id, name: trimmedName });
  });

  // Handle buzz from participants
  socket.on("buzz", () => {
    // Record timestamp on server when packet arrives
    const serverTimestamp = new Date().toISOString();
    
    if (locked) {
      // Don't send error - status badge already shows it's locked
      debugLog("Buzz rejected - locked", { socketId: socket.id });
      return;
    }

    const participant = participants.get(socket.id);
    if (!participant) {
      socket.emit("error", "Please register your name first");
      return;
    }

    // Lock immediately on first packet arrival
    locked = true;
    winner = {
      name: participant.name,
      socketId: socket.id,
      timestamp: serverTimestamp,
    };

    // Notify all participants
    io.emit("winner", winner);
    
    // Notify admin
    if (adminSocket) {
      adminSocket.emit("admin:winner", winner);
    }

    debugLog("Buzz received - winner set", winner);
  });

  // Admin: Lock buzzer
  socket.on("admin:lock", () => {
    if (socket === adminSocket) {
      locked = true;
      io.emit("locked");
      if (adminSocket) {
        adminSocket.emit("admin:state-updated", { locked, winner });
      }
      debugLog("Buzzer locked by admin", { socketId: socket.id });
    }
  });

  // Admin: Unlock buzzer
  socket.on("admin:unlock", () => {
    if (socket === adminSocket) {
      locked = false;
      winner = null;
      io.emit("unlocked");
      io.emit("reset");
      if (adminSocket) {
        adminSocket.emit("admin:state-updated", { locked, winner });
      }
      debugLog("Buzzer unlocked by admin", { socketId: socket.id });
    }
  });

  // Admin: Reset game
  socket.on("admin:reset", () => {
    if (socket === adminSocket) {
      locked = false;
      winner = null;
      io.emit("reset");
      if (adminSocket) {
        adminSocket.emit("admin:state-updated", { locked, winner });
      }
      debugLog("Game reset by admin", { socketId: socket.id });
    }
  });

  // Admin: Logout
  socket.on("admin:logout", () => {
    if (socket === adminSocket) {
      adminSocket = null;
      socket.leave("admin");
      socket.emit("admin:logged-out");
      debugLog("Admin logged out", { socketId: socket.id });
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    debugLog("Client disconnected", { socketId: socket.id });
    
    if (socket === adminSocket) {
      adminSocket = null;
      debugLog("Admin disconnected");
    }
    
    if (participants.has(socket.id)) {
      const participant = participants.get(socket.id);
      participants.delete(socket.id);
      
      // Notify admin
      if (adminSocket) {
        adminSocket.emit("admin:participant-left", {
          name: participant.name,
          totalParticipants: participants.size,
        });
      }
      
      debugLog("Participant removed", { name: participant.name });
    }
  });
});

// Get local IP address for display
function getLocalIP() {
  try {
    const os = require("os");
    const interfaces = os.networkInterfaces();
    if (!interfaces) {
      return "localhost";
    }
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]) {
        if (iface.family === "IPv4" && !iface.internal) {
          return iface.address;
        }
      }
    }
  } catch (error) {
    // If we can't get network interfaces, just use localhost
    console.warn("Could not determine local IP address:", error.message);
  }
  return "localhost";
}

const PORT = 3000;
const localIP = getLocalIP();

server.listen(PORT, "0.0.0.0", () => {
  console.log("=".repeat(60));
  console.log("LAN BUZZER SERVER RUNNING");
  console.log("=".repeat(60));
  console.log(`Local:   http://localhost:${PORT}`);
  console.log(`Network: http://${localIP}:${PORT}`);
  console.log(`Admin:   http://${localIP}:${PORT}/secret69`);
  console.log("=".repeat(60));
  console.log(`Admin Password: ${adminPassword}`);
  console.log("=".repeat(60));
  debugLog("Server started", { port: PORT, ip: localIP });
});
