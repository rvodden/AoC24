type Puzzle = {
  part1: (input: string) => string;
  expectedFirstSolution: string;
  part2: (input: string) => string;
  expectedSecondSolution: string;
};

export default Puzzle;
