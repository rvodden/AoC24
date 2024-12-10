import { getEnvironmentData } from "worker_threads";

const parseInput = (input: string): [number, number, number[][]] => {
    const width = input.indexOf('\n');
    const height = input.length / (width + 1);

    const grid = input.split('\n')
        .map((line) => [...line]
        .filter(char => char != '.')
        .map(Number))
        .filter(line => line.length != 0);

    return [width, height, grid];
};

const inBounds = ([x, y]: [number, number], [xmax, ymax]: [number, number]): [number, number] | undefined =>
    0 <= x && x < xmax && 0 <= y && y < ymax ? [x, y] : undefined;

const exits: { (x: number, y: number): [number, number] }[] = [
    (x, y) => [x + 1, y],
    (x, y) => [x - 1, y],
    (x, y) => [x, y + 1],
    (x, y) => [x + 1, y - 1],
];

const part1 = (input: string) => {
    const [width, height, grid] = parseInput(input);
    const boundedExits = exits.map((func) => (x: number, y: number) => inBounds(func(x, y), [width, height]));

    const trailheads = grid.map((line, y) => line.map((height, x) => height === 0 ? [x, y] : undefined).filter(loc => loc != undefined)
    ).flat();

    const sum = (x:number , y: number) => x + y;
    const score = ([x, y]: [number, number]) : number => {
        const height = grid[y][x];
        console.log(x, y, height);
        const newExits = boundedExits.map(func => func(x,y))
            .filter( loc => loc !== undefined)
            .map(([x, y]) => {
                console.log("   ", x, y, grid[y][x], height);
                if (grid[y][x] === 9) return 1;
                if (grid[y][x] === height + 1) return score([x, y]);
                return 0;
            })
            .reduce(sum);

        return newExits;
    };

    return trailheads.map(score).reduce(sum);
};

const expectedFirstSolution = 36;

const part2 = (input: string) => {
    return 'part 2';
};

const expectedSecondSolution = 'solution 2';

export { part1, expectedFirstSolution, part2, expectedSecondSolution };
