export function rndInt(n) {
  return Math.floor(Math.random() * n);
}

export function rndColor() {
  return `rgb(${rndInt(256)},${rndInt(256)},${rndInt(256)})`;
}

export function zeroPad(n) {
  return n < 10 ? `0${n}` : n;
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
