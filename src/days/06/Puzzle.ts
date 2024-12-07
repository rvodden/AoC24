type Point = [number, number];

const sum = ([x1, y1]: Point, [x2, y2]: Point): Point => [x1 + x2, y1 + y2];
const areEqual = ([x1, y1]: Point, [x2, y2]: Point): boolean => x1 === x2 && y1 === y2;

const Up = [0, -1] as Point;
const Down = [0, 1] as Point;
const Left = [-1, 0] as Point;
const Right = [1, 0] as Point;

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

const inBounds = (position: Point, bounds: Point): boolean => {
    return position[0] >= 0 && position[0] < bounds[0] && position[1] >= 0 && position[1] < bounds[1];
};

const tracePath = (obstructions: Point[], start_position: Point, bounds: Point) => {
    let heading = Up;
    let position = start_position;
    let positions: [Point, Point][] = []; // position, heading
    let collisions: [Point, Point, number][] = []; // heading, obstruction, index
    let index = 0
    do {
        if (!positions.find((p) => areEqual(p[0], position))) positions.push([position, heading]);

        let new_position = sum(position, heading);
        let obstruction;
        if ((obstruction = obstructions.find((p) => areEqual(p, new_position))) !== undefined) {
            collisions.push([heading, obstruction, index]);
            heading = rotateClockwise(heading);
            new_position = sum(position, heading);
        }
        position = new_position;
        index++;
    } while (inBounds(position, bounds));

    return { positions, collisions };
};

const tracePathP2 = (obstructions: Point[], start_position: Point, bounds: Point) => {
    let heading = Up;
    let position = start_position;
    let positions: [Point, Point][] = []; // position, heading
    let collisions: [Point, Point, number][] = []; // heading, obstruction, index
    let index = 0
    do {
        positions.push([position, heading]);

        let new_position = sum(position, heading);
        let obstruction;
        if ((obstruction = obstructions.find((p) => areEqual(p, new_position))) !== undefined) {
            collisions.push([heading, obstruction, index]);
            heading = rotateClockwise(heading);
            index++;
            continue;
        }
        position = new_position;
        index++;
    } while (inBounds(position, bounds));

    return { positions, collisions };
};

const part1 = (input: string) => {
    const { obstructions, position: start_position, bounds } = parseInput(input);
    const { positions, collisions } = tracePath(obstructions, start_position, bounds);

    return positions.length;
};

const expectedFirstSolution = 41;

const part2 = (input: string) => {
    const { obstructions, position: start_position, bounds } = parseInput(input);
    const { positions, collisions } = tracePathP2(obstructions, start_position, bounds);
    console.log(positions);
    const potential_positions: [Point, Point][] = []; // position & heading

    collisions.forEach(([collision_heading, obstruction, index]) => {
        // console.log(`Checking collision: ${collision_heading}: ${obstruction}`);

        let check: (position: Point, path_heading: Point) => boolean;
        const needed_path_heading = rotateAnticlockwise(collision_heading) as Point;
        // console.log(`Needed path heading: ${needed_path_heading}`);

        if (areEqual(collision_heading, Up)) { // collision heading upwards
            check = ( position, path_heading ) =>
                areEqual(path_heading,needed_path_heading) && position[0] === obstruction[0] && position[1] > obstruction[1];
        } else if (areEqual(collision_heading, Down)) {
            check = ( position, path_heading ) =>
                areEqual(path_heading,needed_path_heading) && position[0] === obstruction[0] && position[1] < obstruction[1];
        } else if (areEqual(collision_heading, Left)) {
            check = ( position, path_heading ) =>
                areEqual(path_heading,needed_path_heading) && position[0] > obstruction[0] && position[1] === obstruction[1];
        } else if (areEqual(collision_heading, Right)) {
            check = ( position, path_heading ) =>
                areEqual(path_heading,needed_path_heading) && position[0] < obstruction[0] && position[1] === obstruction[1];
        }

        positions.slice(index).forEach(([position, path_heading]) => {
            // console.log(`Checking position: ${position}, heading: ${path_heading}`);        
            if (check(position, path_heading)) {
                // console.log("success!")
                potential_positions.push([position, path_heading]);
            }
        });
    });
    
    // console.log(potential_positions);
    return potential_positions.length;
};

const expectedSecondSolution = 6;

export { part1, expectedFirstSolution, part2, expectedSecondSolution };
