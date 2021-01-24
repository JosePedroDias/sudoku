/*
line 1: 8 9 3  2 7 6  4 5 1
line 2: 2 7 6  4 5 1  8 9 3 (shift 3)
line 3: 4 5 1  8 9 3  2 7 6 (shift 3)

line 4: 5 1 8  9 3 2  7 6 4 (shift 1)
line 5: 9 3 2  7 6 4  5 1 8 (shift 3)
line 6: 7 6 4  5 1 8  9 3 2 (shift 3)

line 7: 6 4 5  1 8 9  3 2 7 (shift 1)
line 8: 1 8 9  3 2 7  6 4 5 (shift 3)
line 9: 3 2 7  6 4 5  1 8 9 (shift 3)
*/

import { shuffleArray, rotateLeft } from './utils.mjs';
import { Board, VALUES } from './board.mjs';

export function generate() {
  const lines = [];

  let line = shuffleArray([...VALUES]);
  lines.push(line.join(''));

  line = rotateLeft(line, 3);
  lines.push(line.join(''));

  line = rotateLeft(line, 3);
  lines.push(line.join(''));

  //

  line = rotateLeft(line, 1);
  lines.push(line.join(''));

  line = rotateLeft(line, 3);
  lines.push(line.join(''));

  line = rotateLeft(line, 3);
  lines.push(line.join(''));

  //

  line = rotateLeft(line, 1);
  lines.push(line.join(''));

  line = rotateLeft(line, 3);
  lines.push(line.join(''));

  line = rotateLeft(line, 3);
  lines.push(line.join(''));

  return lines.join('');
}

function go() {
  const s = generate();
  const b = new Board();
  b.setState81(s);
  console.log(b.getStateAscii());
}

//if (require.main === module) {
go();
//}
