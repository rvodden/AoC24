import { readdirSync, readFileSync } from 'fs';
import { describe, expect, it } from 'vitest';

import { Puzzle } from './types/Puzzle.js';

describe('AoC test runner', () => {
  const dirs = readdirSync('./src/days', { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  for (const day of dirs) {
    describe(`Tests day ${day}`, async () => {
      let example = '';
      const puzzleName = day;
      try {
        const puzzlePath = `src/days/${puzzleName}`;
        example = readFileSync(`${puzzlePath}/example.txt`, { encoding: 'utf-8', flag: 'r' });
      } catch (error) {
        console.error(error);
        process.exit(1);
      }

      const { part1, expectedFirstSolution, part2, expectedSecondSolution } = (await import(
        `./days/${puzzleName}/Puzzle.ts`
      )) as Puzzle;

      it.each([
        { func: part1, expected: expectedFirstSolution },
        { func: part2, expected: expectedSecondSolution },
      ])('$func.name', ({ func, expected }) => {
        expect(func(example)).toBe(expected);
      });
    });
  }
});
