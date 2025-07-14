// Game State
let gameState = {
    board: ['', '', '', '', '', '', '', '', ''],
    currentPlayer: 'X',
    gameMode: '', // 'pvp' or 'pvc'
    aiDifficulty: '',
    gameActive: false,
    scores: {
        player1: 0,
        player2: 0,
        draws: 0,
        gamesPlayed: 0
    }
};

// DOM Elements
const modeSelection = document.getElementById('modeSelection');
const difficultySelection = document.getElementById('difficultySelection');
const gameArea = document.getElementById('gameArea');
const winnerModal = document.getElementById('winnerModal');

const pvpModeBtn = document.getElementById('pvpMode');
const pvcModeBtn = document.getElementById('pvcMode');
const difficultyBtns = document.querySelectorAll('.diff-btn');

const gameBoard = document.getElementById('gameBoard');
const cells = document.querySelectorAll('.cell');
const statusMessage = document.getElementById('statusMessage');
const turnText = document.getElementById('turnText');
const turnSymbol = document.getElementById('turnSymbol');

const player1Name = document.getElementById('player1Name');
const player2Name = document.getElementById('player2Name');
const player1Score = document.getElementById('player1Score');
const player2Score = document.getElementById('player2Score');

const resetGameBtn = document.getElementById('resetGame');
const newGameBtn = document.getElementById('newGame');
const changeModeBtn = document.getElementById('changeMode');

const winnerSymbol = document.getElementById('winnerSymbol');
const winnerText = document.getElementById('winnerText');
const winnerSubtext = document.getElementById('winnerSubtext');
const playAgainBtn = document.getElementById('playAgain');
const backToMenuBtn = document.getElementById('backToMenu');

const statsElements = {
    gamesPlayed: document.getElementById('gamesPlayed'),
    player1Wins: document.getElementById('player1Wins'),
    player2Wins: document.getElementById('player2Wins'),
    draws: document.getElementById('draws')
};

// Winning combinations
const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
];

// Initialize game
function initGame() {
    loadGameStats();
    updateStatsDisplay();
    
    // Event listeners for mode selection
    pvpModeBtn.addEventListener('click', () => selectMode('pvp'));
    pvcModeBtn.addEventListener('click', () => selectMode('pvc'));
    
    // Event listeners for difficulty selection
    difficultyBtns.forEach(btn => {
        btn.addEventListener('click', () => selectDifficulty(btn.dataset.level));
    });
    
    // Event listeners for game controls
    resetGameBtn.addEventListener('click', resetGame);
    newGameBtn.addEventListener('click', newGame);
    changeModeBtn.addEventListener('click', backToModeSelection);
    playAgainBtn.addEventListener('click', newGame);
    backToMenuBtn.addEventListener('click', backToModeSelection);
    
    // Event listeners for game board
    cells.forEach((cell, index) => {
        cell.addEventListener('click', () => makeMove(index));
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboard);
}

// Mode selection
function selectMode(mode) {
    gameState.gameMode = mode;
    
    if (mode === 'pvp') {
        player2Name.textContent = 'Player 2';
        startGame();
    } else {
        player2Name.textContent = 'AI';
        showDifficultySelection();
    }
}

function showDifficultySelection() {
    modeSelection.classList.add('hidden');
    difficultySelection.classList.remove('hidden');
}

function selectDifficulty(level) {
    gameState.aiDifficulty = level;
    startGame();
}

// Start game
function startGame() {
    modeSelection.classList.add('hidden');
    difficultySelection.classList.add('hidden');
    gameArea.classList.remove('hidden');
    
    resetBoard();
    gameState.gameActive = true;
    updateTurnDisplay();
    updateStatusMessage("Game started! Make your move!");
}

// Reset board
function resetBoard() {
    gameState.board = ['', '', '', '', '', '', '', '', ''];
    gameState.currentPlayer = 'X';
    
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('filled', 'winning');
    });
}

