class SudokuGame {
    constructor() {
        this.board = [];
        this.solution = [];
        this.selectedCell = null;
        this.difficulty = 'medium';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.newGame();
    }

    setupEventListeners() {
        document.getElementById('newGame').addEventListener('click', () => this.newGame());
        document.getElementById('checkSolution').addEventListener('click', () => this.checkSolution());
        document.getElementById('hint').addEventListener('click', () => this.giveHint());
        document.getElementById('difficulty').addEventListener('change', (e) => {
            this.difficulty = e.target.value;
            this.newGame();
        });
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    newGame() {
        this.showMessage('Generating new game...', 'info');
        setTimeout(() => {
            this.solution = this.generateSolvedBoard();
            this.board = this.createPuzzle(this.solution, this.difficulty);
            this.renderBoard();
            this.showMessage('New game started! Good luck!', 'success');
        }, 100);
    }

    generateSolvedBoard() {
        const board = Array(9).fill(null).map(() => Array(9).fill(0));
        this.fillBoard(board);
        return board;
    }

    fillBoard(board, row = 0, col = 0) {
        if (row === 9) return true;
        if (col === 9) return this.fillBoard(board, row + 1, 0);
        
        const numbers = this.shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        
        for (let num of numbers) {
            if (this.isValidMove(board, row, col, num)) {
                board[row][col] = num;
                if (this.fillBoard(board, row, col + 1)) return true;
                board[row][col] = 0;
            }
        }
        
        return false;
    }

    isValidMove(board, row, col, num) {
        // Check row
        for (let x = 0; x < 9; x++) {
            if (board[row][x] === num) return false;
        }
        
        // Check column
        for (let x = 0; x < 9; x++) {
            if (board[x][col] === num) return false;
        }
        
        // Check 3x3 box
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[startRow + i][startCol + j] === num) return false;
            }
        }
        
        return true;
    }

    createPuzzle(solvedBoard, difficulty) {
        const puzzle = solvedBoard.map(row => [...row]);
        const cellsToRemove = {
            'easy': 30,
            'medium': 40,
            'hard': 50
        }[difficulty];
        
        let removed = 0;
        while (removed < cellsToRemove) {
            const row = Math.floor(Math.random() * 9);
            const col = Math.floor(Math.random() * 9);
            if (puzzle[row][col] !== 0) {
                puzzle[row][col] = 0;
                removed++;
            }
        }
        
        return puzzle;
    }

    renderBoard() {
        const boardElement = document.getElementById('sudoku-board');
        boardElement.innerHTML = '';
        
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                const value = this.board[row][col];
                if (value !== 0) {
                    cell.textContent = value;
                    cell.classList.add('fixed');
                } else {
                    cell.addEventListener('click', () => this.selectCell(row, col));
                }
                
                boardElement.appendChild(cell);
            }
        }
    }

    selectCell(row, col) {
        // Remove previous selection
        const previousSelected = document.querySelector('.cell.selected');
        if (previousSelected) {
            previousSelected.classList.remove('selected');
        }
        
        // Select new cell
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        if (cell && !cell.classList.contains('fixed')) {
            cell.classList.add('selected');
            this.selectedCell = { row, col };
        }
    }

    handleKeyPress(e) {
        if (!this.selectedCell) return;
        
        const { row, col } = this.selectedCell;
        
        if (e.key >= '1' && e.key <= '9') {
            const num = parseInt(e.key);
            this.board[row][col] = num;
            this.updateCell(row, col, num);
            this.validateCell(row, col);
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
            this.board[row][col] = 0;
            this.updateCell(row, col, 0);
        }
    }

    updateCell(row, col, value) {
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        if (cell && !cell.classList.contains('fixed')) {
            cell.textContent = value || '';
            cell.classList.add('user-input');
            cell.classList.remove('error', 'hint');
        }
    }

    validateCell(row, col) {
        const value = this.board[row][col];
        if (value === 0) return;
        
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        if (!cell) return;
        
        // Temporarily set to 0 to check validity (to avoid checking against itself)
        const temp = this.board[row][col];
        this.board[row][col] = 0;
        const isValid = this.isValidMove(this.board, row, col, temp);
        this.board[row][col] = temp;
        
        if (!isValid) {
            cell.classList.add('error');
        } else {
            cell.classList.remove('error');
        }
    }

    checkSolution() {
        let isComplete = true;
        let isCorrect = true;
        
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.board[row][col] === 0) {
                    isComplete = false;
                } else if (this.board[row][col] !== this.solution[row][col]) {
                    isCorrect = false;
                }
            }
        }
        
        if (!isComplete) {
            this.showMessage('Puzzle is not complete yet!', 'error');
        } else if (!isCorrect) {
            this.showMessage('Some cells are incorrect. Keep trying!', 'error');
        } else {
            this.showMessage('🎉 Congratulations! You solved the puzzle! 🎉', 'success');
        }
    }

    giveHint() {
        const emptyCells = [];
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.board[row][col] === 0) {
                    emptyCells.push({ row, col });
                }
            }
        }
        
        if (emptyCells.length === 0) {
            this.showMessage('No empty cells left!', 'info');
            return;
        }
        
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const { row, col } = randomCell;
        const correctValue = this.solution[row][col];
        
        this.board[row][col] = correctValue;
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        if (cell) {
            cell.textContent = correctValue;
            cell.classList.add('hint');
            cell.classList.remove('selected', 'error');
        }
        
        this.showMessage(`Hint: Cell at row ${row + 1}, column ${col + 1} is ${correctValue}`, 'info');
    }

    showMessage(text, type) {
        const messageElement = document.getElementById('message');
        messageElement.textContent = text;
        messageElement.className = `message ${type}`;
        
        if (type === 'success' || type === 'info') {
            setTimeout(() => {
                messageElement.textContent = '';
                messageElement.className = 'message';
            }, 3000);
        }
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SudokuGame();
});
