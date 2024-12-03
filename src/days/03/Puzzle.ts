import { pairwise } from '../02/Puzzle.js';

enum StateType {
  ExpectingStartingCharacter,
  ExpectingMulCharacter,
  ExpectingDigitOrComma,
  ExpectingDigitOrBracket,
  ExpectingDoOrDontCharacter,
  ExpectingDoCharacter,
  ExpectingDontCharacter,
}

class State {
  type: StateType;
  previousCharacter: string;
  currentInstruction: Instruction;
  instructions: Instruction[];
  multiplicationEnabled: boolean;

  constructor() {
    this.type = StateType.ExpectingStartingCharacter;
    this.previousCharacter = '';
    this.currentInstruction = new Instruction();
    this.instructions = [];
    this.multiplicationEnabled = true;
  }

  static fromState(state: State): State {
    return { ...new State(), instructions: state.instructions, multiplicationEnabled: state.multiplicationEnabled };
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

interface StateTransition {
  test: (character: string, state: State) => boolean;
  nextState: (state: State, character: string) => State;
}

const startingCharacterTransition: StateTransition = {
  test: (char) => char == 'm',
  nextState: (state) => {
    state.type = StateType.ExpectingMulCharacter;
    return state;
  },
};

const createStateTransitionFromWord = (word: string, terminationState: (state: State) => State): StateTransition[] => {
  const transitions = pairwise([...word])
    .map(([a, b]) => ({
      test: (char: string, state: State) => char == b && state.previousCharacter == a,
      nextState: (state: State) => state,
    }))
    .toArray();
  transitions[transitions.length - 1].nextState = terminationState;
  return transitions;
};

const mulCharacterTransitions = createStateTransitionFromWord('mul(', (state) => ({
  ...state,
  type: StateType.ExpectingDigitOrComma,
}));

const digitOrCommaTransitions: StateTransition[] = [
  {
    test: (char) => char == ',',
    nextState: (state) => ({ ...state, type: StateType.ExpectingDigitOrBracket }),
  },
  {
    test: (char) => char >= '0' && char <= '9',
    nextState: (state, char) => {
      state.currentInstruction = {
        ...state.currentInstruction,
        lhs: state.currentInstruction.lhs * 10 + parseInt(char),
      };
      if (state.currentInstruction.lhs > 999) return State.fromState(state);
      return state;
    },
  },
];

const digitOrBracketTransitions: StateTransition[] = [
  {
    test: (char) => char == ')',
    nextState: (state) => {
      const currentInstruction = state.currentInstruction;
      const newState = State.fromState(state);
      if (newState.multiplicationEnabled) newState.instructions.push(currentInstruction);
      return newState;
    },
  },
  {
    test: (char) => char >= '0' && char <= '9',
    nextState: (state, char) => {
      state.currentInstruction = {
        ...state.currentInstruction,
        rhs: state.currentInstruction.rhs * 10 + parseInt(char),
      };
      if (state.currentInstruction.rhs > 999) return State.fromState(state);
      return state;
    },
  },
];

const transitions = new Map([
  [StateType.ExpectingStartingCharacter, [startingCharacterTransition]],
  [StateType.ExpectingMulCharacter, mulCharacterTransitions],
  [StateType.ExpectingDigitOrComma, digitOrCommaTransitions],
  [StateType.ExpectingDigitOrBracket, digitOrBracketTransitions],
]);

const process = (input: string, transitions: Map<StateType, StateTransition[]>): Instruction[] => {
  let currentState = new State();

  [...input].forEach((character) => {
    const theseTransitions = transitions.get(currentState.type);
    if (theseTransitions === undefined)
      throw new Error(`Transitions not defined for state ${StateType[currentState.type].toString()}`);
    theseTransitions.push({
      test: () => true,
      nextState: (state) => ({ ...State.fromState(state), previousCharacter: character }),
    });
    for (const transition of theseTransitions) {
      if (transition.test(character, currentState)) {
        currentState = { ...transition.nextState(currentState, character), previousCharacter: character };
        break;
      }
    }
  });

  return currentState.instructions;
};

const part1 = (input: string) => {
  const instructions = process(input, transitions);
  return instructions.map((i) => i.lhs * i.rhs).reduce((lhs, rhs) => lhs + rhs, 0);
};

const expectedFirstSolution = 161;

const startingCharacterTransitions: StateTransition[] = [
  {
    test: (char) => char == 'm',
    nextState: (state) => ({ ...state, type: StateType.ExpectingMulCharacter }),
  },
  {
    test: (char) => char == 'd',
    nextState: (state) => ({ ...state, type: StateType.ExpectingDoOrDontCharacter }),
  },
];

const doOrDontCharacterTransitions: StateTransition[] = [
  {
    test: (char, state) => char == 'o' && state.previousCharacter == 'd',
    nextState: (state) => state,
  },
  {
    test: (char, state) => char == '(' && state.previousCharacter == 'o',
    nextState: (state) => ({ ...state, type: StateType.ExpectingDoCharacter }),
  },
  {
    test: (char, state) => char == 'n' && state.previousCharacter == 'o',
    nextState: (state) => ({ ...state, type: StateType.ExpectingDontCharacter }),
  },
];

const doCharacterTransitions = createStateTransitionFromWord('()', (state) => ({
  ...State.fromState(state),
  multiplicationEnabled: true,
}));
const dontCharacterTransitions = createStateTransitionFromWord("n't()", (state) => ({
  ...State.fromState(state),
  multiplicationEnabled: false,
}));

const p2transitions = new Map(transitions)
  .set(StateType.ExpectingStartingCharacter, startingCharacterTransitions)
  .set(StateType.ExpectingDoOrDontCharacter, doOrDontCharacterTransitions)
  .set(StateType.ExpectingDoCharacter, doCharacterTransitions)
  .set(StateType.ExpectingDontCharacter, dontCharacterTransitions);

const part2 = (input: string) => {
  const instructions = process(input, p2transitions);
  return instructions.map((i) => i.lhs * i.rhs).reduce((lhs, rhs) => lhs + rhs, 0);
};

const expectedSecondSolution = 48;

export { part1, expectedFirstSolution, part2, expectedSecondSolution };
