interface AntennaMap {
    grid: Map<string, [number, number][]>;
    bounds: [number, number];
}

const add = (lhs: [number, number], rhs: [number, number]): [number, number] => [lhs[0] + rhs[0], lhs[1] + rhs[1]];
const subtract = (lhs: [number, number], rhs: [number, number]): [number, number] => [lhs[0] - rhs[0], lhs[1] - rhs[1]];
const compare = (lhs: [number, number], rhs: [number, number]) => lhs[0] === rhs[0] && lhs[1] === rhs[1];

function* permute<T>(array: T[], n: number, compare: (lhs: T, rhs: T) => boolean, prev: T[]): Generator<T[]> {
    if (n <= 0) {
        yield prev;
        return;
    }

    for (const curr of array) {
        if (prev.some((el) => compare(el, curr))) continue;
        yield* permute(array, n - 1, compare, [...prev, curr]);
    }
}

const parseInput = (input: string): AntennaMap => {
    const width = input.indexOf('\n');
    const height = Math.floor(input.length / (width + 1));
    const grid = input
        .split('\n')
        .map((line, y) => {
            return [...line].map((char, x) => {
                switch (char) {
                    case '.':
                        return;
                    default:
                        return [char, [x, y]];
                }
            });
        })
        .flat()
        .filter((x) => Boolean(x))
        .reduce((grid, [frequency, location]) => {
            grid.set(frequency, grid.get(frequency) || []);
            grid.get(frequency)?.push(location);
            return grid;
        }, new Map<string, [number, number][]>());
    return { grid, bounds: [width, height] };
};

const inBounds = ([x, y]: [number, number], [xmax, ymax]: [number, number]): boolean =>
    0 <= x && x < xmax && 0 <= y && y < ymax;

const part1 = (input: string) => {
    const { grid, bounds } = parseInput(input);
    const antiNodes = grid
        .values()
        .flatMap((antennae) => permute(antennae, 2, compare, []))

        .map(([lhs, rhs]) => {
            return add(rhs, subtract(rhs, lhs));
        })
        .filter((loc) => inBounds(loc, bounds))
        .toArray()
        .filter((loc1, idx, arr) => arr.findIndex((loc2) => compare(loc1, loc2)) === idx);

    return antiNodes.length;
};

const expectedFirstSolution = 14;

type numberFuncUnion = ((a: number, b: number) => number) | number;
function simplify(numerator: number, denominator: number) {
    let gcd: numberFuncUnion = function gcd(a: number, b: number): number {
        return b ? gcd(b, a % b) : a;
    };
    gcd = gcd(Math.abs(numerator), Math.abs(denominator));
    return [numerator / gcd, denominator / gcd];
}

/**
 * Repeatedly calls a function repeatedly on the previous value of the generator, starting with initialValue
 *
 * generate(f, x) will return x, f(x), f(f(x)), ...
 *
 *  @param func - The function to call
 *  @param initialValue - The initialValue to return, and the value to apply the function to First
 *  @param predicate - A function to determine if this generator should continue generating. If predicate(initialValue) fails then this generator will return
 */
function* generate<T>(func: (val: T) => T, initialValue: T, predicate: (val: T) => boolean = (x) => true) {
    let value = initialValue;
    while (predicate(value)) {
        yield value;
        value = func(value);
    }
    return;
}

const display = (antennaMap: AntennaMap, antinodes: [number, number][]) => {
    for (let y = 0; y < antennaMap.bounds[1]; y++) {
        loop1: for (let x = 0; x < antennaMap.bounds[0]; x++) {
            for (const [frequency, antennaList] of antennaMap.grid) {
                const antenna = antennaList.find((location) => compare(location, [x, y]));
                if (antenna) {
                    process.stdout.write(frequency);
                    continue loop1;
                }
            }

            const antinode = antinodes.find((loc) => compare(loc, [x, y]));
            if (antinode) {
                process.stdout.write('#');
                continue;
            }

            process.stdout.write('.');
        }
        process.stdout.write('\n');
    }
};

const part2 = (input: string) => {
    const { grid, bounds } = parseInput(input);
    const antiNodes = grid
        .values()
        .flatMap((antennae) => permute(antennae, 2, compare, []))

        .flatMap(([lhs, rhs]) => {
            const delta = simplify(...subtract(rhs, lhs)) as [number, number];
            return generate(
                (loc) => add(loc, delta),
                lhs,
                (loc) => inBounds(loc, bounds),
            ).toArray();
        })
        .toArray()
        .filter((loc1, idx, arr) => arr.findIndex((loc2) => compare(loc1, loc2)) === idx);

    // display({ grid, bounds }, antiNodes);
    return antiNodes.length;
};

const expectedSecondSolution = 34;

export { part1, expectedFirstSolution, part2, expectedSecondSolution };
