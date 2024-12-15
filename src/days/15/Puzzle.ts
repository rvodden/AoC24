type Point = [number, number];

const up = ([x, y]: Point): Point => [x, y - 1];
const down = ([x, y]: Point): Point => [x, y + 1];
const left = ([x, y]: Point): Point => [x - 1, y];
const right = ([x, y]: Point): Point => [x + 1, y];

const equal = (lhs: Point, rhs: Point): boolean => lhs[0] === rhs[0] && lhs[1] === rhs[1];

const parseInput = (
    input: string,
): { boxes: Point[]; walls: Point[]; directions: { ([x, y]: Point): Point }[]; position: Point } => {
    const walls: Point[] = [];
    const boxes: Point[] = [];
    let postition: Point;

    const [mapText, directionText] = input.split('\n\n');

    const maxX = mapText.indexOf('\n');
    const maxY = (mapText.length + 1) / maxX - 1;

    let position: Point;
    const map = mapText.split('\n').map((line, y) =>
        [...line].map((char, x) => {
            switch (char) {
                case '#':
                    walls.push([x, y]);
                    break;
                case 'O':
                    boxes.push([x, y]);
                    break;
                case '@':
                    position = [x, y];
                    break;
            }
        }),
    );

    const directions = [...directionText.replaceAll('\n', '')].map((char) => {
        switch (char) {
            case '^':
                return up;
            case 'v':
                return down;
            case '<':
                return left;
            case '>':
                return right;
            default:
                console.error('epic fail');
                process.exit(-1);
        }
    });
    return { boxes, walls, directions, position };
};

const isIn = (p: Point, collection: Point[]): boolean => collection.find((item) => equal(item, p)) != undefined;

const moveBox = (
    position: Point,
    direction: { ([x, y]: Point): Point },
    boxes: Point[],
    walls: Point[],
): Point[] | undefined => {
    const newPosition = direction(position);
    if (isIn(newPosition, walls)) {
        // is there a wall in the way?
        return;
    }

    if (isIn(newPosition, boxes)) {
        // is there a box in the way?
        const newBoxes = moveBox(newPosition, direction, boxes, walls); // try and shift it
        if (newBoxes === undefined) {
            // box didn't move
            return; // return original state
        }
        boxes = newBoxes;
    }

    // move the box to the new place.
    boxes.splice(
        boxes.findIndex((box) => equal(box, position)),
        1,
    );
    boxes.push(newPosition);

    return boxes;
};

const move = (
    position: Point,
    direction: { ([x, y]: Point): Point },
    boxes: Point[],
    walls: Point[],
): { position: Point; boxes: Point[] } => {
    const newPosition = direction(position);

    if (isIn(newPosition, walls)) {
        // is there  wall in the way?
        return { position, boxes }; // bail out
    }

    if (isIn(newPosition, boxes)) {
        // is there a box in the way?
        const newBoxes = moveBox(newPosition, direction, boxes, walls); // try and move it

        if (newBoxes === undefined) {
            // if box didn't move
            return { position, boxes }; // bail out
        }
        boxes = newBoxes;
    }

    return { position: newPosition, boxes };
};

const part1 = (input: string) => {
    const { boxes, walls, directions, position } = parseInput(input);
    console.log(boxes);

    const { boxes: newBoxes } = directions.reduce(
        ({ position, boxes }, direction) => move(position, direction, boxes, walls),
        { position, boxes },
    );
    console.log(newBoxes);
    return boxes.map(([x, y]) => y * 100 + x).reduce((lhs, rhs) => lhs + rhs, 0);
};

const expectedFirstSolution = 10092;

const equalBoxes = (lhs: [Point, Point], rhs: [Point, Point]): boolean => equal(lhs[0], rhs[0]) && equal(lhs[1], rhs[1]);
const containedInBox = ( lhs: Point, rhs: [Point, Point]): boolean => equal(lhs, rhs[0]) || equal(lhs, rhs[1]);

