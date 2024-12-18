type Point = [number, number];

const parseInput = (input: string): { exit: Point, memory: Point[], nanoseconds: number } => {
    // I've added the bounds to the top of the input file, as they vary between the example and the real deal
    const [conditionsText, memoryText] = input.split('\n\n');
    const [exitText, nanoSecondsText] = conditionsText.split("\n");
    const exit = exitText.split(',').map(Number);
    const nanoseconds = Number(nanoSecondsText);
    const memory = memoryText
        .split('\n')
        .map((line) => line.split(',').map(Number))
        .filter((line) => line.length == 2);

    return { exit, memory, nanoseconds };
};

const zip = <T1, T2>(a: T1[], b: T2[]): [T1, T2][] => a.map((k, i) => [k, b[i]]);
const equal = <T>(list1: T[], list2: T[]) => zip(list1, list2.flat()).every(([a, b]) => a === b)

const neighbours = (bounds: Point, walls: Point[]): { ([x, y]: Point ): Point[] } => ([x, y]) => [
    [x + 1, y],
    [x - 1, y],
    [x, y + 1],
    [x, y - 1],
]
.filter(([x,y]: Point) => 0 <= x && x <= bounds[0] && 0 <= y && y <= bounds[1])
.filter((neighbour: Point) => walls.find(wall => equal(wall, neighbour)) === undefined) as Point[];

const pointId = (p:Point): string => `${p[0]},${p[1]}`;
const pointFromId = (s:String): Point => s.split(",").map(Number) as Point;


const findDistance = (exit: Point, memory: Point[]): number | undefined => {
    const queue: Point[] = [];

    const distances = new Map<string, number>();
    const prev = new Map<string, Point>();

    const getDistance = (node: Point): number => distances.has(pointId(node)) ? distances.get(pointId(node))! : Infinity;
    const setDistance = (node: Point, cost: number) => distances.set(pointId(node), cost);
    const getPrev = (node: Point) => prev.get(pointId(node));
    const setPrev = (node: Point, p: Point) => prev.set(pointId(node), p);

    queue.push([0,0]);
    distances.set(pointId([0,0]), 0);


    const constructPath = (current?: Point) => {
        let path = [];
        do {
            path.unshift(current)
            current = getPrev(current!)
        } while (current != undefined)
        return path;
    }

    while(queue.length !== 0) {
        // get queue member with shortest distance
        const [current, _]: [Point, number] = queue.reduce(
            ([minPoint, minDistance], curr: Point) => 
                getDistance(curr) < minDistance ? [curr, getDistance(curr)] : [minPoint, minDistance], 
            [[0,0], Infinity]
        );

        // remove from queue
        queue.splice(queue.findIndex(p => equal(p, current)), 1);

        // if we're at the end, then we're done.
        if(equal(current, exit)) return getDistance(exit);

        // for each neighbour of current,
        for(const neighbour of neighbours(exit, memory)(current)) {
            let cost = getDistance(current) + 1;        // work out the cost to get to the neighbour via current.
            if( cost < getDistance(neighbour) ) {       // if it is less than the way we got their last time (if any)
                setPrev(neighbour, current);        // then set this route as the correct one
                setDistance(neighbour, cost);       // assign this costs as the cost to get to this neighbour
                if( queue.find(p => equal(p, neighbour)) === undefined) queue.push(neighbour); // stick the neighbour in the queue if he's not already there.
            }
        }
    }

    return;
}

const part1 = (input: string) => {
    const { exit, memory, nanoseconds } = parseInput(input);
    const fallenMemory = memory.slice(0, nanoseconds);

    return findDistance(exit, fallenMemory);
};

const expectedFirstSolution = 22;

const part2 = (input: string) => {
    const { exit, memory, nanoseconds } = parseInput(input);
    let lowerBound = nanoseconds;
    let upperBound = memory.length;

    
    while(lowerBound != upperBound) {
        const test = Math.ceil(( upperBound + lowerBound ) / 2);       
        const fallenMemory = memory.slice(0, test);


        const succeeded = (findDistance(exit, fallenMemory) !== undefined);
        if(succeeded) {
            lowerBound = test;
        } else {
            upperBound = test - 1;
        }
    }

    const result =  memory[upperBound];

    return `${result[0]},${result[1]}`
};

const expectedSecondSolution = '6,1';

export { part1, expectedFirstSolution, part2, expectedSecondSolution };
