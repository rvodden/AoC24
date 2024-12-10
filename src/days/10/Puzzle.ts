const parseInput = (input: string): [number, number, number[][]] => {
    const width = input.indexOf('\n');
    const height = input.length / (width + 1);

    const grid = input
        .split('\n')
        .map((line) => [...line].map((x) => (x === '.' ? Infinity : Number(x))))
        .filter((line) => line.length != 0);

    return [width, height, grid];
};

const areEqual = ([x1, y1]: [number, number], [x2, y2]: [number, number]): boolean => x1 === x2 && y1 === y2;
const inBounds = ([x, y]: [number, number], [xmax, ymax]: [number, number]): [number, number] | undefined =>
    0 <= x && x < xmax && 0 <= y && y < ymax ? [x, y] : undefined;

const exits: { ([x, y]: [number, number] ): [number, number] }[] = [
    ([x, y]) => [x + 1, y],
    ([x, y]) => [x - 1, y],
    ([x, y]) => [x, y + 1],
    ([x, y]) => [x, y - 1],
];

const getTrailheads = (grid: number[][]) =>
    grid
        .map((line, y) =>
            line.map((height, x) => (height === 0 ? [x, y] : undefined)).filter((loc) => loc != undefined),
        )
        .flat();

const boundExits = (bounds: [number, number]) => 
    exits.map((func) => ([x, y]: [number, number]) => inBounds(func([x, y]), bounds));

const part1 = (input: string) => {
    const [width, height, grid] = parseInput(input);
    const boundedExits = boundExits([width, height]);
    const trailheads = getTrailheads(grid);

    const nines = ([x, y]: [number, number], indent: number = 0): [number, number][] => {
        const height = grid[y][x];
        // console.log(x, y, height);
        const newScores = boundedExits
            .map(func => func([x, y]))
            .filter(loc => loc !== undefined)
            .flatMap(([x, y]) => {
                const s = grid[y][x];
                if (s === 9 && height == 8) {
                    return [[x, y] as [number, number]];
                }
                if (s === height + 1) {
                    return nines([x, y], indent + 1);
                }
                return undefined;
            })
            .filter((x) => x != undefined)
            .filter((val, idx, arr) => arr.findIndex((loc) => areEqual(val, loc)) === idx);

        return newScores;
    };

    const scores = trailheads.values().flatMap(nines).toArray();
    return scores.length;
};

const expectedFirstSolution = 36;

const part2 = (input: string) => {
    const [width, height, grid] = parseInput(input);
    const boundedExits = boundExits([width, height]);

    const nines = ([x, y]: [number, number], indent: number = 0): number[] => {
        const height = grid[y][x];
        const newScores = boundedExits
            .map((func) =>  func([x, y]))
            .filter((loc) => loc !== undefined)
            .flatMap(([x, y]) => {
                const s = grid[y][x];
                if (s === 9 && height === 8) {
                    return 1;
                }
                if (s === height + 1) {
                    return nines([x, y], indent + 1);
                }
                return 0;
            });

        return newScores;
    };

    const scores = getTrailheads(grid).flatMap(nines);
    return scores.reduce((x, y) => x + y);
};

const expectedSecondSolution = 81;

export { part1, expectedFirstSolution, part2, expectedSecondSolution };
