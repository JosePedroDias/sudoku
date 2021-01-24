import tap from 'tap';

import { generate } from '../generate.mjs';
import { setSeed, unsetSeed } from '../utils.mjs';

tap.test('generate', (t) => {
  setSeed();
  tap.equal(
    generate(),
    '935871642871642935642935871429358716358716429716429358164293587293587164587164293'
  );
  tap.equal(
    generate(),
    '136592748592748136748136592481365927365927481927481365274813659813659274659274813'
  );
  unsetSeed();

  t.end();
});
