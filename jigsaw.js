document.addEventListener('DOMContentLoaded', () => {
    const puzzleGrid = SudokuBoard.createBoard(document.getElementById('sudokuGrid'), {
        onInput: () => {
            clearResult();
            updateConflicts();
        }
    });
    const regionGrid = SudokuBoard.createBoard(document.getElementById('regionGrid'));
    const result = document.getElementById('result');
    const regionResult = document.getElementById('region-result');
    const legend = document.getElementById('regionLegend');
    let regions = SudokuCore.standardRegions();
    let hintsRemaining = 2;
    puzzleGrid.setRegions(regions);

    function clearResult() {
        result.textContent = '';
        result.className = 'result';
    }
    function updateConflicts() {
        puzzleGrid.setConflicts(SudokuCore.getConflicts(puzzleGrid.read(), regions));
    }
    function resetHints() {
        hintsRemaining = 2;
        const button = document.getElementById('hint-button');
        button.textContent = `Hint (${hintsRemaining} left) ✦`;
        button.disabled = false;
    }
    function showPanel(name) {
        const puzzlePanel = document.getElementById('puzzle-panel');
        const regionsPanel = document.getElementById('regions-panel');
        const puzzleTab = document.getElementById('puzzle-tab-button');
        const regionsTab = document.getElementById('regions-tab-button');
        const showPuzzle = name === 'puzzle';
        puzzlePanel.hidden = !showPuzzle;
        regionsPanel.hidden = showPuzzle;
        puzzleTab.classList.toggle('active', showPuzzle);
        regionsTab.classList.toggle('active', !showPuzzle);
        puzzleTab.setAttribute('aria-selected', String(showPuzzle));
        regionsTab.setAttribute('aria-selected', String(!showPuzzle));
    }
    function refreshRegions() {
        regionGrid.setRegions(regions);
        puzzleGrid.setRegions(regions);
        updateConflicts();
        regionGrid.cells.forEach((cell, index) => { cell.value = String(regions[index]); });
        legend.innerHTML = Array.from({ length: 9 }, (_, index) =>
            `<span><i class="region-swatch" data-color="${index + 1}"></i>${index + 1}</span>`
        ).join('');
    }
    function loadSampleRegions() {
        regions = Array.from({ length: 81 }, (_, index) => {
            const row = Math.floor(index / 9);
            const column = index % 9;
            return (row * 3 + Math.floor(row / 3) + column) % 9 + 1;
        });
        refreshRegions();
        regionResult.textContent = 'Sample regions loaded. Save them when you’re ready.';
        regionResult.className = 'result success';
    }

    regionGrid.cells.forEach((cell, index) => {
        cell.readOnly = true;
        cell.tabIndex = 0;
        cell.value = String(regions[index]);
        cell.addEventListener('click', () => {
            regions[index] = regions[index] % 9 + 1;
            refreshRegions();
            regionResult.textContent = '';
            regionResult.className = 'result';
        });
        cell.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                cell.click();
            }
        });
    });
    refreshRegions();
    document.getElementById('puzzle-tab-button').addEventListener('click', () => showPanel('puzzle'));
    document.getElementById('regions-tab-button').addEventListener('click', () => showPanel('regions'));
    document.getElementById('standard-regions-button').addEventListener('click', () => {
        regions = SudokuCore.standardRegions();
        refreshRegions();
        regionResult.textContent = 'Standard 3×3 regions restored.';
        regionResult.className = 'result success';
    });
    document.getElementById('load-region-example-button').addEventListener('click', loadSampleRegions);
    document.getElementById('confirm-regions-button').addEventListener('click', () => {
        const error = SudokuCore.validateRegions(regions);
        regionResult.textContent = error || 'Regions saved. You can enter your puzzle now.';
        regionResult.className = error ? 'result error' : 'result success';
        if (!error) showPanel('puzzle');
    });
    document.getElementById('solve-button').addEventListener('click', () => {
        const regionError = SudokuCore.validateRegions(regions);
        const puzzle = puzzleGrid.read();
        const error = regionError || SudokuCore.validatePuzzle(puzzle, regions);
        if (error) {
            result.textContent = error;
            result.className = 'result error';
            return;
        }
        const solution = puzzle.slice();
        if (SudokuCore.solve(solution, regions)) {
            puzzleGrid.write(solution, puzzle);
            puzzleGrid.setRegions(regions);
            puzzleGrid.setConflicts(Array(81).fill(false));
            result.textContent = 'Jigsaw puzzle solved. Nicely done.';
            result.className = 'result success';
        } else {
            result.textContent = 'This puzzle has no solution. Check the clues and try again.';
            result.className = 'result error';
        }
    });
    document.getElementById('clear-button').addEventListener('click', () => {
        puzzleGrid.clear();
        resetHints();
        clearResult();
    });
    document.getElementById('example-button').addEventListener('click', () => {
        loadSampleRegions();
        puzzleGrid.clear();
        resetHints();
        clearResult();
        showPanel('regions');
        regionResult.textContent = 'Sample regions loaded. Save them, then enter a puzzle.';
        regionResult.className = 'result success';
    });
    document.getElementById('hint-button').addEventListener('click', () => {
        if (hintsRemaining === 0) return;
        const index = puzzleGrid.focusedIndex;
        if (index < 0 || puzzleGrid.read()[index] !== 0) {
            result.textContent = 'Select an empty cell to use a hint.';
            result.className = 'result error';
            return;
        }
        const puzzle = puzzleGrid.read();
        const error = SudokuCore.validatePuzzle(puzzle, regions) || SudokuCore.validateRegions(regions);
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
        puzzleGrid.setHint(index, solution[index]);
        puzzleGrid.setRegions(regions);
        updateConflicts();
        hintsRemaining--;
        document.getElementById('hint-button').textContent = `Hint (${hintsRemaining} left) ✦`;
        document.getElementById('hint-button').disabled = hintsRemaining === 0;
        result.textContent = `Hint: this cell is ${solution[index]}.`;
        result.className = 'result success';
    });
});
