export function rndInt(n) {
  return Math.floor(Math.random() * n);
}

export function rndColor() {
  return `rgb(${rndInt(256)},${rndInt(256)},${rndInt(256)})`;
}

export function zeroPad(n) {
  return n < 10 ? `0${n}` : n;
}

export function repeat(str, times) {
  if (times <= 0) {
    return '';
  }
  return new Array(times + 1).join(str);
}

export function repeated(arr) {
  const found = {};
  for (let i = 0; i < arr.length; ++i) {
    const v = arr[i];
    if (found[v]) {
      return [found[v], i];
    }
    found[v] = i;
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
