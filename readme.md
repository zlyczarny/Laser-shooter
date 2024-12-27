
Description

This is a multiplayer game where players scan names of different players. Each player enters their name at the start and earns points by scanning the names of other players.

Players whose names are guessed see a red screen hit effect.

The leaderboard updates in real time.

The game supports leaderboard reset and features a cooldown mechanism to prevent spamming.

Features

Add players: Players can enter their names to join the game.

Scoring: Earn points by correctly guessing another player’s name.

Hit effect: A visual effect is displayed for players who get hit.

Leaderboard: A real-time scoreboard displays player points.

Leaderboard reset: Allows resetting the leaderboard via a button.

Technologies

Frontend: HTML, CSS, JavaScript

Backend: Node.js with Socket.IO

Real-time Communication: Socket.IO

Installation

1. Prerequisites

Before installation, ensure you have:

Node.js (recommended version: 18 or higher)

npm (Node Package Manager, included with Node.js)

Installing Node.js and npm

sudo apt install -y nodejs

npm init -y
npm install express socket.io

To start game server:
node server.js


Game Instructions

Open the game in your browser.

Enter your name and press Enter to join the game.

Use the text input to guess the names of other players and earn points.

Monitor the leaderboard to track your rank.