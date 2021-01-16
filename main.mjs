import { rndInt } from './utils.mjs';
import { ElapsedTime } from './elapsed-time.mjs';
import { Board } from './board.mjs';
import { generateNumbers } from './numbers.mjs';
import { generateActions } from './actions.mjs';
import { repeated } from './utils.mjs';

const boardWidth = 720 * 0.8;

function getCellData(pos) {
  //const value = undefined;

  const hints = [];
  const value = rndInt(3) === 0 ? rndInt(9) + 1 : undefined;

  /*for (let n = 1; n <= 9; ++n) {
    if (rndInt(3) === 0) {
      hints.push(n);
    }
  }*/

  return {
    value,
    hints,
  };
}

let b,
  lastPos,
  numbers,
  actions,
  history = [],
  inHintMode = false;

function onClickCell(pos) {
  const c = b.getCell(pos);

  b.setSelectedPosition(pos);
  b.setSelectedNumber(c.value || -1);
  b.draw();

  lastPos = pos;
}

b = new Board(document.querySelector('.board'), boardWidth, {
  getCellData,
  onClickCell,
});

history.push(b.getState());

const et = new ElapsedTime(document.querySelector('.elapsed-time'));
et.start();

function onNumber(value) {
  const c = b.getCell(lastPos);

  if (inHintMode) {
    c.toggleHint(value);
  } else {
    c.setValue(c.value === value ? undefined : value);
  }
  b.draw();

  history.push(b.getState());

  updateCounters();
}

function updateCounters() {
  const hist = {};
  for (let c of b.getAllCells()) {
    if (c.value) {
      if (!hist[c.value]) {
        hist[c.value] = 1;
      } else {
        ++hist[c.value];
      }
    }
  }
  for (let n = 1; n <= 9; ++n) {
    numbers.get(n).setCount(9 - (hist[n] || 0));
  }
}

function check() {
  let ok = true;

  b.getAllCells().forEach((c) => c.clearInvalid());

  function checkSequence(cells, kind) {
    const filledCells = cells.filter((c) => c.value);
    const values = filledCells.map((c) => c.value);
    const repeatIndices = repeated(values);
    if (repeatIndices) {
      ok = false;
      const pos1 = filledCells[repeatIndices[0]].position;
      const pos2 = filledCells[repeatIndices[1]].position;
      b.getCell(pos1).setInvalid();
      b.getCell(pos2).setInvalid();
      console.log(`repeated number in ${kind}: cells ${pos1} and ${pos2}`);
    }
  }
  for (let n = 1; n <= 9; ++n) {
    checkSequence(b.getRowCells(n), `row #${n}`);
    checkSequence(b.getColCells(n), `col #${n}`);
    checkSequence(b.getTileCells(n), `tile #${n}`);
  }
  b.draw();
  return ok;
}

function onAction(action) {
  if (action === 'hint') {
    actions.get('hint').toggle();
    inHintMode = !inHintMode;
  } else if (action === 'undo') {
    if (history.length < 2) {
      return;
    }
    history.pop();
    b.setState(history[history.length - 1]);
    b.draw();
  } else if (action === 'check') {
    check();
  } else if (action === 'restart') {
    history = [history[0]];
    b.setState(history[0]);
    b.draw();
  }
}

numbers = generateNumbers(document.querySelector('.numbers'), onNumber);
actions = generateActions(document.querySelector('.actions'), onAction);

updateCounters();

//window.b = b; // TODO temp
