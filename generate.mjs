#!/usr/bin/env node

/* eslint-env node */

import { isMainModule } from './utils.mjs';
import { Board } from './board.mjs';
import { solveAtOnce } from './solve.mjs';

export function generate() {
  // TODO empty cell pattern, check unique solution stands
  return solveAtOnce();
}

function go() {
  const s = generate();
  const b = new Board();
  b.setState81(s);
  console.log(b.getStateAscii());
}

if (await isMainModule(import.meta.url)) {
  go();
}
