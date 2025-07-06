const gameBoard = (() => {
    let board = [
        ['-', '-', '-'],
        ['-', '-', '-'],
        ['-', '-', '-']
    ];

    const boardCheck = () => {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === '-')
                    return false;
            }
        }
        return true;
    };

    const printBoard = () => {
        const gameBoardElement = document.getElementById('game-board');
        gameBoardElement.innerHTML = '';
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.textContent = board[i][j];
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.addEventListener('click', () => {
                    const index = { row: i, col: j };
                    gameFlow.handleCellClick(index);
                });
                gameBoardElement.appendChild(cell);
            }
        }
    };

    const updateBoard = (index, marker) => {
        if (board[index.row][index.col] === '-') {
            board[index.row][index.col] = marker;
            printBoard();
            return true;
        } else {
            alert("Place already taken! Input again!");
            return false;
        }
    };

    const resetBoard = () => {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                board[i][j] = '-';
            }
        }
        printBoard();
    };

    const checkWin = (marker) => {
        const combs = [
            [[0, 0], [0, 1], [0, 2]],
            [[1, 0], [1, 1], [1, 2]],
            [[2, 0], [2, 1], [2, 2]],
            [[0, 0], [1, 0], [2, 0]],
            [[0, 1], [1, 1], [2, 1]],
            [[0, 2], [1, 2], [2, 2]],
            [[0, 0], [1, 1], [2, 2]],
            [[0, 2], [1, 1], [2, 0]],
        ];

        return combs.some(combo =>
            board[combo[0][0]][combo[0][1]] === marker &&
            board[combo[1][0]][combo[1][1]] === marker &&
            board[combo[2][0]][combo[2][1]] === marker
        );
    };

    const gameCheck = (marker) => {
        const winflag = checkWin(marker);
        const drawflag = boardCheck();
        if (drawflag && !winflag) {
            alert("GAME ENDED IN DRAW!");
            gameFlow.updateHistory("Draw");
            return true;
        } else if (winflag) {
            const winner = gameFlow.getPlayerTurn();
            alert(`Winner is ${winner.name}!`);
            gameFlow.updateHistory(`${winner.name} won`);
            gameFlow.updateScores(winner);
            return true;
        }
        return false;
    };

    return { printBoard, updateBoard, resetBoard, gameCheck };
})();

const Player = (name, marker) => ({ name, marker });

const gameFlow = (() => {
    let player1, player2, turnFlag = false;
    let history = [];
    let scores = { player1: 0, player2: 0 };

    const getPlayerTurn = () => turnFlag ? player2 : player1;

    const forceTurnflag = () => {
        turnFlag = !turnFlag;
        updateCurrentPlayerDisplay();
    };

    const updateScores = (winner) => {
        if (winner === player1) {
            scores.player1++;
            document.getElementById('player1-score').textContent = scores.player1;
        } else if (winner === player2) {
            scores.player2++;
            document.getElementById('player2-score').textContent = scores.player2;
        }
    };

    const handleCellClick = (index) => {
        const currentPlayer = getPlayerTurn();
        const success = gameBoard.updateBoard(index, currentPlayer.marker);
        if (success) {
            const gameOver = gameBoard.gameCheck(currentPlayer.marker);
            if (!gameOver) {
                forceTurnflag();
            }
        }
    };

    const updateCurrentPlayerDisplay = () => {
    const currentPlayer = getPlayerTurn();
    const currentPlayerElement = document.getElementById('current-player');
    if (currentPlayerElement) {
        currentPlayerElement.textContent = `${currentPlayer.name} (${currentPlayer.marker})`;
    }
    };


    const updateHistory = (result) => {
        history.unshift(result);
        const historyList = document.getElementById('history-list');
        historyList.innerHTML = history.map(item => `<li>${item}</li>`).join('');
    };

    const setupMarkerButtons = () => {
        document.querySelectorAll('.marker-choice').forEach(button => {
            button.addEventListener('click', function() {
                const playerSection = this.closest('div');
                playerSection.querySelectorAll('.marker-choice').forEach(btn => {
                    btn.classList.remove('selected');
                });
                this.classList.add('selected');
            });
        });
    };

    const playerDetails = () => {
        const player1Name = document.getElementById('player1-name').value || 'Player 1';
        const player2Name = document.getElementById('player2-name').value || 'Player 2';

        const player1MarkerButton = document.querySelector('#player1-card .marker-choice.selected');
        const player2MarkerButton = document.querySelector('#player2-card .marker-choice.selected');

        if (!player1MarkerButton || !player2MarkerButton) {
            alert("Both players must choose a marker!");
            return false;
        }

        const player1Marker = player1MarkerButton.dataset.marker;
        const player2Marker = player2MarkerButton.dataset.marker;

        if (player1Marker === player2Marker) {
            alert("Players must choose different markers!");
            return false;
        }

        player1 = Player(player1Name, player1Marker);
        player2 = Player(player2Name, player2Marker);

        document.getElementById('player1-name-label').textContent = player1.name;
        document.getElementById('player1-marker').textContent = player1.marker;
        document.getElementById('player2-name-label').textContent = player2.name;
        document.getElementById('player2-marker').textContent = player2.marker;

        return true;
    };

    document.getElementById('start-game').addEventListener('click', () => {
        if (playerDetails()) {
            gameBoard.resetBoard();
            updateCurrentPlayerDisplay();
        }
    });

    document.getElementById('reset-button').addEventListener('click', () => {
        gameBoard.resetBoard();
        updateCurrentPlayerDisplay();
    });

    setupMarkerButtons();

    return { handleCellClick, forceTurnflag, getPlayerTurn, updateHistory, updateScores};
})();

document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('input[type="text"]');
    const startButton = document.getElementById('start-game');

    const checkInputs = () => {
        const player1Name = document.getElementById('player1-name').value.trim();
        const player2Name = document.getElementById('player2-name').value.trim();
        const player1Marker = document.querySelector('#player1-card .marker-choice.selected');
        const player2Marker = document.querySelector('#player2-card .marker-choice.selected');

        if (player1Name && player2Name && player1Marker && player2Marker) {
            startButton.disabled = false;
        } else {
            startButton.disabled = true;
        }
    };

    inputs.forEach(input => {
        input.addEventListener('input', checkInputs);
    });

    document.querySelectorAll('.marker-choice').forEach(button => {
        button.addEventListener('click', checkInputs);
    });
});

document.getElementById('clear-history').addEventListener('click', () => {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    history = [];
});
