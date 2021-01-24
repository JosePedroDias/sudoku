import tap from 'tap';

import { generate } from '../generate.mjs';
import { setSeed, unsetSeed } from '../utils.mjs';

tap.test('generate', (t) => {
  setSeed();
  tap.equal(
    generate(),
    '968721435732495186451683792845169327397254618216837954684312579573948261129576843'
  );
  tap.equal(
    generate(),
    '327459618614382579589161473145823796298747156736599284972635841853214967461978325'
  );
  unsetSeed();

  t.end();
});