// Make move
function makeMove(index) {
    if (!gameState.gameActive || gameState.board[index] !== '') {
        return;
    }
    
    // Player move
    gameState.board[index] = gameState.currentPlayer;
    cells[index].textContent = gameState.currentPlayer === 'X' ? '❌' : '⭕';
    cells[index].classList.add('filled');
    
    // Add move sound effect
    playMoveSound();
    
    // Check for win or draw
    if (checkWin()) {
        endGame('win');
        return;
    }
    
    if (checkDraw()) {
        endGame('draw');
        return;
    }
    
    // Switch player
    gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';
    updateTurnDisplay();
    
    // AI move if in PvC mode
    if (gameState.gameMode === 'pvc' && gameState.currentPlayer === 'O') {
        setTimeout(() => {
            makeAIMove();
        }, 500); // Delay for better UX
    }
}

// AI Move
function makeAIMove() {
    if (!gameState.gameActive) return;
    
    let moveIndex;
    
    switch (gameState.aiDifficulty) {
        case 'easy':
            moveIndex = getRandomMove();
            break;
        case 'medium':
            moveIndex = getMediumMove();
            break;
        case 'hard':
            moveIndex = getBestMove();
            break;
    }
    
    if (moveIndex !== -1) {
        makeMove(moveIndex);
    }
}

// AI Difficulty Implementations
function getRandomMove() {
    const availableMoves = gameState.board
        .map((cell, index) => cell === '' ? index : null)
        .filter(val => val !== null);
    
    return availableMoves.length > 0 
        ? availableMoves[Math.floor(Math.random() * availableMoves.length)]
        : -1;
}

function getMediumMove() {
    // 50% chance to make optimal move, 50% random
    return Math.random() < 0.5 ? getBestMove() : getRandomMove();
}

function getBestMove() {
    // Try to win first
    for (let i = 0; i < 9; i++) {
        if (gameState.board[i] === '') {
            gameState.board[i] = 'O';
            if (checkWinForPlayer('O')) {
                gameState.board[i] = '';
                return i;
            }
            gameState.board[i] = '';
        }
    }
    
    // Block player win
    for (let i = 0; i < 9; i++) {
        if (gameState.board[i] === '') {
            gameState.board[i] = 'X';
            if (checkWinForPlayer('X')) {
                gameState.board[i] = '';
                return i;
            }
            gameState.board[i] = '';
        }
    }
    
    // Take center if available
    if (gameState.board[4] === '') {
        return 4;
    }
    
    // Take corners
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(corner => gameState.board[corner] === '');
    if (availableCorners.length > 0) {
        return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }
    
    // Take any available move
    return getRandomMove();
}

// Check win
function checkWin() {
    return winningCombinations.some(combination => {
        const [a, b, c] = combination;
        if (gameState.board[a] && 
            gameState.board[a] === gameState.board[b] && 
            gameState.board[a] === gameState.board[c]) {
            
            // Highlight winning cells
            cells[a].classList.add('winning');
            cells[b].classList.add('winning');
            cells[c].classList.add('winning');
            
            return true;
        }
        return false;
    });
}

function checkWinForPlayer(player) {
    return winningCombinations.some(combination => {
        const [a, b, c] = combination;
        return gameState.board[a] === player && 
               gameState.board[b] === player && 
               gameState.board[c] === player;
    });
}

// Check draw
function checkDraw() {
    return gameState.board.every(cell => cell !== '');
}

// End game
function endGame(result) {
    gameState.gameActive = false;
    
    if (result === 'win') {
        const winner = gameState.currentPlayer;
        const winnerName = winner === 'X' ? 'Player 1' : 
                          (gameState.gameMode === 'pvp' ? 'Player 2' : 'AI');
        
        // Update scores
        if (winner === 'X') {
            gameState.scores.player1++;
        } else {
            gameState.scores.player2++;
        }
        
        updateStatusMessage(`${winnerName} wins! 🎉`);
        showWinnerModal(winnerName, winner);
        playWinSound();
        
    } else {
        gameState.scores.draws++;
        updateStatusMessage("It's a draw! 🤝");
        showWinnerModal("It's a Draw!", '🤝');
        playDrawSound();
    }
    
    gameState.scores.gamesPlayed++;
    updateStatsDisplay();
    saveGameStats();
}

// Show winner modal
function showWinnerModal(winner, symbol) {
    winnerText.textContent = winner === "It's a Draw!" ? winner : `${winner} Wins!`;
    winnerSymbol.textContent = symbol === 'X' ? '❌' : symbol === 'O' ? '⭕' : symbol;
    
    if (winner === "It's a Draw!") {
        winnerSubtext.textContent = "Good game! Try again for a winner!";
    } else {
        winnerSubtext.textContent = "Congratulations on your victory!";
    }
    
    winnerModal.classList.remove('hidden');
}

