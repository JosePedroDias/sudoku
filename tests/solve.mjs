import tap from 'tap';

import { setSeed, unsetSeed } from '../utils.mjs';
import { solve } from '../solve.mjs';
//import { board } from '../board.mjs';

tap.test('rndInt', (t) => {
  setSeed();
  //const solver = solve();
  //const { value, done } = solver.next();
  unsetSeed();

  tap.equal(1, 1);

  t.end();
});
