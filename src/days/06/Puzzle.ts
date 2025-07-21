type Point = [number, number];

const sum = ([x1, y1]: Point, [x2, y2]: Point): Point => [x1 + x2, y1 + y2];
const subtract = ([x1, y1]: Point, [x2, y2]: Point): Point => [x1 - x2, y1 - y2];
const areEqual = ([x1, y1]: Point, [x2, y2]: Point): boolean => x1 === x2 && y1 === y2;

const North = [0, -1] as Point;
const South = [0, 1] as Point;
const East = [1, 0] as Point;
const West = [-1, 0] as Point;

/**
 * @returns true if target is due east of reference 
 */
const isEastOf = (target: Point, reference: Point) => reference[1] === target[1] && target[0] > reference[0]
const isWestOf = (target: Point, reference: Point) => reference[1] === target[1] && target[0] < reference[0]
const isSouthOf = (target: Point, reference: Point) => reference[0] === target[0] && target[1] > reference[1]
const isNorthOf = (target: Point, reference: Point) => reference[0] === target[0] && target[1] < reference[1]

const rotateClockwise = ([x, y]: Point): Point => [-y, x];
const rotateAnticlockwise = ([x, y]: Point): Point => [y, -x];

const parseInput = (input: string): { obstructions: Point[]; position: Point; bounds: Point } => {
    const obstructions: Point[] = [];

    const width = input.indexOf('\n');
    const height = input.length / width - 1;
    const bounds = [width, height] as Point;

    let position: Point = [0, 0];

    input.split('\n').forEach((line, y) => {
        [...line].forEach((character, x) => {
            switch (character) {
                case '#':
                    obstructions.push([x, y]);
                    break;
                case '^':
                    position = [x, y];
                    break;
            }
        });
    });

    return { obstructions, position, bounds };
};


/**
 * @returns true if `position` is within `bounds`; false otherwise
 */
const inBounds = (position: Point, bounds: Point): boolean => {
    return position[0] >= 0 && position[0] < bounds[0] && position[1] >= 0 && position[1] < bounds[1];
};

const tracePath = (obstructions: Point[], bounds: Point, start_position: Point) => {
    let heading = North;
    let position = start_position;
    let positions: [Point, Point][] = []; // position, heading
    do {
        positions.push([position, heading])
        
        let new_position = sum(position, heading);
        if (obstructions.find((p) => areEqual(p, new_position)) !== undefined) {
            heading = rotateClockwise(heading);
            continue;
        }
        position = new_position;
    } while (inBounds(position, bounds));

    return positions;
};

const part1 = (input: string) => {
    const { obstructions, position: startPosition, bounds } = parseInput(input);
    const positions = tracePath(obstructions, bounds, startPosition);
    
    // obstructions.forEach(o => console.log(`(${o[0] + 1},${o[1] + 1})`))
    const uniquePositions = positions.filter(
        (value, index, array) => {
            const position = array.findIndex(v2 => areEqual(v2[0], value[0]))
            return index === position
        }
    );
    // uniquePositions.forEach(([position, heading]) => console.log(`(${position[0] + 1},${position[1] + 1}) : (${heading[0]},${heading[1]})`));
    return uniquePositions.length;
};

const expectedFirstSolution = 41;

const nextPosition = (position: Point, heading: Point, obstructions: Point[]): { position: Point, heading: Point } | undefined => {
    let filter : { (target: Point) : Boolean};
    let reduction : { (accumulator: Point, currentValue: Point) : Point }
    if(areEqual(heading, North)) {
        filter = (p) => isNorthOf(p, position);
        reduction = (a, p) => a[1] > p[1] ? a : p;
    }
    else if (areEqual(heading, South)) {
        filter = (p) => isSouthOf(p, position);
        reduction = (a, p) => a[1] < p[1] ? a : p;
    }   
    else if (areEqual(heading, East)) {
        filter = (p) => isEastOf(p, position);
        reduction = (a, p) => a[0] < p[0] ? a : p;
    }
    else if (areEqual(heading, West)) {
        filter = (p) => isWestOf(p, position);
        reduction = (a, p) => a[0] > p[0] ? a : p;
    }
    
    const nextObstructions = obstructions.filter(filter)
    if(nextObstructions.length === 0) {
        return
    }
    const nextObstruction = nextObstructions.reduce(reduction);
    return {position: subtract(nextObstruction, heading), heading: rotateClockwise(heading)};
}

class LoopError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

/**
 * Follow the path of the security guard from start position. When an
 * obstruction is encontered, rotate clockwise, then continue.
 * 
 * This version of the function keeps track of all the colisions and the 
 * heading at the point the collision took place.
 * 
 * @param obstructions   An array of obstructions found on the grid
 * @param startPosition The starting position
 * @param bounds         The bounds of the grid
 * @returns a list of the positions the guard has been in, and a list of the collisions
 */
const tracePathP2 = (obstructions: Point[], bounds: Point, startPosition: Point) => {
    let heading = North;
    let position = startPosition;
    let positions: [Point, Point][] = [];

    do {
        if(positions.find(([oldPosition, oldHeading]) => areEqual(position, oldPosition) && areEqual(heading, oldHeading)) !== undefined) {
            throw new LoopError("This is a loop!");
        }

        positions.push([position, heading]);
        const np = nextPosition(position, heading, obstructions)!;

        if(!np) break;

        ({ position, heading } = np);
    } while (true);

    return { positions };
};

/**
 * Part 2
 *
 * For every position on the guards walk, see if adding an obstacle in front
 * would cause the guard to return to a position already visited
 * 
 * @param input 
 * @returns the answer
 */
const part2 = (input: string) => {
    const { obstructions, position: startPosition, bounds } = parseInput(input);
    const positions = tracePath(obstructions, bounds, startPosition);
    const newObstaclePositions: [Point, Point][] = []; // position & heading
    
    positions.forEach(([position, heading]) => {
        const obstaclePosition = sum(position, heading);

        if(!inBounds(obstaclePosition, bounds)) return;

        if(areEqual(obstaclePosition, startPosition)) return;

        try {
            tracePathP2([...obstructions, obstaclePosition], bounds, startPosition);
        } catch (error) {

            if( error instanceof LoopError)
                newObstaclePositions.push([obstaclePosition, heading])
            else
                throw(error);
        }

    });

    const uniqueNewObstaclePositions = newObstaclePositions.filter(
        (value, index, array) => {
            const position = array.findIndex(v2 => areEqual(v2[0], value[0]))
            return index === position
        }
    );
    // uniqueNewObstaclePositions.forEach(([position, ]) => console.log(`(${position[0]},${position[1]})`));
    return uniqueNewObstaclePositions.length
};

const expectedSecondSolution = 6;

export { part1, expectedFirstSolution, part2, expectedSecondSolution };

