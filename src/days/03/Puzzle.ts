enum StateType {
  ExpectingStartingCharacter,
  ExpectingMulCharacter,
  ExpectingDigitOrComma,
  ExpectingDigitOrBracket,

  // P2 states

  ExpectingDoOrDontCharacter,
  ExpectingDoCharacter,
  ExpectingDontCharacter
}

class State {
  state: StateType;
  previousCharacter: string;
  currentInstruction: Instruction;
  instructions: Instruction[];
  multiplicationEnabled: boolean;

  constructor(startingState = StateType.ExpectingStartingCharacter) {
    this.state = startingState;
    this.previousCharacter = '';
    this.currentInstruction = new Instruction();
    this.instructions = [];
    this.multiplicationEnabled = true;
  }

  static fromState(state: State, startingState = StateType.ExpectingStartingCharacter): State {
    const retstate = new State(startingState);
    retstate.instructions = state.instructions;
    retstate.multiplicationEnabled = state.multiplicationEnabled;
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

const handleStartingCharacter = (character: string, state: State): State => {
    state.previousCharacter = character;
    switch(character) {
        case 'm':
            state.state = StateType.ExpectingMulCharacter;
            break;
    }
    return state;
}

const handleMulCharacter = (character: string, state: State, startingState = StateType.ExpectingStartingCharacter): State => {

  const previousCharacter = state.previousCharacter;
  state.previousCharacter = character;
  state.state = StateType.ExpectingMulCharacter
  switch (character) {
    case 'u':
      if (previousCharacter != 'm') break;    
      return state;
    case 'l':
      if (previousCharacter != 'u') break;    
      return state;
    case '(':
      if (previousCharacter != 'l') break;    
      state.state = StateType.ExpectingDigitOrComma;
      return state;
  }

  const retstate = State.fromState(state, startingState);
  return retstate;
};

const handleDigitOrComma = (character: string, state: State, startingState = StateType.ExpectingStartingCharacter): State => {
  if (character == ',') {
    state.state = StateType.ExpectingDigitOrBracket;
    state.previousCharacter = '';
    return state;
  }

  //is digit
  if (character >= '0' && character <= '9') {
    state.currentInstruction.lhs = state.currentInstruction.lhs * 10 + parseInt(character);
    if (state.currentInstruction.lhs <= 999) {
      return state;
    }
  }
  return State.fromState(state, startingState);
};

const handleDigitOrBracket = (character: string, state: State, startingState = StateType.ExpectingStartingCharacter): State => {
  if (character == ')') {
    const currentInstruction = state.currentInstruction;
    state = State.fromState(state, startingState);
    if (state.multiplicationEnabled) {
        state.instructions.push(currentInstruction);
    }
    return state;
  }

  //is digit
  if (character >= '0' && character <= '9') {
    state.currentInstruction.rhs = state.currentInstruction.rhs * 10 + parseInt(character);
    if (state.currentInstruction.rhs <= 999) {
      return state;
    }
  }

  return State.fromState(state, startingState);
};


const processPartOne = (input: string) : Instruction[] => {
  let currentState = new State();

  [...input].forEach((character) => {
    switch (currentState.state) {
      case StateType.ExpectingStartingCharacter:
        currentState = handleStartingCharacter(character, currentState);
        break;
      case StateType.ExpectingMulCharacter:
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

  return currentState.instructions;
}

const part1 = (input: string) => {
  const instructions = processPartOne(input);
  return instructions.map((i) => i.lhs * i.rhs).reduce((lhs, rhs) => lhs + rhs, 0);
};

const expectedFirstSolution = 161;

const handleStartingCharacterP2 = (character: string, state: State): State => {
    state.previousCharacter = character;
    switch(character) {
        case 'm':
            state.state = StateType.ExpectingMulCharacter;
            break;
        case 'd':
            state.state = StateType.ExpectingDoOrDontCharacter;
            break;
    }
    return state;
}

const handleDoOrDontCharacter = (character: string, state: State) => {
    const previousCharacter = state.previousCharacter;
    state.previousCharacter = character;
    switch(character) {
        case "o":
            if (previousCharacter != "d") break;
            return state;
        case "(":
            if (previousCharacter != "o") break;
            state.state = StateType.ExpectingDoCharacter;
            return state;
        case "n":
            if (previousCharacter != "o") break;
            state.state = StateType.ExpectingDontCharacter;
            return state;
    }
    const retstate = State.fromState(state);
    return retstate;
}

const handleDoCharacter = (character: string, state: State) => {
    const previousCharacter = state.previousCharacter;
    state.previousCharacter = character;
    const retstate = State.fromState(state);
    switch(character) {
        case ")":
            if (previousCharacter != "(") break;
            retstate.multiplicationEnabled = true;
    }
    return retstate;
}

const handleDontCharacter = (character: string, state: State) => {
    const previousCharacter = state.previousCharacter;
    state.previousCharacter = character;
    const retstate = State.fromState(state);
    switch(character) {
        case "'":
            if (previousCharacter != "n") break;
            return state; 
        case "t":
            if (previousCharacter != "'") break;
            return state;
        case "(":
            if (previousCharacter != "t") break;
            return state;
        case ")":
            if (previousCharacter != "(") break;
            retstate.multiplicationEnabled = false;
            break;
    }
    return retstate;
}

const processPartTwo = (input: string) : Instruction[] => {
  let currentState = new State();
  currentState.state = StateType.ExpectingStartingCharacter;

  [...input].forEach((character) => {
    switch (currentState.state) {
      case StateType.ExpectingStartingCharacter:
        currentState = handleStartingCharacterP2(character, currentState);
        break;
      case StateType.ExpectingMulCharacter:
        currentState = handleMulCharacter(character, currentState);
        break;
      case StateType.ExpectingDoOrDontCharacter:
        currentState = handleDoOrDontCharacter(character, currentState);
        break;
      case StateType.ExpectingDoCharacter:
        currentState = handleDoCharacter(character, currentState);
        break;
      case StateType.ExpectingDontCharacter:
        currentState = handleDontCharacter(character, currentState);
        break;
      case StateType.ExpectingDigitOrComma:
        currentState = handleDigitOrComma(character, currentState);
        break;
      case StateType.ExpectingDigitOrBracket:
        currentState = handleDigitOrBracket(character, currentState);
        break;
    }
  });

  return currentState.instructions;
}
const part2 = (input: string) => {
  const instructions = processPartTwo(input);
  return instructions.map((i) => i.lhs * i.rhs).reduce((lhs, rhs) => lhs + rhs, 0);
};

const expectedSecondSolution = 48;

export { part1, expectedFirstSolution, part2, expectedSecondSolution };
