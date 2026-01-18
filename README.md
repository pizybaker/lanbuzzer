# LAN Buzzer

A real-time buzzer application for local network quiz games and competitions.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **Access:**
   - Participants: `http://localhost:3000` or `http://YOUR_IP:3000`
   - Admin: `http://localhost:3000/secret69` (password: `admin123`)

## Features

- Real-time buzzing with instant winner detection
- Admin dashboard with lock/unlock controls
- Participant tracking and winner display
- Mobile-optimized full-screen buzzer button
- Desktop spacebar support
- No duplicate team names

## Setup

For detailed setup instructions including network configuration, see **[SETUP.md](SETUP.md)**.

## Configuration

- **Change Admin Password**: Edit `server.js` line 13
- **Change Port**: Edit `server.js` line 236 (default: 3000)

## Requirements

- Node.js (v14+)
- Express
- Socket.IO
- Local network/router
