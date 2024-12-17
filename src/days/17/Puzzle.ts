import { StringifyOptions } from "querystring";

const parseInput = (input: string) => {
    const [registerInitiation, programText] = input.split('\n\n');
    const registers = new Map<string, number>();

    registerInitiation.split('\n').forEach((line) => {
        const [_, name, __, value] = line.split(' ').flatMap((chunk) => chunk.split(':'));
        registers.set(name, Number(value));
    });
    registers.set("PC", 0);
    
    const program = programText.split(' ')[1]
        .split(',')
        .map(Number)
        .reduce(
            (pairs, value, index) => {
                index % 2 ? pairs.at(-1)!.push(value) : pairs.push([value])
                return pairs;
            }
        , [] as number[][])

    return { registers, program: program };
};

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

enum OpCode {
    ADV,
    BXL,
    BST,
    JNZ,
    BXC,
    OUT,
    BDV,
    CDV,
}

const getComboOperand = (registers: Map<string, number>, operand: number): number => {
    if (0 <= operand && operand <= 3) return operand;
    switch (operand) {
        case 4:
            return registers.get('A')!;
        case 5:
            return registers.get('B')!;
        case 6:
            return registers.get('C')!;
    }

    console.error(`Invalid operand: ${operand}`);
    process.exit(-1);
};

type Instruction = { (registers: Map<string, number>, operand: number): { registers: Map<string, number>, output?: number} };
const instruction = new Map<OpCode, Instruction>([
    [
        OpCode.ADV,
        (registers, operand) => {
            operand = getComboOperand(registers, operand);
            registers.set('A', Math.trunc(registers.get('A')! / 2 ** operand));
            registers.set("PC", registers.get("PC")! + 1);
            return { registers };
        },
    ],
    [
        OpCode.BXL,
        (registers, operand) => {
            registers.set("B", registers.get("B")! ^ operand);
            registers.set("PC", registers.get("PC")! + 1);
            return { registers };
        },
    ],
    [
        OpCode.BST,
        (registers, operand) => {
            operand = getComboOperand(registers, operand);
            registers.set("B", operand % 8);
            registers.set("PC", registers.get("PC")! + 1);
            return { registers };
        },
    ],
    [
        OpCode.JNZ,
        (registers, operand) => {
            if(registers.get("A")! === 0) {
                registers.set("PC", registers.get("PC")! + 1);
            } else {
                registers.set("PC", operand / 2);
            }
            return { registers };
        },
    ],
    [
        OpCode.BXC,
        (registers, _) => {
            registers.set('B', registers.get('B')! ^ registers.get('C')! );
            registers.set("PC", registers.get("PC")! + 1);
            return { registers };
        },
    ],
    [
        OpCode.OUT,
        (registers, operand) => {
            operand = getComboOperand(registers, operand);
            registers.set("PC", registers.get("PC")! + 1);
            return { registers, output: operand % 8 };
        },
    ],
    [
        OpCode.BDV,
        (registers, operand) => {
            operand = getComboOperand(registers, operand);
            registers.set('B', Math.trunc(registers.get('A')! / 2 ** operand));
            registers.set("PC", registers.get("PC")! + 1);
            return { registers };
        },
    ],
    [
        OpCode.CDV,
        (registers, operand) => {
            operand = getComboOperand(registers, operand);
            registers.set('C', Math.trunc(registers.get('A')! / 2 ** operand));
            registers.set("PC", registers.get("PC")! + 1);
            return { registers };
        },
    ],
]);

const run = (registers: Map<string, number>, program: number[][]): number[] => {
    const output: number[] = [];

    let opCode: OpCode, operand: number;
    while( program.length > registers.get("PC")! ) {
        [opCode, operand] = program[registers.get("PC")!];
        console.log(opCode, operand)
        let newOutput;
        ({registers, output: newOutput} = instruction.get(opCode)!(registers, operand))
        console.log(registers)
        console.log(newOutput)

        if(newOutput !== undefined) output.push(newOutput);
        console.log(output)
    }

    return output;
} 

const part1 = (input: string) => {
    let {registers, program} = parseInput(input);

    run(registers, program).join(",");
};

const expectedFirstSolution = '4,6,3,5,6,3,5,2,1,0';

const part2 = (input: string) => {
    return 'part 2';
};

const expectedSecondSolution = 'part 2';

export { part1, expectedFirstSolution, part2, expectedSecondSolution };
