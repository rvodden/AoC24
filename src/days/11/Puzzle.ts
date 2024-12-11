const parseInput = (input: string): number[] => {
    return input.split(' ').map(Number);
};

function zip<T1, T2>(a: T1[], b: T2[]): [T1, T2][] {
    return a.map((k, i) => [k, b[i]]);
}

const numberOfDigits = (x: number): number => Math.floor(Math.log10(x)) + 1;


const changeStone = (stone: number): number[] => {
    if (stone === 0) {
        return [1];
    }

    const numDigits = numberOfDigits(stone);
    if (numDigits % 2 === 0) {
        const split = numDigits / 2;
        const firstNumber = Math.floor(stone / 10 ** split);
        const secondNumber = stone - firstNumber * 10 ** split;
        return [firstNumber, secondNumber];
    }

    return [stone * 2024];
}

const cache = Array(76).fill(null).map(_ => new Map<number, number>());
const blinkNTimes = (stone: number, n: number): number => {

    if(cache[n].has(stone)) return cache[n].get(stone);

    let result = n === 1 ? changeStone(stone).length : changeStone(stone)
        .map(stone => blinkNTimes(stone, n-1))
        .reduce((lhs, rhs) => lhs + rhs);

    cache[n].set(stone, result);
    return result; 
};

const part1 = (input: string) => {
    let stones = parseInput(input);

    return stones.map(stone => blinkNTimes(stone, 25)).reduce((lhs, rhs) => lhs + rhs);
};

const expectedFirstSolution = 55312;

const part2 = (input: string) => {
    let stones = parseInput(input);

    return stones.map(stone => blinkNTimes(stone, 75)).reduce((lhs, rhs) => lhs + rhs);
};

const expectedSecondSolution = 'part 2';

export { part1, expectedFirstSolution, part2, expectedSecondSolution };
