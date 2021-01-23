import { Board } from './board.mjs';
import { rndInt } from './utils.mjs';

export function isHiddenSingle(c) {
  return !c.value && c.hints.length === 1;
}

export function getHiddenSingles(b) {
  return b.getAllCells().filter(isHiddenSingle);
}