const parseInputP2 = (
    input: string,
): { boxes: [Point, Point][]; walls: Point[]; directions: { ([x, y]: Point): Point }[]; position: Point } => {
    const walls: Point[] = [];
    const boxes: [Point, Point][] = [];
    let postition: Point;

    const [mapText, directionText] = input.split('\n\n');

    const maxX = mapText.indexOf('\n');
    const maxY = (mapText.length + 1) / maxX - 1;

    let position: Point;
    const map = mapText.split('\n').map((line, y) =>
        [...line].map((char, x) => {
            switch (char) {
                case '#':
                    walls.push([2 * x, y]);
                    walls.push([2 * x + 1, y]);
                    break;
                case 'O':
                    boxes.push([
                        [2 * x, y],
                        [2 * x + 1, y],
                    ]);
                    break;
                case '@':
                    position = [x, y];
                    break;
            }
        }),
    );

    const directions = [...directionText.replaceAll('\n', '')].map((char) => {
        switch (char) {
            case '^':
                return up;
            case 'v':
                return down;
            case '<':
                return left;
            case '>':
                return right;
            default:
                console.error('epic fail');
                process.exit(-1);
        }
    });
    return { boxes, walls, directions, position };
};

const moveBoxP2 = (
    box: [Point, Point],
    direction: { ([x, y]: Point): Point },
    boxes: [Point, Point][],
    walls: Point[],
): [Point, Point][] | undefined => {
    const newBox = box.map(direction) as [Point, Point];
    if (newBox.some(point => isIn(point, walls))) {
        // is there a wall in the way?
        return;
    }

    // are there any boxes in the way?
    if (newBox.some(point => isIn(point, boxes.flat()))) {
        // There's at least one box in the way, so find the first in the way box, and move it
        let idx = boxes.findIndex(b => b.some(p => containedInBox(p, newBox)));
        let newBoxes = moveBoxP2(boxes[idx], direction, boxes, walls); // try and shift it
        if (newBoxes === undefined) {
            // box didn't move
            return; // return original state
        }

        // find the next box
        idx = newBoxes.findIndex((b, i) => i > idx && b.some(p => containedInBox(p, newBox)));
        if(idx != -1) { // if there is one
            newBoxes = moveBoxP2(newBoxes[idx], direction, newBoxes, walls); // try and shift it
            if (newBoxes === undefined) {
                // box didn't move
                return; // bail
            }
        }
        
        boxes = newBoxes;
    }

    // move the box to the new place.
    boxes.splice(
        boxes.findIndex((b) => equalBoxes(b, box)),
        1,
    );
    boxes.push(newBox);

    return boxes;
};

const moveP2 = (
    position: Point,
    direction: { ([x, y]: Point): Point },
    boxes: [Point, Point][],
    walls: Point[],
): { position: Point; boxes: [Point, Point][] } => {
    const newPosition = direction(position);

    if (isIn(newPosition, walls)) {
        // is there  wall in the way?
        return { position, boxes }; // bail out
    }

    // are there any boxes in the way?
    if (isIn(newPosition, boxes.flat())) {
        // is there one box in the way?
        let idx = boxes.findIndex(box => containedInBox(newPosition, box));
        let newBoxes = moveBoxP2(boxes[idx], direction, boxes, walls); // try and move it

        if (newBoxes === undefined) {
            // if box didn't move
            return { position, boxes }; // bail out
        }

        boxes = newBoxes;
    }

    return { position: newPosition, boxes };
};

const part2 = (input: string) => {
    const { boxes, walls, directions, position } = parseInputP2(input);
    console.log(boxes);

    const { boxes: newBoxes } = directions.reduce(
        ({ position, boxes }, direction) => moveP2(position, direction, boxes, walls),
        { position, boxes },
    );
    console.log(newBoxes);
    return boxes.map(([[x, y], _]) => y * 100 + x).reduce((lhs, rhs) => lhs + rhs, 0);
};

const expectedSecondSolution = 9021;

export { part1, expectedFirstSolution, part2, expectedSecondSolution };
