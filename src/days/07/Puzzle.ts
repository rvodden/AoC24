const parseInput = (input: string): [bigint, bigint[]][] => {
    return input
        .split('\n')
        .filter((x) => x != '')
        .map((line) => {
            const [targetString, equationString] = line.split(': ');
            return [BigInt(targetString), equationString.split(' ').map((x) => BigInt(x))];
        });
};

interface Operation {
    (lhs: bigint, rhs: bigint): bigint;
}

const add = (lhs: bigint, rhs: bigint): bigint => lhs + rhs;
const multiply = (lhs: bigint, rhs: bigint): bigint => lhs * rhs;
const concatenate = (lhs: bigint, rhs: bigint): bigint => BigInt(`${lhs}${rhs}`);

const operationsP1: Operation[] = [add, multiply];
const operationsP2: Operation[] = [concatenate, multiply, add];

const product = (sets: Operation[][]): Operation[][] =>
    sets.reduce<Operation[][]>(
        (results, ids) =>
            results
                .map((result) => ids.map((id) => [...result, id]))
                .reduce((nested, result) => [...nested, ...result]),
        [[]],
    );

const trueResults = (equations: [bigint, bigint[]][], operations: Operation[]) => {
    return equations
        .filter(([result, coefficients]) => {
            const operationCombinations = product(Array(coefficients.length - 1).fill(operations));
            const results = operationCombinations
                .map((x) => x.values())
                .map((operations) => {
                    return coefficients.reduce((lhs, rhs) => {
                        return operations.next().value(lhs, rhs);
                    });
                });
            return results.some((x) => x === result);
        })
        .map((x) => x[0]);
};

const part1 = (input: string) => {
    const equations = parseInput(input);

    return trueResults(equations, operationsP1).reduce((lhs, rhs) => lhs + rhs);
};

const expectedFirstSolution = 3749n;

const trueResult = (target: bigint, equation: bigint[], operations: Operation[]): bigint | undefined => {
    if (equation.length === 1) {
        if (target == equation[0]) {
            return target;
        } else { 
            return 
        };
    };

    if (equation[0] > target) {
        return;
    }

    for (const [idx, operation] of operations.entries()) {
        const newEquation = [operation(equation[0], equation[1]), ...equation.slice(2)];
        const newResult = trueResult(target, newEquation , operations);
        if (newResult != undefined) {
            return newResult;
        }
    };

};

const trueResultsP2 = (equations: [bigint, bigint[]][], operations: Operation[]): bigint[] => {
    const retval = []
    for(const [target, equation] of equations) {
        if(trueResult(target, equation, operations)) {        
            retval.push(target);
        }
    }
    return retval;
};

const part2 = (input: string) => {
    const equations = parseInput(input);
    return trueResultsP2(equations, operationsP2).reduce((lhs, rhs) => lhs + rhs);
};

const expectedSecondSolution = 11387n;

export { part1, expectedFirstSolution, part2, expectedSecondSolution };
