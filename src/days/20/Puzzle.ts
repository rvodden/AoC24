type Point = [number, number];
const equal = ([x1, y1]: [number, number], [x2, y2]: [number, number]): boolean => x1 === x2 && y1 === y2;

const pointId = (p: Point): string => `${p[0]},${p[1]}`;
const getPoint = (id: string): Point => {
    const [x, y] = id.split(",");
    return [Number(x), Number(y)];
}

const parseInput = (input: string) => {
    let exit: Point;
    let position: Point;
    const paths: Point[] = [];
    const walls: Point[] = [];

    const width = input.indexOf("\n");
    const height = input.length / width - 1;
    const bounds: Point = [width, height];

    input.split('\n').forEach((line, y) => {
        [...line].forEach((char, x) => {
            switch (char) {
                case '.':
                    paths.push([x, y]);
                    break;
                case '#':
                    walls.push([x, y]);
                    break;
                case 'S':
                    position = [x,y];
                    paths.push([x, y]);
                    break;
                case 'E':
                    paths.push([x, y]);
                    exit = [x, y];
                    break;
            }
        });
    });

    return { position, exit, paths, walls, bounds };
};

const nextPositions = (position: Point, paths: Point[]): Point[] => 
    neighbours.map(n => n(position))
    .filter(pos => paths.find(path => equal(pos, path)  ));

const neighbours: { (p: Point): Point }[] = [
     ([x, y]) => [x + 1, y],
     ([x, y]) => [x - 1, y],
     ([x, y]) => [x, y + 1],
     ([x, y]) => [x, y - 1],
];

const dijkstra = (position: Point, exit: Point, paths: Point[], limit = Infinity) => {

    const queue: string[] = [pointId(position)];

    const distances = new Map<string, number>();
    distances.set(pointId(position), 0);
    
    const predecessors = new Map<string, string>();
    const getDistance = (pid: string): number => distances.has(pid) ? distances.get(pid)! : Infinity;

    while(queue.length != 0) {
        // get queue member with shortest distance
        const currId = queue.reduce((min, val) => getDistance(min) > getDistance(val) ? val : min);

        // remove from queue
        queue.splice(queue.indexOf(currId), 1);

        // if we're at the end, then we're done.
        if(equal(exit, position)) break;
        const distance = getDistance(currId);
        if(distance == limit) break;

        // for each neighbour of current,
        nextPositions(getPoint(currId), paths).forEach(nextPosition => {
            const nextId = pointId(nextPosition);
            const alt = distance + 1;
            if (alt < getDistance(nextId) ) {
                predecessors.set(nextId, currId);
                distances.set(nextId, alt);
                if(!queue.includes(nextId)) queue.push(nextId);
            }
        })
    }
    return distances;
};

const part1 = (input: string) => {
    const { position, exit, paths, walls, bounds } = parseInput(input);
    const distances = dijkstra(position, exit, paths);
    
    const innerWalls = walls.filter(([x, y]) => 0 < x && x < (bounds[0] - 1) && 0 < y && y < (bounds[1] - 1));

    const savings = innerWalls.map(wall => {
        const neighbours = nextPositions(wall, paths);
        if ( neighbours.length <= 1) return 0;

        const neighbour_distances = neighbours.map(neighbour => distances.get(pointId(neighbour))!)
        return Math.max(...neighbour_distances) - Math.min(...neighbour_distances) - 2;
    })
    // .reduce((map, val) => {
    //     const newValue = map.get(val);
    //     map.set(val, newValue == undefined ? 1 : newValue + 1 )
    //     return map
    // }, new Map<number, number>());
    .filter(s => s >= 100).length;

    return savings;
};

const expectedFirstSolution = 0;

const product = (walls: Point[]): Point[][] => {
    const result: Point[][] = [[]];
    walls.forEach((wall1, index) => 
        walls.slice(index + 1).forEach(wall2 => result.push([wall1, wall2]))
    );
    return result;
}

const part2 = (input: string) => {
    const { position, exit, paths, walls, bounds } = parseInput(input);
    const distances = dijkstra(position, exit, paths);
    
    const innerWalls = walls.filter(([x, y]) => 0 < x && x < (bounds[0] - 1) && 0 < y && y < (bounds[1] - 1))
    const cheats = product(innerWalls).filter(x => x.length == 2);
    
    const cheatReduction = cheats.map(([begin, end]) => {
        const cheatDistance = dijkstra(begin, end, walls, 18).get(pointId(end));
        if (cheatDistance === undefined) return;
        const neighbours = [...nextPositions(begin, paths), ...nextPositions(end, paths)].map(x => distances.get(pointId(x)));
        const realDistance =  Math.max(...neighbours) - Math.min(...neighbours);
        return realDistance - cheatDistance - 2;
    }).filter(x => x !== undefined).filter(x => x >= 50)
    .reduce((map, val) => {
        const newValue = map.get(val);
        map.set(val, newValue == undefined ? 1 : newValue + 1 )
        return map
    }, new Map<number, number>());
    console.log(cheatReduction);
  return 'part 2';
};

const expectedSecondSolution = 'part 2';

export { part1, expectedFirstSolution, part2, expectedSecondSolution };
