const parseInput = (input: string) => ({
    codes: input
        .split('\n')
        .filter((line) => line != '')
        .map((line) => [...line]),
    numbers: input
        .split('\n')
        .filter((line) => line != '')
        .map((line) => Number(line.slice(0, -1))),
});

type Point = [number, number];
const equal = ([x1, y1]: [number, number], [x2, y2]: [number, number]): boolean => x1 === x2 && y1 === y2;
const difference = (lhs: Point, rhs: Point): Point => [lhs[0] - rhs[0], lhs[1] - rhs[1]];
const zip = <T1, T2>(a: T1[], b: T2[]): [T1, T2][] => a.map((k, i) => [k, b[i]]);

function* permute<T>(permutation: T[]): Generator<T[]> {
    var length = permutation.length,
        c = Array(length).fill(0),
        i = 1,
        k: number,
        p: T;

    yield permutation.slice();
    while (i < length) {
        if (c[i] < i) {
            k = i % 2 && c[i];
            p = permutation[i];
            permutation[i] = permutation[k];
            permutation[k] = p;
            ++c[i];
            i = 1;
            yield permutation.slice();
        } else {
            c[i] = 0;
            ++i;
        }
    }
}

const numbericKeys = new Map<string, Point>([
    ['7', [0, 0]],
    ['8', [1, 0]],
    ['9', [2, 0]],
    ['4', [0, 1]],
    ['5', [1, 1]],
    ['6', [2, 1]],
    ['1', [0, 2]],
    ['2', [1, 2]],
    ['3', [2, 2]],
    ['0', [1, 3]],
    ['A', [2, 3]],
]);

const directionKeys = new Map<string, Point>([
    ['^', [1, 0]],
    ['A', [2, 0]],
    ['<', [0, 1]],
    ['v', [1, 1]],
    ['>', [2, 1]],
]);

const effects = new Map<string, { (p: Point): Point }>([
    ['^', ([x, y]) => [x, y - 1]],
    ['<', ([x, y]) => [x - 1, y]],
    ['v', ([x, y]) => [x, y + 1]],
    ['>', ([x, y]) => [x + 1, y]],
]);

const ways = ([x, y]: Point, keypad: Map<string, Point>): IteratorObject<string[]> => {
    const presses = [];
    if (x > 0) {
        presses.push(...new Array(x).fill('>'));
    }
    if (x < 0) {
        presses.push(...new Array(-x).fill('<'));
    }
    if (y > 0) {
        presses.push(...new Array(y).fill('v'));
    }
    if (y < 0) {
        presses.push(...new Array(-y).fill('^'));
    }
    const raw_combinations = permute(presses)
        .map(presses => presses.concat(['A']))
        .filter(presses => {
            let curr = keypad.get('A')!;
            presses.every(press => {
                curr = effects.get(press)!(press);
                return keypad.values().find(x => equal(x, curr));
            });
        });
    return raw_combinations;
};

const numericToDirection = (code: string[]) => {
    let position = numbericKeys.get('A')!;
    return code
        .map((digit) => {
            const newPosition = numbericKeys.get(digit)!;
            const diff = difference(newPosition, position);
            position = newPosition;
            return diff;
        })
        .flatMap(ways);
};

const directionToDirection = (code: string[]) => {
    let position = directionKeys.get('A')!;
    return code
        .map((digit) => {
            const newPosition = directionKeys.get(digit)!;
            const diff = difference(newPosition, position);
            position = newPosition;
            return diff;
        })
        .flatMap(ways);
};

const part1 = (input: string) => {
    const { codes, numbers } = parseInput(input);

    console.log(numbers);

    const lengths = codes
        .map(numericToDirection)
        .map(directionToDirection)
        .map(directionToDirection)
        .map((x) => x.length);

    return zip(numbers, lengths)
        .map(([number, length]) => number * length)
        .reduce((lhs, rhs) => lhs + rhs);
};

const expectedFirstSolution = 'part 1';

const part2 = (input: string) => {
    return 'part 2';
};

const expectedSecondSolution = 'part 2';

export { part1, expectedFirstSolution, part2, expectedSecondSolution };
