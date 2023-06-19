#!/usr/bin/env node

/* eslint-env node */

import { sort, shuffleArray, isMainModule } from './utils.mjs';
import { Board } from './board.mjs';

function numHintsFn(c) {
  return c.hints.length;
}

function candidatesToFill(b) {
  let unfilledCells = b.getCellsWithoutValues();
  if (unfilledCells.length > 0) {
    unfilledCells = sort(unfilledCells, numHintsFn, true);
    // remove hints above mininal nr of hints
    const numHints = unfilledCells[0].hints.length;
    unfilledCells.filter((c) => (c.hints.length = numHints));
    // convert multiple hints into multiple cell clones with 1 hint each
    unfilledCells = unfilledCells.reduce((prev, it) => {
      const singles = shuffleArray(it.hints).map((h) => {
        return { p: it.position, v: h };
      });
      return [...prev, ...singles];
    }, []);
  }
  return unfilledCells;
}

function isFilled(b) {
  return b.getCellsWithoutValues().length === 0;
}

function hasUnsetCellWithoutHints(b) {
  let unfilledCells = b.getCellsWithoutValues();
  for (let c of unfilledCells) {
    if (c.hints.length === 0) {
      return true;
    }
  }
  return false;
}

export function* solve(state81) {
  const b = new Board();
  b.setState81(state81);
  const history = []; // array of [state, candidates]
  const moves = []; // [value, pos] TODO moves does not always captures all sets?!

  function save(b, cands) {
    const step = [b.getState(), cands];
    history.push(step);
  }

  function undo(stepBack = false) {
    if (stepBack) {
      history.pop();
    }
    const [state, cands2] = history[history.length - 1];
    if (stepBack) {
      b.setState(state);
    }
    return cands2;
  }

  function electCandidate(cands) {
    let fails;
    do {
      const { p, v } = cands.shift();
      //console.log(`#${moves.length + 1} setting ${v} on ${p}...`);
      b.getCell(p).setValue(v);
      moves.push([p, v]);
      b.fillHints();
      fails = hasUnsetCellWithoutHints(b);

      if (fails) {
        moves.pop();
        const needsStepBack = cands.length === 0;
        if (needsStepBack) {
          //moves.pop();
        }
        /*console.log(
          `  oops! ${
            needsStepBack ? 'trying another' : 'no more cands. stepping back'
          }`
        );*/
        cands = undo(needsStepBack);
      }
    } while (fails);
  }

  b.fillHints();

  while (true) {
    if (isFilled(b)) {
      return { board: b, moves };
    }

    let cands = candidatesToFill(b);

    //console.log(JSON.stringify(cands, null, 2));
    save(b, cands);
    electCandidate(cands);
    yield { board: b };
  }
}

export function solveAtOnce(
  startState = '000000000000000000000000000000000000000000000000000000000000000000000000000000000'
) {
  const solver = solve(startState);

  while (true) {
    const { value, done } = solver.next();
    const { board, moves } = value;

    if (!done) {
      //console.log(board.getStateAscii());
    } else {
      //console.log('DONE!');
      //console.log(moves);
      //console.log(moves.length);
      return board.getState81();
    }
  }
}

function go() {
  const s = solveAtOnce();
  //'260083000107020408000040000000250010645000932010096000000030000703060501000570084'
  console.log(s);
}

if (isMainModule(import.meta.url)) {
  go();
}
