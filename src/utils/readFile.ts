import { readFileSync } from 'fs';

export default (inputFilePath: string) => {
  return readFileSync(inputFilePath, { encoding: 'utf-8', flag: 'r' });
};
