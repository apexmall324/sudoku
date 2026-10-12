"""
Sudoku Solver - Automatically solves Sudoku puzzles using backtracking algorithm.
"""

class SudokuSolver:
    def __init__(self):
        self.grid = [[0] * 9 for _ in range(9)]
    
    def set_puzzle(self, puzzle):
        """
        Set the puzzle from a 9x9 list or string.
        Use 0 for empty cells.
        """
        if isinstance(puzzle, str):
            # Parse string format (81 digits, 0 for empty)
            puzzle = [int(ch) for ch in puzzle if ch.isdigit()]
        
        if len(puzzle) != 81:
            raise ValueError("Puzzle must have exactly 81 cells")
        
        self.grid = [puzzle[i*9:(i+1)*9] for i in range(9)]
    
    def is_valid(self, row, col, num):
        """Check if placing 'num' at (row, col) is valid."""
        # Check row
        if num in self.grid[row]:
            return False
        
        # Check column
        if num in [self.grid[i][col] for i in range(9)]:
            return False
        
        # Check 3x3 box
        box_row, box_col = 3 * (row // 3), 3 * (col // 3)
        for i in range(box_row, box_row + 3):
            for j in range(box_col, box_col + 3):
                if self.grid[i][j] == num:
                    return False
        
        return True
    
    def solve(self):
        """Solve the puzzle using backtracking algorithm."""
        # Find next empty cell
        for row in range(9):
            for col in range(9):
                if self.grid[row][col] == 0:
                    # Try each number 1-9
                    for num in range(1, 10):
                        if self.is_valid(row, col, num):
                            self.grid[row][col] = num
                            
                            # Recursively solve the rest
                            if self.solve():
                                return True
                            
                            # Backtrack if no solution found
                            self.grid[row][col] = 0
                    
                    return False
        
        return True  # All cells filled successfully
    
    def display(self):
        """Display the solved puzzle in a readable format."""
        print("\n" + "=" * 25)
        print("SUDOKU SOLUTION")
        print("=" * 25)
        
        for i in range(9):
            if i % 3 == 0 and i != 0:
                print("-" * 25)
            
            row_str = ""
            for j in range(9):
                if j % 3 == 0 and j != 0:
                    row_str += "| "
                row_str += str(self.grid[i][j]) + " "
            
            print(row_str)
        
        print("=" * 25 + "\n")
    
    def get_solution(self):
        """Return the solved grid as a list."""
        return self.grid


def main():
    # Example Sudoku puzzle (0 represents empty cells)
    example_puzzle = [
        5, 3, 0, 0, 7, 0, 0, 0, 0,
        6, 0, 0, 1, 9, 5, 0, 0, 0,
        0, 9, 8, 0, 0, 0, 0, 6, 0,
        8, 0, 0, 0, 6, 0, 0, 0, 3,
        4, 0, 0, 8, 0, 3, 0, 0, 1,
        7, 0, 0, 0, 2, 0, 0, 0, 6,
        0, 6, 0, 0, 0, 0, 2, 8, 0,
        0, 0, 0, 4, 1, 9, 0, 0, 5,
        0, 0, 0, 0, 8, 0, 0, 7, 9
    ]
    
    # Create solver and set puzzle
    solver = SudokuSolver()
    solver.set_puzzle(example_puzzle)
    
    print("Original Puzzle:")
    solver.display()
    
    # Solve the puzzle
    print("Solving...")
    if solver.solve():
        print("✓ Puzzle solved successfully!")
        solver.display()
    else:
        print("✗ No solution found for this puzzle.")


if __name__ == "__main__":
    main()
