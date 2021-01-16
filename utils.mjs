export function rndInt(n) {
  return Math.floor(Math.random() * n);
}

export function rndColor() {
  return `rgb(${rndInt(256)},${rndInt(256)},${rndInt(256)})`;
}
