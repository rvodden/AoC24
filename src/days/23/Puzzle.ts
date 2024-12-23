const addVertex = (vertices: Map<string, Set<string>>, source: string, destination: string) => {
    if(!vertices.has(source)) vertices.set(source, new Set<string>());
    vertices.get(source)!.add(destination)

    return vertices;
}

const equal = <T>(lhs: Set<T>, rhs: Set<T>) => (lhs.size === rhs.size) && lhs.values().every(elem => rhs.has(elem));

const parseInput = (input: string): { nodes: Set<string>, vertices: Map<string, Set<string>> } => {
    const nodes = new Set<string>();
    const vertices = new Map<string, Set<string>>();

    input.split("\n").filter(x => x != "").map(line => line.split("-"))
        .forEach(([source, destination]) => {
            nodes.add(source)
            nodes.add(destination)

            addVertex(vertices, source, destination);
            addVertex(vertices, destination, source);
        })

    return { nodes, vertices };
}

const part1 = (input: string): number => {
    const {nodes, vertices} = parseInput(input);

    const potentialNodes = new Set(nodes.values().filter(node => node[0] == "t"));
    const threeCliques: Set<string>[] = [];

    potentialNodes.forEach(source => {
        vertices.get(source)!.forEach(destination => {
            vertices.get(destination)!.forEach(node => {
                if( vertices.get(node)!.has(source) ) {
                    const clique = new Set([source, destination, node]);
                    if(threeCliques.find(lhs => equal(lhs, clique)) === undefined) {
                        threeCliques.push(clique);
                    }
                }
            });
        })
    })

    return threeCliques.length
};

const expectedFirstSolution = 7;

const maxClique = (nodes: Set<string>, vertices: Map<string, Set<string>>) => {
    let max = 0;
    let c = new Map<string, number>(nodes.values().map(node => [node, 0]));
    
    const clique = (nodes: Set<string>, size: number): number[] | undefined => {
        console.log(nodes, size);
        if (nodes.size == 0) {
            if (size > max) {
                max = size;
                return [];
            }
            return
        }

        nodes = new Set(nodes);
        while(nodes.size > 0) {
            if (nodes.size + size < max ) return; // don't have enough nodes to break the record
    
            const node = nodes.values().next().value;
            nodes.delete(node);

            if (nodes.size + c.get(node)! + size <= max) return;

            const res = clique(nodes.intersection(vertices.get(node)!), size + 1)
            if (res !== undefined) return [node, ...res]
        }
        return undefined;
    }

    const cliques = nodes.values().map(node => {
        const res = clique(nodes.intersection(vertices.get(node)!), 1);
        c.set(node, max);
        nodes.delete(node);
        return res === undefined ? undefined : [node, ...res!];
    }).filter(x => x != undefined).toArray();

    console.log(c);

    return cliques
}

const part2 = (input: string) => {
    const {nodes, vertices} = parseInput(input);

    return maxClique(nodes, vertices);
};

const expectedSecondSolution = 'co,de,ka,ta';

export { part1, expectedFirstSolution, part2, expectedSecondSolution };
