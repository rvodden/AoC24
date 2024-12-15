type Point = [number, number];

enum Contents {
    EMPTY,
    BOX,
    WALL,
    ROBOT
}

const up = ([x, y]: Point): Point => [x, y - 1];
const down = ([x, y]: Point): Point => [x, y + 1];
const left = ([x, y]: Point): Point => [x - 1, y];
const right = ([x, y]: Point): Point => [x + 1, y];

const neighbours: { ([x, y]: Point): Point }[] = [
    up,
    down,
    left,
    right
];

const parseInput = (input: string) : { map: Contents[][], directions: { ([x, y]: Point): Point }[], position: Point} => {
    const walls: Point[] = [];
    const boxes: Point[] = [];
    let postition: Point;

    const [mapText, directionText] = input.split("\n\n");

    const maxX = mapText.indexOf("\n");
    const maxY = (mapText.length + 1) / maxX - 1;

    let position: Point;
    const map = mapText.split("\n").map((line, y) =>
        [...line].map((char, x) => {
            switch(char) {
                case "#":
                    return Contents.WALL;
                case ".":
                    return Contents.EMPTY;
                case "O":
                    return Contents.BOX;
                case "@":
                    position = [x,y];
                    return Contents.ROBOT;
            }
        })
    )

    const directions = [...directionText.replaceAll("\n", "")].map(char => {
        switch(char) {
            case "^": 
                return up;
            case "v": 
                return down;
            case "<": 
                return left;
            case ">": 
                return right;
        }
    })
    return { map, directions, position };
}

const move = ([x, y]: Point, direction: {([x, y]: Point): Point}, map: Contents[][]): [Contents[][], Point] => {
    const [newX, newY] = direction([x, y]);
    const destinationContents = map[newY][newX];
    switch(destinationContents) {
        case Contents.BOX:
            // try and move the box out of the way
            const [newMap, _] = move([newX, newY], direction, map);

            // if it moved
            if (newMap[newY][newX] === Contents.EMPTY) {
                // use the space
                newMap[newY][newX] = map[y][x];
                newMap[y][x] = Contents.EMPTY;
                return [newMap, [newX, newY]]
            }

            return [map, [x, y]];
        case Contents.EMPTY:
            map[newY][newX] = map[y][x];
            map[y][x] = Contents.EMPTY;
            return [map, [newX, newY]];
        case Contents.WALL:
            return [map, [x, y]];
    }
    return [map, [x, y]];
}


const part1 = (input: string) => {
    const {map, directions, position} = parseInput(input);
    const [newMap, newPosition] =  directions.reduce(([map, position], direction) => move(position, direction, map), [map, position])
    // const [newMap, newPosition] = move(position, up, map);
   
    console.log(newMap);

    return newMap.map((row, y) => row.map(
            (content, x) => content === Contents.BOX ? (x + 100 * y) : 0)
            .reduce((lhs, rhs) => lhs + rhs, 0)
        )
        .reduce((lhs, rhs) => lhs + rhs, 0);
};

const expectedFirstSolution = 10092;

const part2 = (input: string) => {
  return 'part 2';
};

const expectedSecondSolution = 'part 2';

export { part1, expectedFirstSolution, part2, expectedSecondSolution };
