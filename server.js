const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let players = {};  // Globalny obiekt przechowujący graczy i ich punkty
let playerSockets = {};  // Przechowuje powiązanie między nazwami graczy a ich socketami

// Służy do obsługi statycznych plików (HTML, CSS, JS)
app.use(express.static('public'));

// Obsługa połączenia z Socket.IO
io.on('connection', (socket) => {
    console.log('Nowe połączenie: ', socket.id);

    // Obsługa dołączenia nowego gracza
    socket.on('newPlayer', (playerName) => {
        if (!players[playerName]) {
            players[playerName] = 0;  // Dodaj gracza z zerowymi punktami
            playerSockets[playerName] = socket.id;  // Zapisz ID socketu dla tego gracza
        }
        io.emit('updateLeaderboard', players);  // Wyślij zaktualizowany ranking do wszystkich
    });

    // Obsługa dodania punktów dla gracza, który wprowadza imię innego gracza
    socket.on('addPoint', (playerName, inputName) => {
        if (players[inputName] !== undefined && playerName !== inputName) {
            players[playerName]++;  // Gracz, który wpisał poprawne imię, zdobywa punkt

            // Wyślij zaktualizowany ranking do wszystkich
            io.emit('updateLeaderboard', players);

            // Informuj wszystkich graczy, że punkt został przyznany
            io.emit('pointAwarded', playerName);  // Wysyłamy informację do wszystkich klientów
            
            // Wyślij informację o trafieniu tylko do trafionego gracza
            const hitSocketId = playerSockets[inputName];
            if (hitSocketId) {
                io.to(hitSocketId).emit('playerHit', inputName);  // Emitujemy zdarzenie tylko do trafionego gracza
                console.log(`${inputName} został trafiony!`); // Debugowanie
            }
        }
    });

    // Obsługa resetu rankingu
    socket.on('resetLeaderboard', () => {
        console.log('Ranking został zresetowany!');
        players = {};  // Resetujemy punkty wszystkich graczy, ustawiając pusty obiekt
        io.emit('updateLeaderboard', players);  // Wyślij zaktualizowany ranking do wszystkich klientów
    });

    // Obsługa odłączenia gracza
    socket.on('disconnect', () => {
        console.log('Użytkownik rozłączył się: ', socket.id);
        for (const playerName in playerSockets) {
            if (playerSockets[playerName] === socket.id) {
                delete players[playerName];  // Usuń gracza z listy
                delete playerSockets[playerName];  // Usuń gracza z powiązania socketów
                io.emit('updateLeaderboard', players);  // Wyślij zaktualizowany ranking do wszystkich
                break;
            }
        }
    });
});

// Uruchomienie serwera
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Serwer działa na porcie ${PORT}`));
