document.addEventListener('DOMContentLoaded', () => {
    const grid = SudokuBoard.createBoard(document.getElementById('sudokuGrid'), {
        onInput: () => {
            clearResult();
            updateConflicts();
        }
    });
    const result = document.getElementById('result');
    const regions = SudokuCore.standardRegions();
    const levelSelect = document.getElementById('level-select');
    let hintsRemaining = 2;

    SudokuLevels.list.forEach(level => {
        const option = document.createElement('option');
        option.value = level.name;
        option.textContent = `${level.name} · ${level.clues} clues`;
        levelSelect.appendChild(option);
    });

    function clearResult() {
        result.textContent = '';
        result.className = 'result';
    }
    function updateConflicts() {
        grid.setConflicts(SudokuCore.getConflicts(grid.read(), regions));
    }
    function resetHints() {
        hintsRemaining = 2;
        const button = document.getElementById('hint-button');
        button.textContent = `Hint (${hintsRemaining} left) ✦`;
        button.disabled = false;
    }

    document.getElementById('solve-button').addEventListener('click', () => {
        const puzzle = grid.read();
        const error = SudokuCore.validatePuzzle(puzzle, regions);
        if (error) {
            result.textContent = error;
            result.className = 'result error';
            return;
        }
        const solution = puzzle.slice();
        if (SudokuCore.solve(solution, regions)) {
            grid.write(solution, puzzle);
            grid.setConflicts(Array(81).fill(false));
            result.textContent = 'Puzzle solved. Nicely done.';
            result.className = 'result success';
        } else {
            result.textContent = 'This puzzle has no solution. Check the clues and try again.';
            result.className = 'result error';
        }
    });
    document.getElementById('clear-button').addEventListener('click', () => {
        grid.clear();
        grid.setConflicts(Array(81).fill(false));
        resetHints();
        clearResult();
    });
    document.getElementById('load-level-button').addEventListener('click', () => {
        if (!levelSelect.value) {
            result.textContent = 'Choose a level before loading a game.';
            result.className = 'result error';
            return;
        }
        grid.write(SudokuLevels.createPuzzle(levelSelect.value));
        updateConflicts();
        resetHints();
        clearResult();
    });
    document.getElementById('hint-button').addEventListener('click', () => {
        if (hintsRemaining === 0) return;
        const index = grid.focusedIndex;
        if (index < 0 || grid.read()[index] !== 0) {
            result.textContent = 'Select an empty cell to use a hint.';
            result.className = 'result error';
            return;
        }
        const puzzle = grid.read();
        const error = SudokuCore.validatePuzzle(puzzle, regions);
        if (error) {
            result.textContent = error;
            result.className = 'result error';
            return;
        }
        const solution = puzzle.slice();
        if (!SudokuCore.solve(solution, regions)) {
            result.textContent = 'This puzzle has no solution. Check the clues before using a hint.';
            result.className = 'result error';
            return;
        }
        grid.setHint(index, solution[index]);
        updateConflicts();
        hintsRemaining--;
        document.getElementById('hint-button').textContent = `Hint (${hintsRemaining} left) ✦`;
        document.getElementById('hint-button').disabled = hintsRemaining === 0;
        result.textContent = `Hint: this cell is ${solution[index]}.`;
        result.className = 'result success';
    });
});
