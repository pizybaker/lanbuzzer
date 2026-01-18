# LAN Buzzer

A real-time buzzer system for quiz competitions that works over a local area network.

## Features

- Real-time buzzing using WebSocket (Socket.IO)
- First person to buzz locks out others
- Reset functionality for the host
- Works across devices on the same LAN

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
node server.js
```

3. Find your local IP address:
   - **Mac/Linux**: `ifconfig` or `ip addr`
   - **Windows**: `ipconfig`

4. Access the buzzer:
   - On the host machine: `http://localhost:3000`
   - On other devices: `http://<YOUR_IP>:3000`

## Usage

1. Enter your name in the input field
2. Click the "BUZZ" button to buzz in
3. The first person to buzz will be displayed as the winner
4. Click "Reset" to clear and start a new round
