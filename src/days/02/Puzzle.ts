function parse(input: string): number[][] {
  const lines = input.split('\n');
  return lines
    .map((line) => {
      const val = line
        .split(' ')
        .filter((n) => n != '')
        .map((n) => parseInt(n, 10));
      return val;
    })
    .filter((n) => n.length != 0);
}

function allEqual<T>(arr: T[]): boolean {
  return arr.every((val) => val === arr[0]);
}

function* pairwise<T>(iterable: Iterable<T>): Generator<[T, T], void> {
  const iterator = iterable[Symbol.iterator]();
  let a = iterator.next();
  if (a.done) {
    return;
  }
  let b = iterator.next();
  while (!b.done) {
    yield [a.value, b.value];
    a = b;
    b = iterator.next();
  }
}

function isSafe(report: number[]): boolean {
  const differences = pairwise(report)
    .map(([x, y]) => x - y)
    .toArray();
  return (
    allEqual(differences.map((x) => x > 0)) &&
    differences.every((x) => {
      const abs_x = Math.abs(x);
      return abs_x >= 1 && abs_x <= 3;
    })
  );
}

function isSafeP2(report: number[]): boolean {
  if (isSafe(report)) {
    return true;
  }

  return report
    .map((_, idx, arr) => arr.toSpliced(idx, 1))
    .map(isSafe)
    .some(Boolean);
}

const part1 = (input: string) => {
  const reports = parse(input);
  const result = reports.map(isSafe).filter(Boolean).length;
  return result.toString();
};

const expectedFirstSolution = '2';

const part2 = (input: string) => {
  const reports = parse(input);
  const result = reports.map(isSafeP2).filter(Boolean).length;
  return result.toString();
};

const expectedSecondSolution = '4';

export { part1, expectedFirstSolution, part2, expectedSecondSolution };
