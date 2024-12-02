import {Puzzle} from "../../types/Puzzle.js"

function zip<T1, T2>(a: T1[], b: T2[]): [T1, T2][] {
  return a.map((k, i) => [k, b[i]]);
}

const part1 = (input: string) => {
  const lines = input.split('\n');
  const list1: number[] = [];
  const list2: number[] = [];
  lines.forEach((line) => {
    const values = line.split(' ').filter((n) => n != '');
    if (values.length > 0) {
      list1.push(parseInt(values[0]));
      list2.push(parseInt(values[1]));
    }
  });
  list1.sort();
  list2.sort();
  const pairs = zip(list1, list2);

  const result = pairs.reduce((acc: number, x: number[]) => {
    acc += Math.abs(x[1] - x[0]);
    return acc;
  }, 0);

  return result.toString();
};

const expectedFirstSolution = '11';

const part2 = (input: string) => {
  const lines = input.split('\n');
  const list1: number[] = [];
  const list2: number[] = [];
  lines.forEach((line) => {
    const values = line.split(' ').filter((n) => n != '');
    if (values.length > 0) {
      list1.push(parseInt(values[0]));
      list2.push(parseInt(values[1]));
    }
  });

  const result = list1.reduce((acc: number, x: number) => {
    acc += x * list2.filter((y) => y == x).length;
    return acc;
  }, 0);

  return result.toString();
};

const expectedSecondSolution = '31';

export { part1, expectedFirstSolution, part2, expectedSecondSolution };
