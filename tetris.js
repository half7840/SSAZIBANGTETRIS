// Basic Tetris Game Setup
const boardWidth = 10;
const boardHeight = 20;
let gameBoard = Array.from(Array(boardHeight), () => Array(boardWidth).fill(0));
let currentPiece, currentPosition, score = 0, linesCleared = 0, level = 1;
let gameInterval;

const boardElement = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const linesElement = document.getElementById('lines-cleared');
const levelElement = document.getElementById('level');
const startButton = document.getElementById('start-btn');

// Tetromino Shapes
const tetrominoes = [
    [[1, 1, 1, 1]], // I
    [[1, 1], [1, 1]], // O
    [[0, 1, 0], [1, 1, 1]], // T
    [[1, 1, 0], [0, 1, 1]], // S
    [[0, 1, 1], [1, 1, 0]], // Z
    [[1, 0, 0], [1, 1, 1]], // L
    [[0, 0, 1], [1, 1, 1]]  // J
];

// Randomly pick a tetromino
function randomTetromino() {
    return tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
}

// Draw the game board
function drawBoard() {
    boardElement.innerHTML = '';
    gameBoard.forEach(row => {
        const rowElement = document.createElement('div');
        rowElement.style.display = 'flex';
        row.forEach(cell => {
            const cellElement = document.createElement('div');
            cellElement.style.width = '30px';
            cellElement.style.height = '30px';
            cellElement.style.border = '1px solid #333';
            cellElement.style.backgroundColor = cell ? 'red' : 'black';
            rowElement.appendChild(cellElement);
        });
        boardElement.appendChild(rowElement);
    });
}

// Place the piece on the board
function placePiece() {
    currentPiece.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell && currentPosition.y + y >= 0) {
                gameBoard[currentPosition.y + y][currentPosition.x + x] = 1;
            }
        });
    });
}

// Check for full lines
function checkLines() {
    gameBoard = gameBoard.filter(row => row.some(cell => cell === 0));
    const lines = boardHeight - gameBoard.length;
    if (lines > 0) {
        linesCleared += lines;
        score += lines * 100;
        level = Math.floor(linesCleared / 10) + 1;
        gameBoard = Array.from(Array(lines), () => Array(boardWidth).fill(0)).concat(gameBoard);
    }
}

// Move piece down
function moveDown() {
    currentPosition.y++;
    if (collision()) {
        currentPosition.y--;
        placePiece();
        checkLines();
        currentPiece = randomTetromino();
        currentPosition = { x: 3, y: 0 };
        if (collision()) {
            clearInterval(gameInterval);
            alert('Game Over');
        }
    }
}

// Check for collision
function collision() {
    return currentPiece.some((row, y) => {
        return row.some((cell, x) => {
            if (cell) {
                const newX = currentPosition.x + x;
                const newY = currentPosition.y + y;
                return newX < 0 || newX >= boardWidth || newY >= boardHeight || gameBoard[newY][newX];
            }
            return false;
        });
    });
}

// Start the game
function startGame() {
    gameBoard = Array.from(Array(boardHeight), () => Array(boardWidth).fill(0));
    score = 0;
    linesCleared = 0;
    level = 1;
    currentPiece = randomTetromino();
    currentPosition = { x: 3, y: 0 };
    gameInterval = setInterval(() => {
        moveDown();
        drawBoard();
        scoreElement.textContent = score;
        linesElement.textContent = linesCleared;
        levelElement.textContent = level;
    }, 1000 / level);
}

// Event Listener for Start Button
startButton.addEventListener('click', startGame);


// Basic Tetris Game Setup
const boardWidth = 10;
const boardHeight = 20;
let gameBoard = Array.from(Array(boardHeight), () => Array(boardWidth).fill(0));
let currentPiece, currentPosition, score = 0, linesCleared = 0, level = 1;
let gameInterval;

const boardElement = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const linesElement = document.getElementById('lines-cleared');
const levelElement = document.getElementById('level');
const startButton = document.getElementById('start-btn');

// Tetromino Shapes
const tetrominoes = [
    [[1, 1, 1, 1]], // I
    [[1, 1], [1, 1]], // O
    [[0, 1, 0], [1, 1, 1]], // T
    [[1, 1, 0], [0, 1, 1]], // S
    [[0, 1, 1], [1, 1, 0]], // Z
    [[1, 0, 0], [1, 1, 1]], // L
    [[0, 0, 1], [1, 1, 1]]  // J
];

// Randomly pick a tetromino
function randomTetromino() {
    return tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
}

// Draw the game board
function drawBoard() {
    boardElement.innerHTML = '';
    gameBoard.forEach(row => {
        const rowElement = document.createElement('div');
        rowElement.style.display = 'flex';
        row.forEach(cell => {
            const cellElement = document.createElement('div');
            cellElement.style.width = '30px';
            cellElement.style.height = '30px';
            cellElement.style.border = '1px solid #333';
            cellElement.style.backgroundColor = cell ? 'red' : 'black';
            rowElement.appendChild(cellElement);
        });
        boardElement.appendChild(rowElement);
    });
}

// Place the piece on the board
function placePiece() {
    currentPiece.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell && currentPosition.y + y >= 0) {
                gameBoard[currentPosition.y + y][currentPosition.x + x] = 1;
            }
        });
    });
}

// Check for full lines
function checkLines() {
    gameBoard = gameBoard.filter(row => row.some(cell => cell === 0));
    const lines = boardHeight - gameBoard.length;
    if (lines > 0) {
        linesCleared += lines;
        score += lines * 100;
        level = Math.floor(linesCleared / 10) + 1;
        gameBoard = Array.from(Array(lines), () => Array(boardWidth).fill(0)).concat(gameBoard);
    }
}

// Move piece down
function moveDown() {
    currentPosition.y++;
    if (collision()) {
        currentPosition.y--;
        placePiece();
        checkLines();
        currentPiece = randomTetromino();
        currentPosition = { x: 3, y: 0 };
        if (collision()) {
            clearInterval(gameInterval);
            alert('Game Over');
        }
    }
}

// Check for collision
function collision() {
    return currentPiece.some((row, y) => {
        return row.some((cell, x) => {
            if (cell) {
                const newX = currentPosition.x + x;
                const newY = currentPosition.y + y;
                return newX < 0 || newX >= boardWidth || newY >= boardHeight || gameBoard[newY][newX];
            }
            return false;
        });
    });
}

// Start the game
function startGame() {
    gameBoard = Array.from(Array(boardHeight), () => Array(boardWidth).fill(0));
    score = 0;
    linesCleared = 0;
    level = 1;
    currentPiece = randomTetromino();
    currentPosition = { x: 3, y: 0 };
    gameInterval = setInterval(() => {
        moveDown();
        drawBoard();
        scoreElement.textContent = score;
        linesElement.textContent = linesCleared;
        levelElement.textContent = level;
    }, 1000 / level);
}

// Event Listener for Start Button
startButton.addEventListener('click', startGame);

