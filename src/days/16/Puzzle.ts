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
    position = structuredClone(position)
    switch (position.heading) {
        case "NORTH":
            position.heading = "EAST";
            break;
        case "EAST":
            position.heading = "SOUTH";
            break;
        case "SOUTH":
            position.heading = "WEST";
            break;
        case "WEST":
            position.heading = "NORTH";
            break;
    }
    return position;
};

const rotateAntiClockwise = (position: Position): Position => {
    position = structuredClone(position)
    switch (position.heading) {
        case "NORTH":
            position.heading = "WEST";
            break;
        case "EAST":
            position.heading = "NORTH";
            break;
        case "SOUTH":
            position.heading = "EAST";
            break;
        case "WEST":
            position.heading = "SOUTH";
            break;
    }
    return position;
};

const moveForward = (position: Position) => {
    position.location = directions.get(position.heading)!(position.location);
    return position;
};

const nextPositions = (position: Position, paths: Point[]): {position: Position, cost: number}[] => [
        {position: moveForward(structuredClone(position)), cost: 1},
        {position: rotateClockwise(structuredClone(position)), cost: 1000},
        {position: rotateAntiClockwise(structuredClone(position)), cost: 1000},
    ]
    .filter(pos => paths.find(path => equal(pos.position.location, path)  ));

const part1 = (input: string) => {
    const { position, exit, paths } = parseInput(input);

    const exits = [{location: exit, heading: "NORTH"}, {location: exit, heading: "EAST"}].map(positionId)
    const queue: string[] = [positionId(position)];

    const distances = new Map<string, number>();
    distances.set(positionId(position), 0);
    
    const predecessors = new Map<string, string>();
    const getDistance = (pid: string): number => distances.has(pid) ? distances.get(pid)! : Infinity;

    // console.log(nextPositions({location: [1,1], heading: "NORTH"}, paths))
    console.log(nextPositions({location: [1,1], heading: "NORTH"}, paths))
    
    while(queue.length != 0) {
        // process.stdout.write(queue.length.toString() + "\n");
         
        // get queue member with shortest distance
        const currId = queue.reduce((min, val) => getDistance(min) > getDistance(val) ? val : min);

        // remove from queue
        queue.splice(queue.indexOf(currId), 1);

        // if we're at the end, then we're done.
        if(exits.includes(currId)) break;
        const distance = getDistance(currId);

        // console.log(currId, distance);

        // for each neighbour of current,
        nextPositions(getPosition(currId), paths).forEach(({position: nextPosition, cost}) => {
            const nextId = positionId(nextPosition);
            const alt = distance + cost;
            if (alt < getDistance(nextId) ) {
                predecessors.set(nextId, currId);
                distances.set(nextId, alt);
                if(!queue.includes(nextId)) queue.push(nextId);
            }
        })
    }
    
    return exits.map(e => getDistance(e))
};

const expectedFirstSolution = 11048;

const part2 = (input: string) => {
    return 'part 2';
};

const expectedSecondSolution = 'part 2';

export { part1, expectedFirstSolution, part2, expectedSecondSolution };
