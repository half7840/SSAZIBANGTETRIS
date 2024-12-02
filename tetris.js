// 키 설정
const keyBindings = {
    left: 'ArrowLeft',   // 왼쪽 화살표
    right: 'ArrowRight', // 오른쪽 화살표
    rotate: 'ArrowUp',   // 위 화살표
    rotateAlt: 'KeyZ',   // Z 키로도 회전
    down: 'ArrowDown',   // 아래 화살표
    hardDrop: 'Space',   // 스페이스바 (즉시 내려가기)
    pause: 'KeyP',       // P키 (일시정지)
    restart: 'KeyR',     // R키 (게임 재시작)
    hold: 'KeyC'         // C키 (홀드 기능)
};

// 현재 게임 상태
let isPaused = false;
let isGameOver = false;
let holdPiece = null; // 홀드된 테트로미노

// 게임판과 점수 등 기타 변수들
const boardWidth = 10;
const boardHeight = 20;
let gameBoard = Array.from(Array(boardHeight), () => Array(boardWidth).fill(0));
let currentPiece, currentPosition, score = 0, linesCleared = 0, level = 1;
let gameInterval;

// 테트로미노 색상 매핑
const tetrominoColors = {
    I: 'cyan',
    O: 'yellow',
    T: 'purple',
    S: 'green',
    Z: 'red',
    L: 'orange',
    J: 'blue'
};

// 테트로미노 모양 정의
const tetrominoes = [
    { shape: [[1, 1, 1, 1]], color: 'I' },
    { shape: [[1, 1], [1, 1]], color: 'O' },
    { shape: [[0, 1, 0], [1, 1, 1]], color: 'T' },
    { shape: [[1, 1, 0], [0, 1, 1]], color: 'S' },
    { shape: [[0, 1, 1], [1, 1, 0]], color: 'Z' },
    { shape: [[1, 0, 0], [1, 1, 1]], color: 'L' },
    { shape: [[0, 0, 1], [1, 1, 1]], color: 'J' }
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

            // 색상 적용
            if (cell) {
                cellElement.style.backgroundColor = tetrominoColors[cell];
            } else {
                cellElement.style.backgroundColor = 'black';
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
                if (currentPosition.y + y >= 0) {
                    gameBoard[currentPosition.y + y][currentPosition.x + x] = currentPiece.color;
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
            isGameOver = true;
            clearInterval(gameInterval); // 게임 오버 시 게임 루프 종료
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

// 회전
function rotatePiece() {
    const newShape = currentPiece.shape[0].map((_, index) => currentPiece.shape.map(row => row[index])).reverse();
    const newPiece = { ...currentPiece, shape: newShape };
    currentPiece = newPiece;
    if (collision()) {
        currentPiece = { ...currentPiece, shape: currentPiece.shape.reverse() };
    }
}

// 홀드 기능
function holdCurrentPiece() {
    if (holdPiece === null) {
        holdPiece = currentPiece;
        currentPiece = randomTetromino();
        currentPosition = { x: 3, y: 0 };
    } else {
        const temp = currentPiece;
        currentPiece = holdPiece;
        holdPiece = temp;
        currentPosition = { x: 3, y: 0 };
    }
}

// 게임 시작
function startGame() {
    if (isGameOver) {
        // 게임이 끝났을 경우 초기화
        gameBoard = Array.from(Array(boardHeight), () => Array(boardWidth).fill(0));
        score = 0;
        linesCleared = 0;
        level = 1;
        isGameOver = false;
        holdPiece = null;
    }

    currentPiece = randomTetromino();
    currentPosition = { x: 3, y: 0 };
    isPaused = false;

    gameInterval = setInterval(() => {
        if (!isPaused) {
            moveDown();
            drawBoard();
            scoreElement.textContent = score;
            linesElement.textContent = linesCleared;
            levelElement.textContent = level;
        }
    }, 1000 / level);
}

// 게임 일시정지
function togglePause() {
    isPaused = !isPaused;
}

// 키보드 이벤트 처리
document.addEventListener('keydown', (event) => {
    if (isGameOver) return; // 게임이 끝나면 입력 무시

    switch (event.code) {
        case keyBindings.left:
            currentPosition.x--;
            if (collision()) currentPosition.x++;
            break;

        case keyBindings.right:
            currentPosition.x++;
            if (collision()) currentPosition.x--;
            break;

        case keyBindings.rotate:
        case keyBindings.rotateAlt:
            rotatePiece();
            break;

        case keyBindings.down:
            moveDown();
            break;

        case keyBindings.hardDrop:
            while (!collision()) currentPosition.y++;
            currentPosition.y--;
            placePiece();
            checkLines();
            currentPiece = randomTetromino();
            currentPosition = { x: 3, y: 0 };
            break;

        case keyBindings.pause:
            togglePause();
            break;

        case keyBindings.restart:
            clear
