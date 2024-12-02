import { readdirSync } from 'fs';
import { describe, expect, it } from 'vitest';
import readFile from './utils/readFile';
import Puzzle from './types/Puzzle';

describe('AoC test runner', () => {
  const dirs = readdirSync('./src/days', { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  for (const day of dirs) {
    it(`Tests day ${day}`, async () => {
      let example = '';
      const puzzleName = day;
      try {
        const puzzlePath = `src/days/${puzzleName}`;
        example = await readFile(`${puzzlePath}/example.txt`);
      } catch (error) {
        console.error(error);
        process.exit(1);
      }
      const {
        part1,
        expectedFirstSolution,
        part2,
        expectedSecondSolution,
      }: Puzzle = await import(`./days/${puzzleName}/Puzzle`);

      expect(part1(example)).toBe(expectedFirstSolution);
      expect(part2(example)).toBe(expectedSecondSolution);
    });
  }
});
