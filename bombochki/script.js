const boardElement = document.getElementById("board");
const minesCountElement = document.getElementById("mines-count");
const messageElement = document.getElementById("message");

const rows = 10;
const cols = 10;
const minesCount = 15;
let board = [];
let gameOver = false;
let flags = 0;

function startGame() {
    boardElement.innerHTML = "";
    messageElement.textContent = "";
    board = [];
    gameOver = false;
    flags = 0;
    minesCountElement.textContent = minesCount;

    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < cols; c++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.r = r;
            cell.dataset.c = c;
            
            cell.addEventListener("click", clickCell);
            cell.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                addFlag(cell);
            });

            boardElement.appendChild(cell);
            row.push({
                element: cell,
                mine: false,
                revealed: false,
                flagged: false,
                count: 0
            });
        }
        board.push(row);
    }
    
    placeMines();
    calculateNumbers();
}

function placeMines() {
    let minesPlaced = 0;
    while (minesPlaced < minesCount) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * cols);
        if (!board[r][c].mine) {
            board[r][c].mine = true;
            minesPlaced++;
        }
    }
}

function calculateNumbers() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c].mine) continue;
            let count = 0;
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (r+i >= 0 && r+i < rows && c+j >= 0 && c+j < cols) {
                        if (board[r+i][c+j].mine) count++;
                    }
                }
            }
            board[r][c].count = count;
        }
    }
}

function clickCell() {
    if (gameOver) return;
    let r = parseInt(this.dataset.r);
    let c = parseInt(this.dataset.c);
    let cellData = board[r][c];

    if (cellData.flagged || cellData.revealed) return;

    if (cellData.mine) {
        gameOver = true;
        revealAllMines();
        messageElement.textContent = "Але то слутєк, агій";
        messageElement.style.color = "#e74c3c";
    } else {
        revealCell(r, c);
        checkWin();
    }
}

function revealCell(r, c) {
    if (r < 0 || r>=rows || c < 0 || c >= cols) return;
    let cellData = board[r][c];
    if (cellData.revealed || cellData.flagged) return;

    cellData.revealed = true;
    cellData.element.classList.add("revealed");

    if (cellData.count > 0) {
        cellData.element.textContent = cellData.count;
        cellData.element.classList.add(c${cellData.count});
    } else {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                revealCell(r + i, c + j);
            }
        }
    }
}

function addFlag(cell) {
    if (gameOver) return;
    let r = parseInt(cell.dataset.r);
    let c = parseInt(cell.dataset.c);
    let cellData = board[r][c];

    if (cellData.revealed) return;

    if (cellData.flagged) {
        cellData.flagged = false;
        cell.classList.remove("flag");
        cell.textContent = "";
        flags--;
    } else {
        cellData.flagged = true;
        cell.classList.add("flag");
        cell.textContent = "🚩";
        flags++;
    }
    minesCountElement.textContent = minesCount - flags;
}

function revealAllMines() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c].mine) {
                board[r][c].element.classList.add("mine");
                board[r][c].element.textContent = "💣";
            }
        }
    }
}

function checkWin() {
    let revealedCount = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c].revealed) revealedCount++;
        }
    }
    if (revealedCount === (rows * cols - minesCount)) {
        gameOver = true;
        messageElement.textContent = "Ніфіга собі ого";
        messageElement.style.color = "#2ecc71";
    }
}

startGame();