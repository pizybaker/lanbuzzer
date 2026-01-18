# README.md

# LAN Buzzer

This project is a simple real-time application that allows users to "buzz in" and see who the winner is. It uses Node.js with Express and Socket.IO for real-time communication.

## Project Structure

```
lan-buzzer
├── public
│   ├── index.html       # Main entry point for the client-side application
│   ├── style.css       # Styles for the application
│   └── client.js       # Client-side JavaScript for WebSocket interaction
├── server.js           # Entry point for the server application
├── package.json        # npm configuration file
├── .gitignore          # Files and directories to be ignored by Git
└── README.md           # Documentation for the project
```

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   cd lan-buzzer
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   node server.js
   ```

4. Open your browser and navigate to `http://localhost:3000` to access the application.

## Usage

- Users can click the "buzz" button to signal their participation.
- The first user to buzz in will be declared the winner.
- The application can be reset to allow for a new round.

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.