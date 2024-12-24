type Operation = { (vals: boolean[]): boolean };

interface Node {
    inputs: string[];
    operation: Operation;
}

const operations = new Map<string, Operation>([
    ['OR', (vals) => vals[0] || vals[1]],
    ['AND', (vals) => vals[0] && vals[1]],
    ['XOR', (vals) => vals[0] !== vals[1]],
]);

const parseInput = (input: string) => {
    const [inputText, wiringText] = input.split('\n\n');

    const wiring = new Map<string, Node>(
        wiringText
            .split('\n')
            .filter((x) => x != '')
            .map((line) => {
                const elems = line.split(' ');
                return [elems[4], { inputs: [elems[0], elems[2]], operation: operations.get(elems[1])! }];
            }),
    );

    inputText.split('\n').forEach((line) => {
        const input = line.split(': ');
        if (input[1] === '1') wiring.set(input[0], { inputs: [], operation: (_) => true });
        if (input[1] === '0') wiring.set(input[0], { inputs: [], operation: (_) => false });
    });

    return wiring;
};

const topologicalSort = (wiring: Map<string, Node>): string[] => {
    wiring = new Map(wiring);

    const removeNode = (nodeName: string) => {
        wiring.delete(nodeName);
        wiring.entries().forEach(([name, node]) => {
            const idx = node.inputs.indexOf(nodeName);
            if (idx !== -1) {
                node.inputs.splice(idx, 1);
            }
        });
    };
    const result = [];

    while (wiring.size > 0) {
        const [nodeName, _] = wiring.entries().find(([name, node]) => node.inputs.length === 0)!;
        result.push(nodeName);
        removeNode(nodeName);
    }

    return result;
};

const evaluate = (nodeName: string, wiring: Map<string, Node>): boolean => {
    const node = wiring.get(nodeName)!;

    if (node.inputs.length === 0) return node.operation([]);

    const inputs = node.inputs.map((node) => evaluate(node, wiring));
    const value = node.operation(inputs);
    node.inputs = [];
    node.operation = (_) => value;
    return value;
};

const part1 = (input: string): number => {
    const wiring = parseInput(input);
    // const order = topologicalSort(wiring);

    const outputs = [
        ...wiring
            .keys()
            .filter((node) => node[0] === 'z')
            .map((nodeName) => [nodeName, evaluate(nodeName, wiring)] as [string, boolean]),
    ].sort((lhs, rhs) => lhs[0].localeCompare(rhs[0]));

    return outputs.map(([name, val], idx) => val ? 2 ** idx : undefined).filter(x => x !== undefined).reduce((lhs, rhs) => lhs + rhs);
};

const expectedFirstSolution = 2024;

const part2 = (input: string) => {
    return 'part 2';
};

const expectedSecondSolution = 'part 2';

export { part1, expectedFirstSolution, part2, expectedSecondSolution };
