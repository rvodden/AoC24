import { inspect } from 'util';

type Point = [number, number];

/**
 * Disjoint Set data structure for two-dimensional grid. 
 * 
 * Internally this is just a 1d disjoint set, with the (x, y) node reperesented as y*width + x.
 * 
 * Each point in the grid has a parent which is stored in the `parents` array. A point is the root
 * of a disjoint set if its parent is itself. The `find` method returns the root of the disjoint set.
 * 
 * The `unite` method merges two disjoint sets by making the root of the second set a child 
 * of the root of the first set.
 */
class GridDisjointSet {

    protected nodes: {
        parent: number,
        size: number,
    }[];

    constructor(public readonly dimensions: Point) 
    {
        this.nodes = new Array(this.size).fill(0).map((_, i) => ({
            parent: i,
            size: 1,
            rank: 0
        }));
    }

    /**
     * Finds the representative of the passed in point. 
     */
    find([x,y]: Point): number {
        this.throweIfOutOfBounds([x, y]);
        
        const index = this.getIndex([x, y]);

        // if we are not the top of the tree
        if (this.nodes[index].parent !== index) { 
            // update our parent to tbe the parent of our parent (flat trees are more efficient)
            this.nodes[index].parent = this.find(this.getCoordinates(this.nodes[index].parent));
        }

        // return our parent (which by now is the top of the tree)
        return this.nodes[index].parent;
    }

    /**
     * Unites two disjoint sets within the grid.
     * 
     * The repsentative of the second set is updated to be the representative of the first set.
     */
    unite(p1: Point, p2: Point): void {
        this.throweIfOutOfBounds(p1);
        this.throweIfOutOfBounds(p2);
       
        // get tree roots
        let root1 = this.find(p1);
        let root2 = this.find(p2);

        // if the two points are already in the same set, do nothing
        if (root1 === root2) return;

        if (this.nodes[root1].size < this.nodes[root2].size) {
            [root1, root2] = [root2, root1]; // and that root1 is the larger set
        }

        
        // make the root of the second set a child of the root of the first set
        this.nodes[root2].parent = root1;
        // update the size of the first set
        this.nodes[root1].size += this.nodes[root2].size;
    }

    /**
     * Return the number of columns in the grid.
     */
    get width(): number {
        return this.dimensions[0];
    }

    /**
     * Return the number of rows in the grid.
     */
    get height(): number {
        return this.dimensions[1];
    }

    /**
     * Returns the number of elements in the grid.
     */
    get size(): number {
        return this.dimensions[0] * this.dimensions[1];
    }

    private inBounds([x, y]: Point): boolean {
        return x >= 0 && x < this.dimensions[0] && y >= 0 && y < this.dimensions[1];
    }

    private throweIfOutOfBounds(p: Point): void {
        if (!this.inBounds(p)) {
            throw new Error(`Point ${inspect(p)} is out of bounds for grid with dimensions ${inspect(this.dimensions)}`);
        }
    }

    private getIndex([x, y]: Point): number {
        this.throweIfOutOfBounds([x, y]);
        return y * this.dimensions[0] + x;
    }

    private getCoordinates(index: number): Point {
        if (index < 0 || index >= this.size) {
            throw new Error(`Index ${index} is out of bounds for grid with dimensions ${inspect(this.dimensions)}`);
        }
        return [index % this.dimensions[0], Math.floor(index / this.dimensions[0])];
    }

};

const parseInput = (input: string) =>
    input
        .split('\n')
        .map((line) => [...line])
        .filter((line) => line.length != 0);

const NORTH = 0;
const WEST = 1;
const SOUTH = 2;
const EAST = 3;

const neighbours: { ([x, y]: [number, number]): [number, number] }[] = [
    ([x, y]) => [x - 1, y],
    ([x, y]) => [x, y - 1],
    ([x, y]) => [x + 1, y],
    ([x, y]) => [x, y + 1]
];

type Region = {
    plant: string,
    perimeter?: number,
    area?: number
}

const inBounds = (point: [number, number], bounds: [number, number]): Boolean => 
    (0 <= point[0] && point[0] < bounds[0] && 0 <= point[1] && point[1] < bounds[1]);



const part1 = (input: string) => {
    let grid: string[][] = parseInput(input);
    let bounds: [number, number] = [grid[0].length, grid.length]
 
    let plotGrid: Plot[][] = grid.map(row => row.map(p => ({plant: p, perimeter: 0, area: 1}) ));

    let region: Region = {
        plant: "A", perimiter: 1, area: 1
    };

    regionMap.set(2, region);
    region.area = 3;
    regionMap.set(3, region);
    console.log(regionMap.get(2));
    console.log(regionMap.get(3));

    return 1930;
};

const expectedFirstSolution = 1930;

const part2 = (input: string) => {
    return 'part 2';
};

const expectedSecondSolution = 'part 2';

export { part1, expectedFirstSolution, part2, expectedSecondSolution };
