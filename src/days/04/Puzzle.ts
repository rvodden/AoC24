const directions: [number, number][] = [
    [0,1],
    [0,-1],
    [-1, 0],
    [1,0],
    [-1, -1],
    [-1, 1 ],
    [1, 1],
    [1, -1]
]

const diagonalPairs: [[number, number], [number, number]][] = [
    [[-1,-1], [1,1]],
    [[1, -1], [-1, 1]],
    [[-1, 1], [1, -1]],
    [[1, 1], [-1, -1]],
];

const sum = (x: number, y: number): number => x + y;
const sumTuple = (lhs: [number, number], rhs: [number, number]) : [number, number] => [lhs[0] + rhs[0], lhs[1] + rhs[1]];

class Grid {
    input: string;
    height: number;
    width: number;

    public constructor(input: string) {
        this.input = input;
        this.width = input.indexOf('\n');
        this.height = input.length / this.width - 1;
    }

    public get(position: [number, number]): string | undefined {
        const [x, y] = position;
        if ( y < 0 || y >= this.height || x < 0 || x >= this.width ) return;
        return this.input.charAt(y * (this.width + 1) + x)
    }

    public isXmasInDirection(position: [number, number], direction: [number, number], expectedChar: string) : boolean {
        const char = this.get(position);
        // console.log(`${position}: ${char}: ${expectedChar}: ${direction}`)
        if (expectedChar != char ) return false;
        switch(char) {
            case 'X':
                expectedChar = "M";
                break;
            case 'M':
                expectedChar = "A";
                break;
            case 'A':
                expectedChar = "S";
                break;
            case 'S':
                // console.log("horray!")
                return true;
        }
        return this.isXmasInDirection(sumTuple(position, direction), direction, expectedChar)
    }

    public countXmases(position: [number, number]): number {
        if (this.get(position) != 'X') return 0;
        // console.log(position)
        return directions.values().map(direction => this.isXmasInDirection(position, direction, 'X')).filter(Boolean).toArray().length;
    }

    public isX_mas(position: [number, number]): boolean {
        if (this.get(position) != 'A') return false;

        return diagonalPairs.map(([m_delta, s_delta]) => (this.get(sumTuple(position, m_delta)) == "M") && (this.get(sumTuple(position, s_delta)) == "S"))
            .filter(Boolean).length == 2
    }

    public positions() : [number, number][] {
        return [...Array(this.height).keys()].map(y => [...Array(this.width).keys()].map(x=> [x,y] as [number, number])).flat()
    }

}

const part1 = (input: string) => {
    const grid = new Grid(input);
    // console.log(grid.positions())
    return grid.positions().map(p => grid.countXmases(p)).reduce(sum, 0);
};

const expectedFirstSolution = 18;

const part2 = (input: string) => {
    const grid = new Grid(input);

    // return grid.positions().map(p => [p, grid.isX_mas(p)]).filter(x => x[1])
    return grid.positions().map(p => grid.isX_mas(p)).filter(Boolean).length
};

const expectedSecondSolution = 9;

export { part1, expectedFirstSolution, part2, expectedSecondSolution };
