"use strict";

(() => {
    window.addEventListener("load", () => {
        // Constants and Variables

        // Canvas references
        const canvas = document.querySelector("canvas");
        const ctx = canvas.getContext("2d");

        // UI references
        const restartButton = document.querySelector("#restart");
        const undoButton = document.querySelector('#undo');
        const currentPlayerText = document.querySelector('#current-player'); 

        // Constants
        const CELLS_PER_AXIS = 3;
        const CELL_WIDTH = canvas.width / CELLS_PER_AXIS;
        const CELL_HEIGHT = canvas.height / CELLS_PER_AXIS;
        const COLOR_X = 'lightcoral'; // Color for Player X
        const COLOR_O = 'lightblue';   // Color for Player O

        // Game objects
        let grids;
        let currentPlayer = 'X';
        let gameOver = false;

        // Initialize game
        startGame();

        function startGame() {
            initializeHistory();
            render(grids[0]);
        }

        function initializeHistory() {
            grids = [];
            grids.push(Array.from({ length: CELLS_PER_AXIS }, () => Array(CELLS_PER_AXIS).fill(null)));
        }

        function render(grid) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let row = 0; row < CELLS_PER_AXIS; row++) {
                for (let col = 0; col < CELLS_PER_AXIS; col++) {
                    const cell = grid[row][col];
                    ctx.fillStyle = cell === 'X' ? COLOR_X : cell === 'O' ? COLOR_O : 'white'; // Fill with color based on player
                    ctx.fillRect(col * CELL_WIDTH, row * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT); // Draw filled cell

                    ctx.strokeStyle = 'black'; // Draw grid lines
                    ctx.strokeRect(col * CELL_WIDTH, row * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
                }
            }
        }

        function updateGridAt(mousePositionX, mousePositionY) {
            if (gameOver) return;

            const row = Math.floor(mousePositionY / CELL_HEIGHT);
            const col = Math.floor(mousePositionX / CELL_WIDTH);

            if (grids[grids.length - 1][row][col] === null) {
                const newGrid = grids[grids.length - 1].map(arr => arr.slice());
                newGrid[row][col] = currentPlayer;
                grids.push(newGrid);
                render(newGrid);
                if (checkWin(newGrid, currentPlayer)) {
                    alert(`${currentPlayer} wins!`);
                    gameOver = true;
                } else if (newGrid.flat().every(cell => cell !== null)) {
                    alert("It's a draw!");
                    gameOver = true;
                } else {
                    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                    currentPlayerText.textContent = currentPlayer;
                }
            }
        }

        function checkWin(grid, player) {
            const winConditions = [
                [[0, 0], [0, 1], [0, 2]],
                [[1, 0], [1, 1], [1, 2]],
                [[2, 0], [2, 1], [2, 2]],
                [[0, 0], [1, 0], [2, 0]],
                [[0, 1], [1, 1], [2, 1]],
                [[0, 2], [1, 2], [2, 2]],
                [[0, 0], [1, 1], [2, 2]],
                [[0, 2], [1, 1], [2, 0]]
            ];
            return winConditions.some(condition =>
                condition.every(([row, col]) => grid[row][col] === player)
            );
        }

        function rollBackHistory() {
            if (grids.length > 1) {
                grids.pop(); // Remove the last grid state
                render(grids[grids.length - 1]);
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                currentPlayerText.textContent = currentPlayer;
                gameOver = false;
            }
        }

        function restart() {
            currentPlayer = 'X';
            currentPlayerText.textContent = currentPlayer;
            gameOver = false;
            startGame(); // Start a new game with a new grid
        }

        // Event Listeners
        canvas.addEventListener("mousedown", (event) => {
            updateGridAt(event.offsetX, event.offsetY);
        });

        restartButton.addEventListener("mousedown", restartClickHandler);
        function restartClickHandler() {
            restart();
        }

        undoButton.addEventListener("mousedown", undoLastMove);
        function undoLastMove() {
            rollBackHistory();
        }
    });
})();
