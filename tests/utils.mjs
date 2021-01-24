import {
  setSeed,
  unsetSeed,
  rndInt,
  rndFloat,
  rndColor,
  rndArray,
  sort,
  zeroPad,
  getIndices,
  shuffleIndices,
  shuffleArray,
  repeat,
  repeated,
  withoutRepeats,
  trimStart,
} from '../utils.mjs';
import tap from 'tap';
import { rotateLeft } from '../utils.mjs';

tap.test('rndInt', (t) => {
  setSeed();
  tap.equal(rndInt(20), 19);
  tap.equal(rndInt(20), 6);
  tap.equal(rndInt(20), 11);
  unsetSeed();

  t.end();
});

tap.test('rndFloat', (t) => {
  setSeed();
  tap.equal(rndFloat(), 0.9872818551957607);
  tap.equal(rndFloat(1.5), 0.52320496737957);
  tap.equal(rndFloat(20), 11.263867244124413);
  unsetSeed();

  t.end();
});

tap.test('rndColor', (t) => {
  setSeed();
  tap.equal(rndColor(), `rgb(252,89,144)`);
  tap.equal(rndColor(), `rgb(255,212,33)`);
  tap.equal(rndColor(), `rgb(211,214,28)`);
  unsetSeed();

  t.end();
});

tap.test('rndArray', (t) => {
  const arr = ['a', 'b', 'c', 'd', 'e'];
  setSeed();
  tap.equal(rndArray(arr), 'e');
  tap.equal(rndArray(arr), 'b');
  tap.equal(rndArray(arr), 'c');
  tap.equal(rndArray([]), undefined);
  unsetSeed();

  t.end();
});

tap.test('sort', (t) => {
  const arr = [
    { k: 1, _: 1 },
    { k: 1, _: 2 },
    { k: 1, _: 3 },

    { k: 2, _: 1, z: true },
    { k: 2, _: 2, z: true },
    { k: 2, _: 3, z: true },

    { k: 3, _: 1, z: true, y: true },
    { k: 3, _: 2, z: true, y: true },
    { k: 3, _: 3, z: true, y: true },
  ];
  const heu = (o) => Object.keys(o).length;
  setSeed();
  tap.same(sort(arr, heu, true), [
    { k: 1, _: 2 },
    { k: 1, _: 3 },
    { k: 1, _: 1 },

    { k: 2, _: 3, z: true },
    { k: 2, _: 2, z: true },
    { k: 2, _: 1, z: true },

    { k: 3, _: 3, z: true, y: true },
    { k: 3, _: 1, z: true, y: true },
    { k: 3, _: 2, z: true, y: true },
  ]);
  tap.same(sort(arr, heu, true), [
    { k: 1, _: 1 },
    { k: 1, _: 2 },
    { k: 1, _: 3 },

    { k: 2, _: 3, z: true },
    { k: 2, _: 1, z: true },
    { k: 2, _: 2, z: true },

    { k: 3, _: 2, z: true, y: true },
    { k: 3, _: 1, z: true, y: true },
    { k: 3, _: 3, z: true, y: true },
  ]);
  unsetSeed();

  t.end();
});

tap.test('zeroPad', (t) => {
  tap.equal(zeroPad(1), `01`);
  tap.equal(zeroPad(21), 21);

  t.end();
});

tap.test('getIndices', (t) => {
  tap.same(getIndices(3), [0, 1, 2]);
  tap.same(getIndices(7), [0, 1, 2, 3, 4, 5, 6]);

  t.end();
});

tap.test('shuffleIndices', (t) => {
  setSeed();
  tap.same(shuffleIndices(3), [2, 0, 1]);
  tap.same(shuffleIndices(7), [6, 4, 0, 5, 3, 1, 2]);
  unsetSeed();

  t.end();
});

tap.test('shuffleArray', (t) => {
  const arr = [2, 'a', true, { a: 1 }, [3]];
  setSeed();
  tap.same(shuffleArray(arr), [
    [3],
    'a',
    true,
    {
      a: 1,
    },
    2,
  ]);
  tap.same(shuffleArray(arr), [
    2,
    [3],
    {
      a: 1,
    },
    'a',
    true,
  ]);
  unsetSeed();

  t.end();
});

tap.test('repeat', (t) => {
  tap.equal(repeat('ab', 0), '');
  tap.equal(repeat('ab', 2), 'abab');
  tap.equal(repeat('abc', 4), 'abcabcabcabc');

  t.end();
});

tap.test('repeated', (t) => {
  tap.same(repeated([2, 5, 3, 5, 1]), [1, 3]);
  tap.equal(repeated([2, 9, 3, 5, 1]), undefined);

  t.end();
});

tap.test('withoutRepeats', (t) => {
  tap.same(withoutRepeats([2, 5, 3, 5, 1]), [2, 5, 3, 1]);

  t.end();
});

tap.test('trimStart', (t) => {
  tap.equal(trimStart('asd'), 'asd');
  tap.equal(
    trimStart(`  asd
    zxc`),
    `asd
zxc`
  );

  t.end();
});

tap.test('rotateLeft', (t) => {
  tap.same(rotateLeft([1, 3, 5, 7], 1), [3, 5, 7, 1]);
  tap.same(rotateLeft([1, 3, 5, 7], 2), [5, 7, 1, 3]);

  t.end();
});
