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


const expectedFirstSolution = 143;

const pertinantRules = (pageOrderingRules: [number, number][], pages: number[]) => {
    return pageOrderingRules.filter(rule => rule.filter(page => pages.includes(page)).length == 2 )
}


const part2 = (input: string) => {
    const { pageOrderingRules, pagesToProduce } = parseInput(input);
    const brokenPagesToProduce = pagesToProduce.filter(x => !isInOrder(x, pageOrderingRules));

    const result = brokenPagesToProduce.map(list => {
        const rules =  pertinantRules(pageOrderingRules, list);
        return list.find(item => {
            const [before, after] = [rules.filter(rule => (rule[0] == item)).length, rules.filter(rule => rule[1] == item).length]

            // if an equal number of numbers go before and after this number, then this is the middle one
            if (before === after) return true;

            // if there are the same number of numbers with an unspecified ordering as there are specified
            // then there is an arragement where this is the middle number

            const specifiedNumberOfNumbers = before + after
            if (list.length - specifiedNumberOfNumbers == specifiedNumberOfNumbers) return true;

            return false;
        });
    });

    return result.reduce((a, b) => a + b, 0);
};

const expectedSecondSolution = 123;

export { part1, expectedFirstSolution, part2, expectedSecondSolution };
