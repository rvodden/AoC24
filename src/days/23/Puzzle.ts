type Graph = Map<string, Set<string>>;

const addVertex = (vertices: Graph, source: string, destination: string) => {
    if (!vertices.has(source)) vertices.set(source, new Set<string>());
    vertices.get(source)!.add(destination);

    return vertices;
};

const equal = <T>(lhs: Set<T>, rhs: Set<T>) => lhs.size === rhs.size && lhs.values().every((elem) => rhs.has(elem));

const parseInput = (input: string): Graph => {
    const vertices = new Map<string, Set<string>>();

    input
        .split('\n')
        .filter((x) => x != '')
        .map((line) => line.split('-'))
        .forEach(([source, destination]) => {
            addVertex(vertices, source, destination);
            addVertex(vertices, destination, source);
        });

    return vertices;
};

const part1 = (input: string): number => {
    const vertices = parseInput(input);

    const potentialNodes = new Set(vertices.keys().filter((node) => node[0] == 't'));
    const threeCliques: Set<string>[] = [];

    potentialNodes.forEach((source) => {
        vertices.get(source)!.forEach((destination) => {
            vertices.get(destination)!.forEach((node) => {
                if (vertices.get(node)!.has(source)) {
                    const clique = new Set([source, destination, node]);
                    if (threeCliques.find((lhs) => equal(lhs, clique)) === undefined) {
                        threeCliques.push(clique);
                    }
                }
            });
        });
    });

    return threeCliques.length;
};

const expectedFirstSolution = 7;

const isClique = (vertices: Graph, nodes: Set<string>) =>
    nodes.values().every((node1) => nodes.values().every((node2) => node1 == node2 || vertices.get(node2)?.has(node1)));

const copyGraph = (vertices: Graph): Graph =>
    new Map([...vertices.entries()].map(([node, adjacencies]) => [node, new Set([...adjacencies])]));

// const nextCliques = (nodes: Set<string>, vertices: Graph): IteratorObject<Set<string>> =>
//     new Set(vertices.keys()).difference(nodes).values().map(node => new Set([node, ...nodes])).filter(subGraph => isClique(subGraph, vertices))

const remove = (node: string, vertices: Graph): Graph => {
    vertices = copyGraph(vertices);
    vertices.delete(node);
    vertices.forEach((adjacencies) => adjacencies.delete(node));
    return vertices;
};


//                                        R                      P                    X
const bronKerbosch = (vertices: Graph, clique: Set<string>, toVisit: Set<string>, excluded: Set<string> ): Set<string>[] => {
    if ( excluded.size === 0 && toVisit.size === 0 ) return [clique];

    const cliques = []

    for( const node of toVisit ) {
        const neighbours = vertices.get(node)!;
        cliques.push(...bronKerbosch(vertices, new Set([node, ...clique]), toVisit.intersection(neighbours), excluded.intersection(neighbours)));
        toVisit.delete(node);
        excluded.add(node);
    }

    return cliques;
};

const part2 = (input: string) => {
    const vertices = parseInput(input);

    const cliques = bronKerbosch(vertices, new Set(), new Set(vertices.keys()), new Set());

    return [...cliques.reduce((max, set) => max.size <= set.size ? set : max)].sort().join(",");
};

const expectedSecondSolution = 'co,de,ka,ta';

export { part1, expectedFirstSolution, part2, expectedSecondSolution };
