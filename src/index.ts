import type { PuzzleFunc } from './types/Puzzle.js';
import readFile from './utils/readFile.js';

const args = process.argv.slice(2);
const dayToSolve = args[0];

if (!dayToSolve) {
  console.error('No day specified run with npm run dev {day}');
  process.exit(1);
}
console.log(`Solving Day #${args[0]}`);
await (async () => {
  let input = '';
  try {
    const puzzlePath = `src/days/${dayToSolve}`;
    console.log(puzzlePath)
    input = readFile(`${puzzlePath}/input.txt`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
  const { part1, part2 } = await import(`./days/${dayToSolve}/Puzzle`) as { part1: PuzzleFunc, part2: PuzzleFunc };

  console.log(part1(input));
  console.log(part2(input));
})();
