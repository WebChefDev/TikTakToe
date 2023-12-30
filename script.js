let cells = document.querySelectorAll(".cell");
let currentPlayer = "X";
let board = Array(9).fill("");
let isGameOver = false;
const resetButton = document.getElementById("resetButton");
const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

cells.forEach(cell => {
    cell.addEventListener("click", function(e) {
        if (cell.textContent === "" && !isGameOver) {
            cell.textContent = currentPlayer;
            board[cell.dataset.index] = currentPlayer;

            if (checkWinner(currentPlayer)) {
                showModal(`${currentPlayer} Wins!`);
                isGameOver = true;
            } else if (board.every(cell => cell !== "")) {
                showModal("It's a draw!");
                isGameOver = true;
            } else if (currentPlayer === "X") {
                currentPlayer = "O";
                makeAiMove();
            }
        }
    });
});

function checkWinner(player) {
    return winningCombos.some(combination => {
        return combination.every(index => {
            return board[index] === player;
        });
    });
}

function makeAiMove() {
    let bestMove = minimax(board, "O").index;
    board[bestMove] = "O";
    cells[bestMove].textContent = "O";

    if (checkWinner("O")) {
        showModal(`O Wins!`);
        isGameOver = true;
    } else if (board.every(cell => cell !== "")) {
        showModal("It's a draw!");
        isGameOver = true;
    } else {
        currentPlayer = "X";
    }
}

function minimax(newBoard, player) {
    const availableMoves = getAvailableMoves(newBoard);

    if (checkWinner("O")) {
        return { score: -10 };
    } else if (checkWinner("X")) {
        return { score: 10 };
    } else if (availableMoves.length === 0) {
        return { score: 0 };
    }

    let moves = [];
    for (let i = 0; i < availableMoves.length; i++) {
        let move = {};
        move.index = availableMoves[i];
        newBoard[availableMoves[i]] = player;

        if (player === "X") {
            let g = minimax(newBoard, "O");
            move.score = g.score;
        } else {
            let g = minimax(newBoard, "X");
            move.score = g.score;
        }

        newBoard[availableMoves[i]] = "";
        moves.push(move);
    }

    let bestMove;
    if (player === "X") {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}

function getAvailableMoves(board) {
    let moves = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") moves.push(i);
    }
    return moves;
}

function resetGame() {
    board = Array(9).fill("");
    cells.forEach(cell => {
        cell.textContent = "";
    });
    currentPlayer = "X";
    isGameOver = false;
    modal.style.display = "none"; 
}

resetButton.addEventListener("click", resetGame);
var modal = document.getElementById("gameModal");
var span = document.getElementsByClassName("close-btn")[0];

function showModal(message) {
    document.getElementById("modalMessage").textContent = message;
    modal.style.display = "block";
}

span.onclick = function() {
    modal.style.display = "none";
}


