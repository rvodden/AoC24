type Point = [number, number];

type Heading = { ([x, y]: [number, number]): [number, number] };

const directions = new Map<string, Heading>([
    ["EAST", ([x, y]) => [x + 1, y]],
    ["WEST", ([x, y]) => [x - 1, y]],
    ["SOUTH" , ([x, y]) => [x, y + 1]],
    ["NORTH" , ([x, y]) => [x, y - 1]],
]);

const equal = ([x1, y1]: [number, number], [x2, y2]: [number, number]): boolean => x1 === x2 && y1 === y2;

type Position = {
    location: Point;
    heading: string;
};

const positionId = (p: Position): string => `${p.location[0]},${p.location[1]},${p.heading}`;
const getPosition = (id: string): Position => {
    const [x, y, heading] = id.split(",");
    return { location: [Number(x), Number(y)], heading };
}

const parseInput = (input: string) => {
    let exit: Point;
    let position: Position;
    const paths: Point[] = [];

    input.split('\n').forEach((line, y) => {
        [...line].forEach((char, x) => {
            switch (char) {
                case '.':
                    paths.push([x, y]);
                    break;
                case 'S':
                    position = {
                        location: [x, y],
                        heading: "EAST",
                    };
                    break;
                case 'E':
                    paths.push([x, y]);
                    exit = [x, y];
                    break;
            }
        });
    });

    return { position, exit, paths };
};

const rotateClockwise = (position: Position): Position => {
    switch (position.heading) {
        case "NORTH":
            position.heading = "EAST";
        case "EAST":
            position.heading = "SOUTH";
        case "SOUTH":
            position.heading = "WEST";
        case "WEST":
            position.heading = "NORTH";
    }
    return position;
};

const rotateAntiClockwise = (position: Position): Position => {
    switch (position.heading) {
        case "NORTH":
            position.heading = "WEST";
        case "EAST":
            position.heading = "NORTH";
        case "SOUTH":
            position.heading = "EAST";
        case "WEST":
            position.heading = "SOUTH";
    }
    return position;
};

const moveForward = (position: Position) => {
    position.location = directions.get(position.heading)!(position.location);
    return position;
};

const nextPositions = (position: Position, paths: Point[]): {position: Position, cost: number}[] => [
        {position: moveForward(position), cost: 1},
        {position: rotateClockwise(position), cost: 1000},
        {position: rotateAntiClockwise(position), cost: 1000},
    ].filter(pos => paths.find(path => equal(pos.position.location, path)));

const part1 = (input: string) => {
    console.log("Your mum!")
    const { position, exit, paths } = parseInput(input);

    const exits = [{location: exit, heading: "NORTH"}, {location: exit, heading: "EAST"}].map(positionId)

    const queue = paths.flatMap(path =>
        ["NORTH", "SOUTH", "EAST", "WEST"].map(dir => ({location: path, heading: dir }))
    ).map(positionId);

    const distances = new Map<string, number>();
    distances.set(positionId(position), 0);
    
    const predecessors = new Map<string, string>();

    const getDistance = (pid: string): number => distances.get(pid) != undefined ? distances.get(pid) : Infinity;

    while(queue.length != 0) {
        const curr = queue.reduce((min, val) => getDistance(min) > getDistance(val) ? val : min);
        queue.splice(queue.indexOf(curr), 1);

        nextPositions(getPosition(curr), paths).forEach(({position, cost}) => {
            const alt = getDistance(curr) + cost;
            if (alt < getDistance(positionId(position))) {
                distances.set(positionId(position), alt);
                predecessors.set(positionId(position), curr);
            }
        })
    }

    console.log("Done!");
};

const expectedFirstSolution = 11048;

const part2 = (input: string) => {
    return 'part 2';
};

const expectedSecondSolution = 'part 2';

export { part1, expectedFirstSolution, part2, expectedSecondSolution };
