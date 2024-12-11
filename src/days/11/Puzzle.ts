const parseInput = (input: string): number[] => {
    return input.split(' ').map(Number);
};

function zip<T1, T2>(a: T1[], b: T2[]): [T1, T2][] {
    return a.map((k, i) => [k, b[i]]);
}

const numberOfDigits = (x: number): number => Math.floor(Math.log10(x)) + 1;

const memoize = (func: { (stone: number): number[]; (stone: number): number[]; }) => {
    const cache = new Map<number, number[]>();

    return (stone: number) => {
        if(cache.has(stone)) return cache!.get(stone);

        const result = func(stone);
        cache.set(stone, result);
        return result;
    }
}

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

const blinkNTimes = (stones: number[], n: number): number => {
    for (let i = 1; i <= n; i++) {
        stones = stones.flatMap(memoize(changeStone));
    }

    return stones.length;
};

const part1 = (input: string) => {
    let stones = parseInput(input);

    const blinks = blinkNTimes(stones, 25);
    return blinks;
};

const expectedFirstSolution = 55312;

const part2 = (input: string) => {
    let stones = parseInput(input);

    const blinks = blinkNTimes(stones, 25);
    return blinks;
};

const expectedSecondSolution = 'part 2';

export { part1, expectedFirstSolution, part2, expectedSecondSolution };
