(() => {
    const SIZE = 9;
    const CELL_COUNT = SIZE * SIZE;

    function standardRegions() {
        return Array.from({ length: CELL_COUNT }, (_, index) =>
            Math.floor(Math.floor(index / SIZE) / 3) * 3 + Math.floor((index % SIZE) / 3) + 1
        );
    }

    function validatePuzzle(puzzle, regions) {
        if (!Array.isArray(puzzle) || puzzle.length !== CELL_COUNT ||
            puzzle.some(value => !Number.isInteger(value) || value < 0 || value > 9)) {
            return 'Enter a number from 1 to 9 in each filled cell.';
        }
        for (let index = 0; index < CELL_COUNT; index++) {
            const number = puzzle[index];
            if (!number) continue;
            puzzle[index] = 0;
            const valid = isValidMove(puzzle, Math.floor(index / SIZE), index % SIZE, number, regions);
            puzzle[index] = number;
            if (!valid) return 'There is a duplicate number in a row, column, or region.';
        }
        return '';
    }

    function isValidMove(puzzle, row, col, number, regions) {
        for (let index = 0; index < SIZE; index++) {
            if (puzzle[row * SIZE + index] === number || puzzle[index * SIZE + col] === number) return false;
        }
        const cellIndex = row * SIZE + col;
        const region = regions[cellIndex];
        for (let index = 0; index < CELL_COUNT; index++) {
            if (regions[index] === region && puzzle[index] === number) return false;
        }
        return true;
    }

    function getConflicts(puzzle, regions) {
        const conflicts = Array(CELL_COUNT).fill(false);
        for (let first = 0; first < CELL_COUNT; first++) {
            if (!puzzle[first]) continue;
            const firstRow = Math.floor(first / SIZE);
            const firstCol = first % SIZE;
            for (let second = first + 1; second < CELL_COUNT; second++) {
                if (puzzle[first] !== puzzle[second]) continue;
                const secondRow = Math.floor(second / SIZE);
                const secondCol = second % SIZE;
                if (firstRow === secondRow || firstCol === secondCol ||
                    regions[first] === regions[second]) {
                    conflicts[first] = true;
                    conflicts[second] = true;
                }
            }
        }
        return conflicts;
    }

    function solve(puzzle, regions) {
        let bestIndex = -1;
        let bestCandidates = null;
        for (let index = 0; index < CELL_COUNT; index++) {
            if (puzzle[index] !== 0) continue;
            const row = Math.floor(index / SIZE);
            const col = index % SIZE;
            const candidates = [];
            for (let number = 1; number <= SIZE; number++) {
                if (isValidMove(puzzle, row, col, number, regions)) candidates.push(number);
            }
            if (candidates.length === 0) return false;
            if (bestCandidates === null || candidates.length < bestCandidates.length) {
                bestIndex = index;
                bestCandidates = candidates;
                if (candidates.length === 1) break;
            }
        }
        if (bestIndex === -1) return true;
        for (const number of bestCandidates) {
            puzzle[bestIndex] = number;
            if (solve(puzzle, regions)) return true;
        }
        puzzle[bestIndex] = 0;
        return false;
    }

    function validateRegions(regions) {
        if (!Array.isArray(regions) || regions.length !== CELL_COUNT ||
            regions.some(region => !Number.isInteger(region) || region < 1 || region > 9)) {
            return 'Every cell needs a region number from 1 to 9.';
        }
        const counts = Array(10).fill(0);
        regions.forEach(region => counts[region]++);
        const invalid = counts.findIndex((count, region) => region > 0 && count !== SIZE);
        return invalid < 0 ? '' : `Region ${invalid} has ${counts[invalid]} cells. Each region must have exactly 9.`;
    }

    window.SudokuCore = { standardRegions, validatePuzzle, validateRegions, getConflicts, solve };
})();
