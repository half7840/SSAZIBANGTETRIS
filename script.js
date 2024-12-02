const COLS = 10;
const ROWS = 20;
let board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
let score = 0;
let gameInterval;
const gameBoard = document.getElementById("game-board");
const scoreElement = document.getElementById("score");

// 테트리스 블록의 모양 (7가지 기본 블록)과 색상
const shapes = [
    { color: "#00FFFF", shape: [[1, 1, 1, 1]] },  // I형 (파란색)
    { color: "#FFFF00", shape: [[1, 1], [1, 1]] },  // O형 (노란색)
    { color: "#800080", shape: [[0, 1, 0], [1, 1, 1]] },  // T형 (보라색)
    { color: "#00FF00", shape: [[0, 1, 1], [1, 1, 0]] },  // S형 (초록색)
    { color: "#FF0000", shape: [[1, 1, 0], [0, 1, 1]] },  // Z형 (빨간색)
    { color: "#0000FF", shape: [[1, 0, 0], [1, 1, 1]] },  // J형 (파란색)
    { color: "#FFA500", shape: [[0, 0, 1], [1, 1, 1]] }   // L형 (주황색)
];

// 랜덤 블록 생성
function getRandomShape() {
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    return { ...shape, x: 4, y: 0 };  // x: 가운데, y: 최상단에서 시작
}

let currentShape = getRandomShape();

// 게임 보드에 그리기
function drawBoard() {
    gameBoard.innerHTML = "";
    board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const block = document.createElement("div");
            block.classList.add("block");
            if (cell) {
                block.style.backgroundColor = cell;  // 색상 적용
            } else {
                block.style.backgroundColor = "#111";  // 빈 칸은 배경색
            }
            gameBoard.appendChild(block);
        });
    });
}

// 현재 블록을 보드에 그리기
function drawShape() {
    currentShape.shape.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if (cell) {
                const x = currentShape.x + colIndex;
                const y = currentShape.y + rowIndex;
                if (y >= 0 && x >= 0 && x < COLS && y < ROWS) {
                    board[y][x] = currentShape.color;
                }
            }
        });
    });
}

// 블록 이동
function moveShape() {
    currentShape.y++;
    if (checkCollision()) {
        currentShape.y--;
        placeShape();
        clearFullLines();
        currentShape = getRandomShape();
        if (checkCollision()) {
            gameOver();
        }
    }
}

// 충돌 체크
function checkCollision() {
    return currentShape.shape.some((row, rowIndex) => {
        return row.some((cell, colIndex) => {
            if (cell) {
                const x = currentShape.x + colIndex;
                const y = currentShape.y + rowIndex;
                return x < 0 || x >= COLS || y >= ROWS || (y >= 0 && board[y][x]);
            }
            return false;
        });
    });
}

// 블록을 보드에 놓기
function placeShape() {
    currentShape.shape.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if (cell) {
                const x = currentShape.x + colIndex;
                const y = currentShape.y + rowIndex;
                if (y >= 0) {
                    board[y][x] = currentShape.color;
                }
            }
        });
    });
}

// 라인 삭제
function clearFullLines() {
    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row].every(cell => cell !== null)) {
            score += 100;
            board.splice(row, 1);
            board.unshift(Array(COLS).fill(null));
            updateScore();
        }
    }
}

// 점수 업데이트
function updateScore() {
    scoreElement.textContent = `점수: ${score}`;
}

// 게임 오버
function gameOver() {
    clearInterval(gameInterval);
    alert("게임 오버!");
}

// 방향키 이벤트 처리
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
        currentShape.x--;
        if (checkCollision()) currentShape.x++;
    } else if (e.key === "ArrowRight") {
        currentShape.x++;
        if (checkCollision()) currentShape.x--;
    } else if (e.key === "ArrowDown") {
        moveShape();
    } else if (e.key === "ArrowUp") {
        rotateShape();
    }
});

// 회전 함수
function rotateShape() {
    const newShape = rotateMatrix(currentShape.shape);
    const oldShape = currentShape.shape;
    currentShape.shape = newShape;
    if (checkCollision()) {
        currentShape.shape = oldShape;
    }
}

// 행렬 회전 함수
function rotateMatrix(matrix) {
    return matrix[0].map((_, index) => matrix.map(row => row[index])).reverse();
}

// 게임 시작
function startGame() {
    gameInterval = setInterval(() => {
        drawBoard();
        drawShape();
        moveShape();
    }, 500); // 0.5초마다 블록을 한 칸씩 내림
}

startGame();
