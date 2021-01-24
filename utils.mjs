let seed = 0;

export function unsetSeed() {
  seed = 0;
}

export function setSeed(n) {
  seed = n || 0x2f6e2b1;
}

export function random() {
  if (!seed) {
    return Math.random();
  }
  seed = (seed + 0x7ed55d16 + (seed << 12)) & 0xffffffff;
  seed = (seed ^ 0xc761c23c ^ (seed >>> 19)) & 0xffffffff;
  seed = (seed + 0x165667b1 + (seed << 5)) & 0xffffffff;
  seed = ((seed + 0xd3a2646c) ^ (seed << 9)) & 0xffffffff;
  seed = (seed + 0xfd7046c5 + (seed << 3)) & 0xffffffff;
  seed = (seed ^ 0xb55a4f09 ^ (seed >>> 16)) & 0xffffffff;
  return (seed & 0xfffffff) / 0x10000000;
}

export function rndInt(n) {
  return Math.floor(random() * n);
}

export function rndFloat(f = 1) {
  return random() * f;
}

export function rndColor() {
  return `rgb(${rndInt(256)},${rndInt(256)},${rndInt(256)})`;
}

export function sort(arr, intHeuristicFn, addEntropy = false) {
  const arr2 = [...arr];
  if (addEntropy) {
    arr2.forEach((it) => (it._tmp = 0.1 + rndFloat(0.8)));
  }
  const fn = addEntropy ? (it) => intHeuristicFn(it) + it._tmp : intHeuristicFn;
  arr2.sort((a, b) => fn(a) - fn(b));
  if (addEntropy) {
    arr2.forEach((it) => delete it._tmp);
  }
  return arr2;
}

export function zeroPad(n) {
  return n < 10 ? `0${n}` : n;
}

export function getIndices(n) {
  const arr = new Array(n);
  arr.fill(true);
  return arr.map((_, i) => i);
}

export function shuffleIndices(n) {
  const from = getIndices(n);
  const result = [];
  while (from.length > 0) {
    const i = rndInt(from.length);
    const item = from[i];
    from.splice(i, 1);
    result.push(item);
  }
  return result;
}

export function shuffleArray(arr) {
  const indices = shuffleIndices(arr.length);
  return indices.map((i) => arr[i]);
}

export function repeat(str, times) {
  if (times <= 0) {
    return '';
  }
  return new Array(times + 1).join(str);
}

// returns first 2 indices with the same element.
export function repeated(arr) {
  const foundIndices = {};
  for (let i = 0; i < arr.length; ++i) {
    const elem = arr[i];
    if (foundIndices[elem] !== undefined) {
      return [foundIndices[elem], i];
    }
    foundIndices[elem] = i;
  }
}

export function withoutRepeats(arr, removeArr) {
  const s = new Set();
  arr.forEach((it) => s.add(it));
  if (removeArr) {
    removeArr.forEach((it) => s.delete(it));
  }
  return Array.from(s);
}

export function trimStart(linesStr) {
  const lines = linesStr.split('\n');
  const lines2 = lines.map((l) => l.trimStart());
  return lines2.join('\n');
}

export function rotateLeft(arr, steps = 1) {
  const [first, ...other] = arr;
  other.push(first);
  if (steps > 1) {
    return rotateLeft(other, steps - 1);
  }
  return other;
}

///// UNTESTED

export function obj2map(o) {
  return new Map(Object.entries(o));
}

export function map2obj(m) {
  const o = {};
  for (let k of m.keys()) {
    o[k] = m.get(k);
  }
  return o;
}

export function record(...args) {
  record.calls.push(args);
}
record.calls = [];

// kinda lame approach but works for differently named files in lack of better idea O:)
export function isMainModule(importMeta) {
  const a = importMeta.url.split('/').pop();
  const b = process.argv[process.argv.length - 1].split('/').pop();
  return a === b;
}
