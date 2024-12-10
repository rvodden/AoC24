import { inspect } from 'util';

interface Block {
    id: number;
    position: number;
    length: number;
}

const parseInput = (input: string): Block[] => {
    let position = 0;
    let id = 0;
    const blocks = [];
    const characters = [...input].values();

    do {
        const lengthString = characters.next().value as string | undefined;
        const freeSpaceLengthString = characters.next().value as string | undefined;

        if (lengthString === undefined) break;

        const length = parseInt(lengthString);
        blocks.push({ id, position, length });

        if (freeSpaceLengthString === undefined) break;

        const freeSpaceLength = parseInt(freeSpaceLengthString);

        position += length + freeSpaceLength;
        id++;
    } while (true);

    return blocks;
};

const decrementThenPop = (blocks: Block[]): number | undefined => {
    const block = blocks.pop();
    if (block === undefined) return;

    block.length--;
    if (block.length !== 0) blocks.push(block);
    return block.id;
};

const isGap = (lhs: Block, rhs: Block, gapSize = 1) => {
    const gap = rhs.position - (lhs.position + lhs.length - 1);
    return gap > gapSize;
};

const getNextGap = (blocks: Block[], gapSize = 1, limit: number | undefined = undefined): [Block, Block] => {
    limit = limit || (blocks.at(-1)?.length + blocks.at(-1)?.position);
    const blockIterator = blocks.values();
    let a = blockIterator.next().value;
    let b = blockIterator.next().value;
    while (b !== undefined && !isGap(a, b, gapSize) ) {
        if (a.position >= limit) return [undefined, undefined]
        a = b;
        b = blockIterator.next().value;
    }
    return [a, b];
};

const checksum = (blocks: Block[]) =>
    blocks.map((b) => b.id * (b.position * b.length + (b.length * (b.length - 1)) / 2)).reduce((lhs, rhs) => lhs + rhs);

const part1 = (input: string) => {
    const blocks = parseInput(input);
    // grab the first pair of blocks which are not right next to each other
    while (true) {
        const [a, b] = getNextGap(blocks);
        if (b === undefined) break;

        const newId = decrementThenPop(blocks);
        if (newId === undefined) return;

        if (a.id === newId) {
            a.length++;
        } else {
            blocks.splice(blocks.indexOf(b), 0, { id: newId, length: 1, position: a.position + a.length });
        }
    }
    return checksum(blocks);
};

const expectedFirstSolution = 1928;

const part2 = (input: string) => {
    const blocks = parseInput(input);
    const lastBlockId = blocks.at(-1)!.id;

    for (let idx = lastBlockId; idx > 0; idx--) {
        const currentBlock = blocks[idx];
        const [a, b] = getNextGap(blocks, currentBlock.length, currentBlock.position);
        if (b == undefined) continue;
        blocks.splice(idx, 1);
        currentBlock.position = a.position + a.length;
        blocks.splice(blocks.indexOf(a) + 1, 0, currentBlock);
    }
    console.log(blocks);
    return checksum(blocks);
};

const expectedSecondSolution = 2858;

export { part1, expectedFirstSolution, part2, expectedSecondSolution };
