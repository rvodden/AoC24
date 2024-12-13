const multisplit = (text: string, splits: string) => {
    let retval = [text];
    [...splits].forEach((split) => {
        retval = retval.flatMap((x) => x.split(split));
    });
    return retval;
};

const parseInput = (input: string) => {
    return input.split('\n\n').map((block) => {
        const lines = block.split('\n');
        const button_a = multisplit(lines[0], ' +,')
            .filter((x) => x !== '')
            .map(Number)
            .filter((x) => x);
        const button_b = multisplit(lines[1], ' +,')
            .filter((x) => x !== '')
            .map(Number)
            .filter((x) => x);
        const target = multisplit(lines[2], ' =,')
            .filter((x) => x !== '')
            .map(Number)
            .filter((x) => x);
        return [button_a, button_b, target];
    });
};

const getLowestScore = (sum: number, machine: number[][]) => {
            const b = (machine[0][0] * machine[2][1] - machine[0][1] * machine[2][0]) / (machine[0][0] * machine[1][1] - machine[0][1] * machine[1][0]);
            const a = (machine[2][0] - machine[1][0] * b) / machine[0][0];

            return sum + ((Number.isInteger(a) && Number.isInteger(b)) ? (a * 3 + b) : 0);
        }

const part1 = (input: string) => {
    const machines = parseInput(input);
    return machines
        .reduce(getLowestScore , 0);
};

const expectedFirstSolution = 480;

const part2 = (input: string) => {    const machines = parseInput(input);
    return machines
        .map(([button_1, button_2, [target_x, target_y]]) => [button_1, button_2, [target_x + 10000000000000, target_y + 10000000000000]])
        .reduce(getLowestScore , 0);
};

const expectedSecondSolution = 875318608908;

export { part1, expectedFirstSolution, part2, expectedSecondSolution };
