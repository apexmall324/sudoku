(() => {
    const levelDefinitions = [
        { name: 'Easy', clues: 38, seed: 1547 },
        { name: 'Medium', clues: 33, seed: 2791 },
        { name: 'Hard', clues: 29, seed: 3863 },
        { name: 'Expert', clues: 25, seed: 4927 },
        { name: 'Master', clues: 22, seed: 5189 },
        { name: 'Grandmaster', clues: 19, seed: 6343 }
    ];

    function createPuzzle(levelName) {
        const level = levelDefinitions.find(item => item.name === levelName);
        if (!level) throw new Error(`Unknown Sudoku level: ${levelName}`);

        let seed = level.seed;
        function shuffle(values) {
            const shuffled = values.slice();
            for (let index = shuffled.length - 1; index > 0; index--) {
                seed = (seed * 16807) % 2147483647;
                const swapIndex = seed % (index + 1);
                [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
            }
            return shuffled;
        }
        const rows = shuffle([0, 1, 2]).flatMap(band =>
            shuffle([0, 1, 2]).map(row => band * 3 + row)
        );
        const columns = shuffle([0, 1, 2]).flatMap(stack =>
            shuffle([0, 1, 2]).map(column => stack * 3 + column)
        );
        const digits = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        const solution = Array.from({ length: 81 }, (_, index) => {
            const row = rows[Math.floor(index / 9)];
            const column = columns[index % 9];
            return digits[(row * 3 + Math.floor(row / 3) + column) % 9];
        });
        const puzzle = solution.slice();
        const positions = Array.from({ length: 81 }, (_, index) => index);
        for (let index = positions.length - 1; index > 0; index--) {
            seed = (seed * 16807) % 2147483647;
            const swapIndex = seed % (index + 1);
            [positions[index], positions[swapIndex]] = [positions[swapIndex], positions[index]];
        }
        positions.slice(0, 81 - level.clues).forEach(index => { puzzle[index] = 0; });
        return puzzle;
    }

    window.SudokuLevels = {
        list: levelDefinitions.map(({ name, clues }) => ({ name, clues })),
        createPuzzle
    };
})();