// Update displays
function updateTurnDisplay() {
    const currentPlayerName = gameState.currentPlayer === 'X' ? 'Player 1' : 
                             (gameState.gameMode === 'pvp' ? 'Player 2' : 'AI');
    const currentSymbol = gameState.currentPlayer === 'X' ? '❌' : '⭕';
    
    turnText.textContent = `${currentPlayerName}'s Turn`;
    turnSymbol.textContent = currentSymbol;
}

function updateStatusMessage(message) {
    statusMessage.textContent = message;
}

function updateStatsDisplay() {
    player1Score.textContent = gameState.scores.player1;
    player2Score.textContent = gameState.scores.player2;
    
    statsElements.gamesPlayed.textContent = gameState.scores.gamesPlayed;
    statsElements.player1Wins.textContent = gameState.scores.player1;
    statsElements.player2Wins.textContent = gameState.scores.player2;
    statsElements.draws.textContent = gameState.scores.draws;
}

// Game controls
function resetGame() {
    resetBoard();
    gameState.gameActive = true;
    updateTurnDisplay();
    updateStatusMessage("Board reset! Make your move!");
}

function newGame() {
    winnerModal.classList.add('hidden');
    resetGame();
}

function backToModeSelection() {
    gameArea.classList.add('hidden');
    difficultySelection.classList.add('hidden');
    winnerModal.classList.add('hidden');
    modeSelection.classList.remove('hidden');
    
    gameState.gameActive = false;
}

// Keyboard controls
function handleKeyboard(event) {
    if (!gameState.gameActive) return;
    
    const keyMap = {
        'Digit1': 0, 'Digit2': 1, 'Digit3': 2,
        'Digit4': 3, 'Digit5': 4, 'Digit6': 5,
        'Digit7': 6, 'Digit8': 7, 'Digit9': 8
    };
    
    if (keyMap.hasOwnProperty(event.code)) {
        makeMove(keyMap[event.code]);
    }
    
    if (event.code === 'KeyR') {
        resetGame();
    }
}

// Sound effects
function playMoveSound() {
    playSound(600, 100);
}

function playWinSound() {
    playSound(800, 200);
    setTimeout(() => playSound(1000, 200), 200);
    setTimeout(() => playSound(1200, 300), 400);
}

function playDrawSound() {
    playSound(400, 500);
}

function playSound(frequency, duration) {
    if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
        const audioContext = new (AudioContext || webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration / 1000);
    }
}

// Local storage
function saveGameStats() {
    localStorage.setItem('ticTacToeStats', JSON.stringify(gameState.scores));
}

function loadGameStats() {
    const savedStats = localStorage.getItem('ticTacToeStats');
    if (savedStats) {
        gameState.scores = { ...gameState.scores, ...JSON.parse(savedStats) };
    }
}

// Touch gestures for mobile
let touchStartX = 0;
let touchStartY = 0;

gameBoard.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

gameBoard.addEventListener('touchend', (e) => {
    if (!touchStartX || !touchStartY) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    
    // Reset if gesture is too small
    if (Math.abs(diffX) < 30 && Math.abs(diffY) < 30) {
        touchStartX = 0;
        touchStartY = 0;
        return;
    }
    
    // Double tap to reset (simple implementation)
    const now = new Date().getTime();
    const timeSince = now - (gameBoard.lastTap || 0);
    
    if (timeSince < 300) {
        resetGame();
    }
    
    gameBoard.lastTap = now;
    touchStartX = 0;
    touchStartY = 0;
});

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);

// Add visual feedback for mobile
cells.forEach(cell => {
    cell.addEventListener('touchstart', () => {
        if (!cell.classList.contains('filled')) {
            cell.style.transform = 'scale(0.95)';
        }
    });
    
    cell.addEventListener('touchend', () => {
        cell.style.transform = '';
    });
});

// Prevent zoom on double tap for mobile
document.addEventListener('touchend', (e) => {
    const now = new Date().getTime();
    const timeSince = now - (document.lastTap || 0);
    
    if (timeSince < 300) {
        e.preventDefault();
    }
    
    document.lastTap = now;
});

// Auto-save game state
setInterval(() => {
    if (gameState.gameActive) {
        saveGameStats();
    }
}, 5000);