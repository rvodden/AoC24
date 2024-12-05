const notBlank = (x: string) => x != '';

const parseInput = (input: string) => {
    const [pageOrderingRulesText, pagesToProduceText] = input.split('\n\n');

    const pageOrderingRules = pageOrderingRulesText
        .split('\n')
        .filter(notBlank)
        .map((line: string) => line.split('|').map((x) => parseInt(x)));

    const pagesToProduce = pagesToProduceText
        .split('\n')
        .filter(notBlank)
        .map((line: string) => line.split(',').map((x) => parseInt(x)));

    return { pageOrderingRules, pagesToProduce };
};

const isInOrder = (listOfPages: number[], pageOrderingRules: [number, number][]) =>
    pageOrderingRules.every((orderingRule) => {
        const indices = orderingRule.map((page) => listOfPages.indexOf(page));
        if (indices.filter((x) => x == -1).length > 0) return true;

        return indices[0] < indices[1];
    });

const part1 = (input: string) => {
    const { pageOrderingRules, pagesToProduce } = parseInput(input);

    const result = pagesToProduce
        .filter((x) => isInOrder(x, pageOrderingRules))
        .map((x) => x[(x.length - 1) / 2])
        .reduce((lhs, rhs) => lhs + rhs, 0);

    return result;
};

function combinations<T>(array: T[]): T[][] {
    if (array.length == 1) return [array];
    return array.map((value, index) => {
        const shortArray = array.slice();
        shortArray.splice(index, 1);
        return combinations(shortArray).map(x => x.concat(value).flat());
    }).flat();
}

const expectedFirstSolution = 143;

const part2 = (input: string) => {
    const { pageOrderingRules, pagesToProduce } = parseInput(input);
    const brokenPagesToProduce = pagesToProduce.filter(x => !isInOrder(x, pageOrderingRules));

    const result = brokenPagesToProduce.map(brokenPageOrder => {
        return combinations(brokenPageOrder).filter(x => isInOrder(x, pageOrderingRules))[0];
    })
    
    return result.map((x) => x[(x.length - 1) / 2])
        .reduce((lhs, rhs) => lhs + rhs, 0);
};

const expectedSecondSolution = 123;

export { part1, expectedFirstSolution, part2, expectedSecondSolution };
