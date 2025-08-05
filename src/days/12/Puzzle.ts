import { inspect } from 'util';

type Point = [number, number];
const areEqual = ([x1, y1]: Point, [x2, y2]: Point): boolean => x1 === x2 && y1 === y2;

class OutOfBoundsError extends Error {
    constructor(message: string) {
        super(message); 
        this.name = "OutOfBoundsError"; 
        
        Object.setPrototypeOf(this, OutOfBoundsError.prototype);
    }
}

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
        members: Set<number>,
    }[];

    protected _roots: Set<number> = new Set();

    constructor(public readonly dimensions: Point) 
    {
        this.nodes = new Array(this.size).fill(0).map((_, i) => ({
            parent: i,
            size: 1,
            members: new Set([i])
        }));

        this._roots = new Set(this.nodes.map((_, i) => i));
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
        this.nodes[root1].members = this.nodes[root1].members.union(this.nodes[root2].members);

        // remove the second root from the set of roots
        this._roots.delete(root2);
    }

    flatten = () => {
        this.roots.forEach((p) => this.find(p))
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

    get roots(): Point[] {
        const width = this.width
        const height = this.height
        const retval: Point[] = []

        this._roots.forEach(p => {
            retval.push(this.getCoordinates(p))
        })

        return retval;
    }

    get regions(): Map<number, Set<Point>> {
        const regions: Map<number, Set<Point>> = new Map();
        this._roots.forEach((root) => {
            const rootPoint = this.getCoordinates(root);
            if (!regions.has(root)) {
                regions.set(root, new Set());
            }
            // regions.get(root)?.add(rootPoint);
            this.nodes[root].members.forEach(member => {
                regions.get(root)?.add(this.getCoordinates(member));
            });
        });
        return regions;
    }

    private inBounds([x, y]: Point): boolean {
        return x >= 0 && x < this.dimensions[0] && y >= 0 && y < this.dimensions[1];
    }

    private throweIfOutOfBounds(p: Point): void {
        if (!this.inBounds(p)) {
            throw new OutOfBoundsError(`Point ${inspect(p)} is out of bounds for grid with dimensions ${inspect(this.dimensions)}`);
        }
    }

    private getIndex([x, y]: Point): number {
        this.throweIfOutOfBounds([x, y]);
        return y * this.dimensions[0] + x;
    }

    private getCoordinates(index: number): Point {
        if (index < 0 || index >= this.size) {
            throw new OutOfBoundsError(`Index ${index} is out of bounds for grid with dimensions ${inspect(this.dimensions)}`);
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

const inBounds = ([x, y]: Point, grid: string[][]) => 0 <= x && 0 <= y && y < grid.length && y < grid[0].length

const calculatePerimeter = (region: Point[]): number => {
    let perimeter = 0;
    region.forEach(p1 => {
        neighbours.forEach((neighbour) => {
            const n = neighbour(p1);
            if (region.find((p2) => areEqual(p2, n)) === undefined) {
                perimeter++;
            }
        });
    });
    return perimeter;
}

const part1 = (input: string) => {
    const grid: string[][] = parseInput(input);
    const gds = new GridDisjointSet([grid[0].length, grid.length])

    // First Pass
    grid.forEach((row, y, grid) => {
        row.forEach((plant, x, row) => {
            const cell: Point  = [x,y]
            
            const west = neighbours[WEST]([x,y])
            if( inBounds(west, grid) && grid[west[1]][west[0]] === plant ) {
                gds.unite(west, cell)
            }

            const north = neighbours[NORTH]([x,y])
            if( inBounds(north, grid) && grid[north[1]][north[0]] === plant ) {
                gds.unite(north, cell)
            }
        })
    })

    // Second Pass
    gds.flatten();

    const regions = gds.regions;


    const price = [...regions].map(([_, region]) => {
        const perimeter = calculatePerimeter([...region]);
        const plant = grid[region.values().next().value[1]][region.values().next().value[0]];
        return perimeter * region.size
    }).reduce((acc, val) => acc + val, 0);

    return price;
};

const expectedFirstSolution = 1930;

const cornerNeighbours: { ([x, y]: Point): Point }[][] = [
    [  // north west corner
        ([x, y]) => [x, y - 1],
        ([x, y]) => [x - 1, y - 1],
        ([x, y]) => [x - 1, y]
    ], 
    [  // north east corner
        ([x, y]) => [x, y - 1],
        ([x, y]) => [x + 1, y - 1],
        ([x, y]) => [x + 1, y]
    ],
    [  // south east corner
        ([x, y]) => [x, y + 1],
        ([x, y]) => [x + 1, y + 1],
        ([x, y]) => [x + 1, y]
    ],
    [  // south west corner
        ([x, y]) => [x, y + 1],
        ([x, y]) => [x - 1, y + 1],
        ([x, y]) => [x - 1, y]
    ]
];

const countCorners = (region: Point[]): number =>
    region.map(p1 => 
        cornerNeighbours.map(neighbourFunction =>
            neighbourFunction.map(n => n(p1))
                .map(p1 => region.find(p2 => areEqual(p1, p2)) !== undefined)
        )
        .map(([c1, c2, c3]) => (!c1 && !c3) || (c1 && !c2 && c3))
        .filter(x => x).length
    )
    .reduce((acc, val) => acc + val, 0);


const part2 = (input: string) => {
    const grid: string[][] = parseInput(input);
    const gds = new GridDisjointSet([grid[0].length, grid.length])

    // First Pass
    grid.forEach((row, y, grid) => {
        row.forEach((plant, x, row) => {
            const cell: Point  = [x,y]
            
            const west = neighbours[WEST]([x,y])
            if( inBounds(west, grid) && grid[west[1]][west[0]] === plant ) {
                gds.unite(west, cell)
            }

            const north = neighbours[NORTH]([x,y])
            if( inBounds(north, grid) && grid[north[1]][north[0]] === plant ) {
                gds.unite(north, cell)
            }
        })
    })

    // Second Pass
    gds.flatten();

    const regions = gds.regions;


    const price = [...regions].map(([_, region]) => {
        const corners = countCorners([...region]);
        const plant = grid[region.values().next().value[1]][region.values().next().value[0]];
        return corners * region.size
    }).reduce((acc, val) => acc + val, 0);

    return price;
};

const expectedSecondSolution = 1206;

export { part1, expectedFirstSolution, part2, expectedSecondSolution };
