import { inspect } from 'util';

const parseInput = (input: string) =>
    input
        .split('\n')
        .map((line) => [...line])
        .filter((line) => line.length != 0);

const neighbours: { ([x, y]: [number, number]): [number, number] }[] = [
    ([x, y]) => [x + 1, y],
    ([x, y]) => [x - 1, y],
    ([x, y]) => [x, y + 1],
    ([x, y]) => [x, y - 1],
];

const perimeter = ([x, y]: [number, number], plots: string[][]): number =>
    neighbours
        .map((func) => func([x, y]))
        .filter((neighbour) => {
            const neighbour_row = plots[neighbour[1]];
            if (neighbour_row == undefined) return true;
            return neighbour_row[neighbour[0]] != plots[y][x];
        }).length;

const coalesce = (
    [x, y]: [number, number],
    region: [string, number, number],
    visited: boolean[][],
    regions: [string, number, number][][],
    indent: number = 0,
) => {
    if (visited[y][x]) return { region, visited };
    visited[y][x] = true;

    neighbours
        .map((func) => func([x, y]))
        .filter(([x, y]) => regions[y] && regions[y][x] && regions[y][x][0] === region[0])
        .map(([x, y]) => {
            let newRegion;
            ({ region: newRegion, visited } = coalesce([x, y], regions[y][x], visited, regions, indent + 1));
            console.log('    '.repeat(indent), newRegion);
            return newRegion;
        })
        .reduce((r1, r2) => [r1[0], r1[1] + r2[1], r1[2] + r2[2]], [region[0], 0, 0]);
    return { region, visited };
};

const part1 = (input: string) => {
    const grid = parseInput(input);

    const plots: [string, number, number][][] = grid.map((line, y) =>
        line.map(
            (plot, x) => [plot, perimeter([x, y], grid), 1], // plant, perimeter. grid
        ),
    );

    let visited = grid.map((line, y) => line.map((_) => false));

    const regions = [];

    grid.filter((line, y) =>
        line.filter((plot, x) => {
            let region;
            ({ region, visited } = coalesce([x, y], plots[y][x], visited, plots));
            console.log('New Region: ', region);
            regions.push(region);
        }),
    );

    console.log(inspect(regions));

    return regions.map(([_, perimeter, cost]) => perimeter * cost).reduce((lhs, rhs) => lhs + rhs);
};

const expectedFirstSolution = 1930;

const part2 = (input: string) => {
    return 'part 2';
};

const expectedSecondSolution = 'part 2';

export { part1, expectedFirstSolution, part2, expectedSecondSolution };
