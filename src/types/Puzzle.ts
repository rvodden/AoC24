type PuzzleFunc = (input:string) => string;

interface Puzzle {
  part1: PuzzleFunc;
  expectedFirstSolution: string;
  part2: PuzzleFunc;
  expectedSecondSolution: string;
}

export {Puzzle, PuzzleFunc};
