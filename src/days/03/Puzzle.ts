
enum StateType {
  ExpectingCharacter,
  ExpectingDigitOrComma,
  ExpectingDigitOrBracket
}

interface State {
  state: StateType,
  expectedCharacter: string
}

class Instruction {
  lhs: number
  rhs: number
  
  constructor() {
    this.lhs = 0;
    this.rhs = 0;
  }

}

const part1 = (input: string) => {
  const instructions: Instruction[] = [];
  
  const defaultState: State = {
    state: StateType.ExpectingCharacter,
    expectedCharacter: 'm'
  };

  let currentState = defaultState;
  
  let currentInstruction = new Instruction();

  [...input].forEach(character => {
    console.log(`${character} : ${StateType[currentState.state]}, '${currentState.expectedCharacter}'`)
    console.log(currentInstruction);
    console.log(instructions)
    switch(currentState.state) {
      case StateType.ExpectingCharacter:
        if (currentState.expectedCharacter != character) {
          currentState = defaultState;
          currentInstruction = new Instruction();
          break;
        }
        switch(character) {
          case 'm':
            currentState = {
              state: StateType.ExpectingCharacter,
              expectedCharacter: 'u'
            }
            break;
          case 'u':
            currentState = {
              state: StateType.ExpectingCharacter,
              expectedCharacter: 'l'
            }
            break;
          case 'l':
            currentState = {
              state: StateType.ExpectingCharacter,
              expectedCharacter: '('
            }
            break;
          case '(':
            currentState = {
              state: StateType.ExpectingDigitOrComma,
              expectedCharacter: ""
            }
            break;
        }
        break;
      case StateType.ExpectingDigitOrComma:
        if (character == ",") {
          currentState = {
            state: StateType.ExpectingDigitOrBracket,
            expectedCharacter: ""
          }
          break;
        }

        if (character >= '0' && character <= '9') { //is digit
          currentInstruction.lhs = currentInstruction.lhs * 10 + parseInt(character);
          if (currentInstruction.lhs > 999) {
            currentState = defaultState
            currentInstruction = new Instruction();
          }
          break;
        }

        currentState = defaultState;
        currentInstruction = new Instruction();
        break;
      
      case StateType.ExpectingDigitOrBracket:
        if (character == ")") {
          currentState = defaultState;
          instructions.push(currentInstruction);
          currentInstruction = new Instruction();
          break;
        }

        if (character >= '0' && character <= '9') { //is digit
          currentInstruction.rhs = currentInstruction.rhs * 10 + parseInt(character);
          if (currentInstruction.rhs > 999) {
            currentState = defaultState
            currentInstruction = new Instruction();
          }
          break;
        }
        
        currentState = defaultState;
        currentInstruction = new Instruction();
        break;
    }
  })

  instructions.forEach(instruction => { console.log(`${instruction.lhs.toString()},${instruction.rhs.toString()}`) })
  
  return instructions.map(i => i.lhs * i.rhs).reduce((lhs, rhs) => lhs + rhs, 0)
};

const expectedFirstSolution = 161;

const part2 = (input: string) => {
  return 'part 2';
};

const expectedSecondSolution = 'solution 2';

export { part1, expectedFirstSolution, part2, expectedSecondSolution };
