type Point = [number, number];

const parseInput = (input: string): [Point, Point][] =>
    input
        .split('\n')
        .map((line) => line.split(' '))
        .filter((line) => line.length != 1)
        .map((line) => line.flatMap((chunk) => chunk.split('=')))
        .map((line) => line.flatMap((chunk) => chunk.split(',')))
        .map((line) => line.map(Number))
        .map((line) => line.filter((x) => !Number.isNaN(x)))
        .map(([a, b, c, d]: [number, number, number, number]) => [
            [a, b],
            [c, d],
        ]);

const sum = (lhs: Point, rhs: Point): Point => [lhs[0] + rhs[0], lhs[1] + rhs[1]];

const tick = (robots: [Point, Point][], bounds: Point): [Point, Point][] =>
    robots
        .map(([position, velocity]) => [sum(position, velocity), velocity])
        .map(([[x, y], velocity]) => {
            x = x < 0 ? x + bounds[0] : x;
            x = x >= bounds[0] ? x - bounds[0] : x;
            y = y < 0 ? y + bounds[1] : y;
            y = y >= bounds[1] ? y - bounds[1] : y;
            return [[x, y], velocity];
        });

const part1 = (input: string) => {
    let [[bounds, _], ...robots] = parseInput(input);
    for (let i = 0; i < 100; i++) {
        robots = tick(robots, bounds);
    }
    const centre: Point = bounds.map((c) => Math.floor(c / 2));
    const quadrants = Array(4).fill(0);

    robots.forEach(([[x, y], _]) => {
        if (x < centre[0]) {
            if (y < centre[1]) {
                quadrants[0]++;
                console.log(`Q1: [${x}, ${y}]`);
            } else if (y > centre[1]) {
                quadrants[1]++;
                console.log(`Q2: [${x}, ${y}]`);
            }
        } else if (x > centre[0]) {
            if (y < centre[1]) {
                quadrants[2]++;
                console.log(`Q3: [${x}, ${y}]`);
            } else if (y > centre[1]) {
                quadrants[3]++;
                console.log(`Q4: [${x}, ${y}]`);
            }
        }
    });

    console.log(quadrants);
    return quadrants.reduce((lhs, rhs) => lhs * rhs, 1);
};

const expectedFirstSolution = 12;
const inSamePlace = (lhs: [Point, Point], rhs: [Point, Point]) => lhs[0][0] == rhs[0][0] && lhs[0][1] == rhs[0][1];
const areEqual = (lhs: Point, rhs: Point) => lhs[0] == rhs[0] && lhs[1] == rhs[1];

const part2 = (input: string) => {
    let [[bounds, _], ...robots] = parseInput(input);
    let ticks = 0;
    while (!robots.every((lhs, idx, arr) => arr.findIndex((rhs) => inSamePlace(lhs, rhs)) === idx)) {
        robots = tick(robots, bounds);
        ticks++;
    }

    const positions = robots.map(robot => robot[0]);

    for(let y = 0; y < bounds[0]; y++) {
        for(let x = 0; x < bounds[0]; x++) {
            if(positions.find(p => areEqual(p, [x, y]))) {
                process.stdout.write("#");
            } else {
                process.stdout.write(".");
            }
        }
        console.log();
    }

    return ticks;
};

const expectedSecondSolution = 'part 2';

export { part1, expectedFirstSolution, part2, expectedSecondSolution };
