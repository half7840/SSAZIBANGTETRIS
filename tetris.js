// 테트로미노 색상 매핑
const tetrominoColors = {
    I: 'cyan',    // I형은 cyan
    O: 'yellow',  // O형은 yellow
    T: 'purple',  // T형은 purple
    S: 'green',   // S형은 green
    Z: 'red',     // Z형은 red
    L: 'orange',  // L형은 orange
    J: 'blue'     // J형은 blue
};

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

// 테트로미노 모양 정의
const tetrominoes = [
    { shape: [[1, 1, 1, 1]], color: 'I' },   // I형
    { shape: [[1, 1], [1, 1]], color: 'O' }, // O형
    { shape: [[0, 1, 0], [1, 1, 1]], color: 'T' }, // T형
    { shape: [[1, 1, 0], [0, 1, 1]], color: 'S' }, // S형
    { shape: [[0, 1, 1], [1, 1, 0]], color: 'Z' }, // Z형
    { shape: [[1, 0, 0], [1, 1, 1]], color: 'L' }, // L형
    { shape: [[0, 0, 1], [1, 1, 1]], color: 'J' }  // J형
];

// 랜덤으로 테트로미노 반환
function randomTetromino() {
    const randIndex = Math.floor(Math.random() * tetrominoes.length);
    return tetrominoes[randIndex];
}

// 게임판 그리기
function drawBoard() {
    boardElement.innerHTML = '';  // 기존 내용 초기화
    gameBoard.forEach(row => {
        const rowElement = document.createElement('div');
        rowElement.style.display = 'flex';
        row.forEach(cell => {
            const cellElement = document.createElement('div');
            cellElement.style.width = '30px';
            cellElement.style.height = '30px';
            cellElement.style.border = '1px solid #333';

            // 색상 적용 (블록이 있으면 색상을 지정)
            if (cell) {
                cellElement.style.backgroundColor = tetrominoColors[cell]; // 색상 적용
            } else {
                cellElement.style.backgroundColor = 'black'; // 빈 셀은 검정색
            }

            rowElement.appendChild(cellElement);
        });
        boardElement.appendChild(rowElement);
    });
}

// 블록을 게임판에 배치
function placePiece() {
    currentPiece.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell) {
                // 현재 블록 색상 적용
                const color = tetrominoColors[currentPiece.color];
                if (currentPosition.y + y >= 0) {
                    gameBoard[currentPosition.y + y][currentPosition.x + x] = currentPiece.color; // 색상으로 저장
                }
            }
        });
    });
}

// 라인 검사 및 점수 업데이트
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

// 아래로 블록 이동
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

// 충돌 검사
function collision() {
    return currentPiece.shape.some((row, y) => {
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

// 게임 시작
function startGame() {
    gameBoard = Array.from(Array(boardHeight), () => Array(boardWidth).fill(0)); // 빈 보드로 초기화
    score = 0;
    linesCleared = 0;
    level = 1;
    currentPiece = randomTetromino(); // 랜덤 테트로미노 생성
    currentPosition = { x: 3, y: 0 };
    gameInterval = setInterval(() => {
        moveDown();
        drawBoard();
        scoreElement.textContent = score;
        linesElement.textContent = linesCleared;
        levelElement.textContent = level;
    }, 1000 / level);
}

// 시작 버튼 클릭 시 게임 시작
startButton.addEventListener('click', startGame);
