const parseInput = (input: string) => input.split("\n").filter(line => line != "").map(Number);

const nextNumber = (secretNumber: number): number => {
    secretNumber = (secretNumber ^ (secretNumber << 6)) & 0xFFFFFF;
    secretNumber = (secretNumber ^ (secretNumber >> 5)) & 0xFFFFFF;
    secretNumber = (secretNumber ^ (secretNumber << 11)) & 0xFFFFFF;
    return secretNumber;
}


const part1 = (input: string) => {
    const startPrices = parseInput(input);

    return startPrices.map(secretNumber => {
        for(let i = 0; i < 2000; i++) {
            secretNumber = nextNumber(secretNumber);
        }
        return secretNumber;
    }).reduce((lhs, rhs) => lhs + rhs);

};

const expectedFirstSolution = 37990510;


function* pairwise<T>(iterable: Iterable<T>): Generator<[T, T], void> {
  const iterator = iterable[Symbol.iterator]();
  let a = iterator.next();
  if (a.done) {
    return;
  }
  let b = iterator.next();
  while (!b.done) {
    yield [a.value, b.value];
    a = b;
    b = iterator.next();
  }
}

const part2 = (input: string) => {
    const ranges = new Map<string, number[]>();
    
    const prices = parseInput(input);

    prices.forEach(secretNumber => {
        const visited = new Set<string>();
        const differences: number[] = [];
        
        for(let i = 0; i < 2000; i++) {
            const nextSecretNumber = nextNumber(secretNumber);
            differences.push(Number((nextSecretNumber % 10) - (secretNumber % 10)));
            secretNumber = nextSecretNumber;

            if( differences.length === 4) {
                const key = differences.join(",");
                if(!visited.has(key)) {
                    if(!ranges.has(key)) ranges.set(key, []);
                    ranges.get(key)!.push(nextSecretNumber % 10);
                    visited.add(key);
                }
                differences.shift();
            }
        }
    });

    return Math.max(...ranges.values().map(range => range.reduce((lhs, rhs) => lhs + rhs)));
};

const expectedSecondSolution = 23;

export { part1, expectedFirstSolution, part2, expectedSecondSolution };
