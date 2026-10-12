(() => {
    function createBoard(container, options = {}) {
        container.replaceChildren();
        const cells = [];
        let focusedIndex = -1;
        for (let index = 0; index < 81; index++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.inputMode = 'numeric';
            input.maxLength = 1;
            input.autocomplete = 'off';
            input.spellcheck = false;
            input.className = 'grid-cell';
            input.setAttribute('aria-label', `Row ${Math.floor(index / 9) + 1}, column ${index % 9 + 1}`);
            input.dataset.index = String(index);
            input.addEventListener('focus', () => {
                focusedIndex = index;
                cells.forEach((cell, cellIndex) => cell.classList.toggle('selected', cellIndex === index));
            });
            input.addEventListener('input', () => {
                const digit = input.value.replace(/[^1-9]/g, '').slice(-1);
                input.value = digit;
                input.classList.remove('solved', 'hinted');
                if (options.onInput) options.onInput();
            });
            input.addEventListener('keydown', event => {
                const directions = { ArrowUp: -9, ArrowDown: 9, ArrowLeft: -1, ArrowRight: 1 };
                if (directions[event.key] === undefined) return;
                event.preventDefault();
                let target = index + directions[event.key];
                if (event.key === 'ArrowLeft' && index % 9 === 0) target = index;
                if (event.key === 'ArrowRight' && index % 9 === 8) target = index;
                if (target >= 0 && target < 81) cells[target].focus();
            });
            container.appendChild(input);
            cells.push(input);
        }
        return {
            read() { return cells.map(cell => cell.value === '' ? 0 : Number(cell.value)); },
            write(values, original = null) {
                cells.forEach((cell, index) => {
                    cell.value = values[index] ? String(values[index]) : '';
                    cell.classList.toggle('solved', Boolean(original && !original[index] && values[index]));
                    cell.classList.remove('hinted');
                });
            },
            clear() {
                cells.forEach(cell => {
                    cell.value = '';
                    cell.classList.remove('solved', 'hinted', 'conflict');
                    cell.removeAttribute('aria-invalid');
                });
            },
            setConflicts(conflicts) {
                cells.forEach((cell, index) => {
                    const conflict = Boolean(conflicts[index]);
                    cell.classList.toggle('conflict', conflict);
                    if (conflict) cell.setAttribute('aria-invalid', 'true');
                    else cell.removeAttribute('aria-invalid');
                });
            },
            setHint(index, value) {
                cells[index].value = String(value);
                cells[index].classList.remove('conflict', 'solved');
                cells[index].classList.add('hinted');
                cells[index].removeAttribute('aria-invalid');
            },
            setRegions(regions) {
                cells.forEach((cell, index) => {
                    cell.dataset.region = String(regions[index]);
                    cell.classList.toggle('region-start-top', index < 9 || regions[index - 9] !== regions[index]);
                    cell.classList.toggle('region-start-left', index % 9 === 0 || regions[index - 1] !== regions[index]);
                    cell.classList.toggle('region-end-right', index % 9 === 8 || regions[index + 1] !== regions[index]);
                    cell.classList.toggle('region-end-bottom', index >= 72 || regions[index + 9] !== regions[index]);
                });
            },
            get focusedIndex() { return focusedIndex; },
            get cells() { return cells; }
        };
    }

    window.SudokuBoard = { createBoard };
})();
