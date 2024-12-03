enum StateType {
  ExpectingCharacter,
  ExpectingDigitOrComma,
  ExpectingDigitOrBracket,
}

class State {
  state: StateType;
  expectedCharacter: string;
  currentInstruction: Instruction;
  instructions: Instruction[];

  constructor() {
    this.state = StateType.ExpectingCharacter;
    this.expectedCharacter = 'm';
    this.currentInstruction = new Instruction();
    this.instructions = [];
  }

  static fromState(state: State): State {
    const retstate = new State();
    retstate.instructions = state.instructions;
    return retstate;
  }
}

class Instruction {
  lhs: number;
  rhs: number;

  constructor() {
    this.lhs = 0;
    this.rhs = 0;
  }
}

const handleMulCharacter = (character: string, state: State): State => {
  const retstate = State.fromState(state);
  switch (character) {
    case 'm':
      retstate.expectedCharacter = 'u';
      break;
    case 'u':
      retstate.expectedCharacter = 'l';
      break;
    case 'l':
      retstate.expectedCharacter = '(';
      break;
    case '(':
      retstate.state = StateType.ExpectingDigitOrComma;
      retstate.expectedCharacter = '';
      break;
  }
  return retstate;
};

const handleDigitOrComma = (character: string, state: State): State => {
  if (character == ',') {
    state.state = StateType.ExpectingDigitOrBracket;
    state.expectedCharacter = '';
    return state;
  }

  //is digit
  if (character >= '0' && character <= '9') {
    state.currentInstruction.lhs = state.currentInstruction.lhs * 10 + parseInt(character);
    if (state.currentInstruction.lhs <= 999) {
      return state;
    }
  }
  return State.fromState(state);
};

const handleDigitOrBracket = (character: string, state: State): State => {
  if (character == ')') {
    const currentInstruction = state.currentInstruction;
    state = State.fromState(state);
    state.instructions.push(currentInstruction);
    return state;
  }

  //is digit
  if (character >= '0' && character <= '9') {
    state.currentInstruction.rhs = state.currentInstruction.rhs * 10 + parseInt(character);
    if (state.currentInstruction.rhs <= 999) {
      return state;
    }
  }

  return State.fromState(state);
};

const part1 = (input: string) => {
  let currentState = new State();

  [...input].forEach((character) => {
    // console.log(`${character} : ${StateType[currentState.state]}, '${currentState.expectedCharacter}'`)
    // console.log(currentState.currentInstruction);
    // console.log(currentState.instructions)
    switch (currentState.state) {
      case StateType.ExpectingCharacter:
        currentState = handleMulCharacter(character, currentState);
        break;
      case StateType.ExpectingDigitOrComma:
        currentState = handleDigitOrComma(character, currentState);
        break;

      case StateType.ExpectingDigitOrBracket:
        currentState = handleDigitOrBracket(character, currentState);
        break;
    }
  });

  // currentState.instructions.forEach(instruction => { console.log(`${instruction.lhs.toString()},${instruction.rhs.toString()}`) })

  return currentState.instructions.map((i) => i.lhs * i.rhs).reduce((lhs, rhs) => lhs + rhs, 0);
};

const expectedFirstSolution = 161;

const part2 = (input: string) => {
  return 'part 2';
};

const expectedSecondSolution = 'solution 2';

export { part1, expectedFirstSolution, part2, expectedSecondSolution };
