const WIDTH = 5;
const HEIGHT = 7;

const parseInput = (input: string): {keys: number[][], locks: number[][]} => {
    const keys: number[][] = [];
    const locks: number[][] = [];

    input.split("\n\n").forEach(block => {
        const lines = block.split("\n");
        const collection = [...block[0]].every(c => c === "#") ? locks : keys;

        const schematic = new Array(WIDTH).fill(0);

        lines.forEach(line => [...line].forEach((char, index) => {
            if(char === '#') schematic[index]++;
        }))

        collection.push(schematic);
    })

    return { keys, locks };
}

const zip = <T1, T2>(a: T1[], b: T2[]): [T1, T2][] => a.map((k, i) => [k, b[i]]);

const part1 = (input: string) => {
    const {locks, keys} = parseInput(input);

    return keys.flatMap(key => locks.map(lock => zip(lock, key).map(([lhs, rhs]) => lhs + rhs).every(x => x <= HEIGHT)).filter(x => x)).length;
};

const expectedFirstSolution = 3;

const part2 = (input: string) => {
  return 'part 2';
};

const expectedSecondSolution = 'part 2';

export { part1, expectedFirstSolution, part2, expectedSecondSolution };
