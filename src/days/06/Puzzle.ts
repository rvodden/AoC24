import { PipelineTransform } from "stream";
import { N } from "vitest/dist/chunks/reporters.D7Jzd9GS.js";

type Point = [number, number];

const sum = ([x1, y1]: Point, [x2, y2]: Point): Point => [x1 + x2, y1 + y2];
const subtract = ([x1, y1]: Point, [x2, y2]: Point): Point => [x1 - x2, y1 - y2];
const areEqual = ([x1, y1]: Point, [x2, y2]: Point): boolean => x1 === x2 && y1 === y2;

const North = [0, -1] as Point;
const South = [0, 1] as Point;
const East = [-1, 0] as Point;
const West = [1, 0] as Point;

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

const tracePath = (obstructions: Point[], start_position: Point, bounds: Point) => {
    let heading = North;
    let position = start_position;
    let positions: [Point, Point][] = []; // position, heading
    do {
        if (!positions.find((p) => areEqual(p[0], position))) positions.push([position, heading]);

        let new_position = sum(position, heading);
        let obstruction;
        while ((obstruction = obstructions.find((p) => areEqual(p, new_position))) !== undefined) {
            heading = rotateClockwise(heading);
            new_position = sum(position, heading);
        }
        position = new_position;
    } while (inBounds(position, bounds));

    return positions;
};

const part1 = (input: string) => {
    const { obstructions, position: start_position, bounds } = parseInput(input);
    const positions = tracePath(obstructions, start_position, bounds);

    return positions.length;
};

const expectedFirstSolution = 41;

const nextPosition = (position: Point, heading: Point, obstructions: Point[]): { position: Point, heading: Point } | undefined => {
    let filter : { (target: Point) : Boolean};
    let reduction : { (accumulator: Point, currentValue: Point) : Point }
    if(areEqual(heading, North)) {
        filter = (p) => isNorthOf(p, position);
        reduction = (a, p) => a[0] < p[0] ? a : p;
    }
    else if (areEqual(heading, South)) {
        filter = (p) => isSouthOf(p, position);
        reduction = (a, p) => a[0] > p[0] ? a : p;
    }
    else if (areEqual(heading, East)) {
        filter = (p) => isEastOf(p, position);
        reduction = (a, p) => a[1] < p[1] ? a : p;
    }
    else if (areEqual(heading, West)) {
        filter = (p) => isWestOf(p, position);
        reduction = (a, p) => a[1] > p[1] ? a : p;
    }
    
    const nextObstructions = obstructions.filter(filter)
    if(nextObstructions.length === 0) {
        return
    }
    const nextObstruction = nextObstructions.reduce(reduction);
    return {position: subtract(nextObstruction, heading), heading: rotateClockwise(heading)};
}

const pointsBetween = (start: Point, end: Point) : Point[] => {
    if (start[0] === end[0]) {
        let [s,e] = [start[1], end[1]].sort();
        return [...Array(e - s)].map(x => [start[0], x + s + 1])
    }

    if (start[1] == end[1]) {
        let [s,e] = [start[0], end[0]].sort();
        return [...Array(e - s)].map(x => [x + s + 1, start[1]])
    }

    throw new Error("Points are not on the same row or collumn");
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
        // if we've been here before, throw an exception
        // TODO: we need to beef up loop detection so that it looks for lines crossing
        if(positions.find(([oldPosition, oldHeading]) => areEqual(position, oldPosition) && areEqual(heading, oldHeading)) !== undefined) {
            throw new Error("This is a loop!");
        }

        positions.push([position, heading]);
        let {position: newPosition, heading: newHeading } = nextPosition(position, heading, obstructions)!;

        if(!newPosition) break;

        position = newPosition;
        heading = newHeading;
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
    
    console.log(isNorthOf([4,0],[4,6]))

    let np : {position: Point, heading: Point} | undefined = {position: startPosition, heading: North};
    console.log(np);
    do {
        np = nextPosition(np.position, np.heading, obstructions);
        console.log(np);
    } 
    while(np);

    // positions.forEach(([position, heading]) => {
    //     const obstaclePosition = sum(position, heading);

    //     if(areEqual(obstaclePosition, startPosition)) return;

    //     try {
    //         tracePathP2([...obstructions, obstaclePosition], bounds, startPosition);
    //     } catch (error) {
    //         newObstaclePositions.push([obstaclePosition, heading])
    //     }

    // });

    // newObstaclePositions.forEach(([position, ]) => console.log(`(${position[0]},${position[1]})`));
    // return newObstaclePositions.length
};

const expectedSecondSolution = 6;

export { part1, expectedFirstSolution, part2, expectedSecondSolution };

        // // check if there is a super easy loop to detect        
        // collisions.forEach(({obstruction, collisionHeading, collisionIndex}) => {
        //     // ignore future collisions, as may not cause a loop
        //     if (collisionIndex > positionIndex) {
        //         return;
        //     }
            
        //     // ignore collisions with an inappropriate heading
        //     if (!areEqual(collisionHeading, rightHeading)) {
        //         return;
        //     }
            
        //     // we cannot place an obstacle where the guard starts
        //     if(areEqual(newPosition, startPosition)) {
        //         return;
        //     }

        //     // ignore if we are going North, and the obstruction is not West of us
        //     if (areEqual(heading, North) && isWestOf(obstruction, position)) return;

        //     // ignore if we are going South, and the obstruction is not East of us
        //     if (areEqual(heading, South) && isEastOf(obstruction, position)) return;

        //     // ignore if we are going East, and the obstruction is not South of us
        //     if (areEqual(heading, East) && isSouthOf(obstruction, position)) return;
            
        //     // ignore if we are going West, and the obstruction is not North of us
        //     if (areEqual(heading, West) && isNorthOf(obstruction, position)) return;

        //     newObstaclePositions.push([newPosition, heading])
        // })
