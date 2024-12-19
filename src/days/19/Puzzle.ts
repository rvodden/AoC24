const parseInput = (input: string) => {
    const [patternText, designText] = input.split("\n\n");

    const patterns = patternText.split(", ");
    const designs = designText.split("\n").filter(d => d != '');

    return {patterns, designs};
};

const cache = new Map<string, boolean>([["", true]]);

const possible = (design: string, patterns: string[] ): boolean => {
    if(cache.has(design)) return cache.get(design)!;

    const result = patterns.some(pattern => {
        if (!design.startsWith(pattern)) return false;
        return possible(design.substring(pattern.length), patterns);
    })
    
    cache.set(design, result);
    return result;
}

const part1 = (input: string) => {
    const {patterns, designs} = parseInput(input);
    return designs.filter(design => possible(design, patterns)).length;
};

const expectedFirstSolution = 6;

const cacheP2 = new Map<string, number>([["", 1]]);

const countWays = (design: string, patterns: string[] ): number => {
    if(cacheP2.has(design)) return cacheP2.get(design)!;

    const result = patterns.reduce((ways, pattern) => {
        if(!design.startsWith(pattern)) return ways;
        return ways + countWays(design.substring(pattern.length), patterns);
    }, 0);

    cacheP2.set(design, result);
    return result;
}

const part2 = (input: string) => {
    const {patterns, designs} = parseInput(input);
    return designs.map(design => countWays(design, patterns)).reduce((lhs, rhs) => lhs + rhs);
};

const expectedSecondSolution = 16;

export { part1, expectedFirstSolution, part2, expectedSecondSolution };
