export function rndInt(n) {
  return Math.floor(Math.random() * n);
}

export function rndColor() {
  return `rgb(${rndInt(256)},${rndInt(256)},${rndInt(256)})`;
}

export function zeroPad(n) {
  return n < 10 ? `0${n}` : n;
}
