const socket = io();  // Połączenie z serwerem Socket.IO

let currentPlayer = "";
let isCooldown = false;  // Zmienna do śledzenia stanu cooldown

// Gdy strona jest w pełni załadowana, ustaw focus na polu imienia
document.addEventListener("DOMContentLoaded", () => {
    const nameInputField = document.getElementById("name");
    nameInputField.focus();

    // Obsługa zatwierdzenia imienia gracza przyciskiem Enter
    nameInputField.addEventListener("keydown", (event) => {
        if (event.key === 'Enter') {
            startGame();
        }
    });

    // Obsługa resetu rankingu po kliknięciu w przycisk resetu
    const resetButton = document.getElementById("resetLeaderboard");
    resetButton.addEventListener("click", () => {
        socket.emit('resetLeaderboard');  // Wysyła zdarzenie do serwera
    });
});

// Funkcja startu gry - dodawanie gracza do gry
function startGame() {
    const nameInput = document.getElementById("name").value.trim();  // Pobranie imienia gracza

    if (nameInput) {
        currentPlayer = nameInput;

        // Wysyłamy nowe imię gracza na serwer
        socket.emit('newPlayer', currentPlayer);

        // Ukryj sekcję z wprowadzaniem imienia i pokaż sekcję z grą
        document.getElementById("playerInput").classList.add("hidden");
        document.getElementById("gameSection").classList.remove("hidden");

        // Skupienie kursora na polu do wprowadzania imienia innego gracza
        document.getElementById("playerNameInput").focus();
    }
}

// Funkcja do potwierdzania imienia innego gracza
function submitPlayerName() {
    if (isCooldown) return;  // Jeśli cooldown jest aktywny, nie pozwól na zdobycie punktu

    const input = document.getElementById("playerNameInput").value.trim();  // Pobranie imienia innego gracza

    if (input && input !== currentPlayer) {  // Sprawdzenie, czy gracz nie wpisuje swojego imienia
        socket.emit('addPoint', currentPlayer, input);  // Wysyłamy gracza, który wpisuje imię oraz wprowadzone imię
        document.getElementById("playerNameInput").value = "";  // Wyczyść pole tekstowe
        document.getElementById("playerNameInput").focus();  // Ponownie skup kursor na polu tekstowym

        // Pokaż ikonę cooldown i ustaw cooldown na 5 sekund
        isCooldown = true;
        document.getElementById("cooldownSpinner").classList.remove("hidden");

        setTimeout(() => {
            isCooldown = false;  // Po 5 sekundach wyłącz cooldown
            document.getElementById("cooldownSpinner").classList.add("hidden");  // Ukryj ikonę cooldown
        }, 5000);
    }
}

// Obsługa potwierdzenia imienia po kliknięciu w przycisk
document.getElementById("submitName").addEventListener("click", () => {
    submitPlayerName();
});

// Obsługa potwierdzenia imienia po naciśnięciu klawisza Enter
document.getElementById("playerNameInput").addEventListener("keydown", (event) => {
    if (event.key === 'Enter') {
        submitPlayerName();
    }
});

// Odbieranie zaktualizowanego rankingu z serwera
socket.on('updateLeaderboard', (players) => {
    const leaderboard = document.getElementById("leaderboard");
    leaderboard.innerHTML = "";  // Wyczyść ranking przed aktualizacją

    const sortedPlayers = Object.keys(players).sort((a, b) => players[b] - players[a]);

    // Dodanie graczy do rankingu
    sortedPlayers.forEach((player, index) => {
        const li = document.createElement("li");
        li.textContent = `${index + 1}. ${player}: ${players[player]} Kills`; // Dodaj miejsce
        leaderboard.appendChild(li);
    });
});

// Odtwarzanie dźwięku przy zdobyciu punktu
socket.on('pointAwarded', (player) => {
    if (player === currentPlayer) {
        const bongoSound = document.getElementById("bongoSound");
        bongoSound.currentTime = 0; // Przewiń dźwięk do początku
        bongoSound.play(); // Odtwórz dźwięk
    }
});

// Obsługa efektu trafienia
socket.on('playerHit', (player) => {
    console.log(`${player} został trafiony!`); // Debugowanie
    if (player === currentPlayer) {  // Sprawdź, czy aktualny gracz został trafiony
        showHitEffect();
    }
});

// Funkcja pokazująca efekt trafienia
function showHitEffect() {
    const hitEffect = document.getElementById("hitEffect");
    hitEffect.classList.add("active"); // Dodaj klasę 'active' by pokazać efekt

    // Ukryj efekt po 5 sekundy
    setTimeout(() => {
        hitEffect.classList.remove("active");
    }, 5000);
}

// Obsługa kliknięcia przycisku resetu rankingu
document.getElementById("resetLeaderboard").addEventListener("click", () => {
    socket.emit('resetLeaderboard');  // Wyślij żądanie resetu do serwera
});
