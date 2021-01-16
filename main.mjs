import { obj2map, map2obj } from './utils.mjs';
import { storageFactory } from './storage.mjs';
import { hasModifiers, KEYS } from './keys.mjs';
import { ElapsedTime } from './elapsed-time.mjs';
import { Board } from './board.mjs';
import { generateNumbers } from './numbers.mjs';
import { generateActions } from './actions.mjs';
import { repeated } from './utils.mjs';

const boardWidth = 720 * 0.8;

const storage = storageFactory('sdku');

function getCellData(pos) {
  const value = undefined;
  //const value = rndInt(3) === 0 ? rndInt(9) + 1 : undefined;

  const hints = [];
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

function load() {
  const dt = storage.getItem('time');
  et.reset(dt);
  const st = obj2map(storage.getItem('state'));
  history = [st];
  b.setState(st);
  b.draw();
}

function save() {
  storage.setItem('time', et.dt);
  storage.setItem('state', map2obj(b.getState()));
}

function restart() {
  history = [history[0]];
  b.setState(history[0]);
  b.draw();
}

function undo() {
  if (history.length < 2) {
    return;
  }
  history.pop();
  b.setState(history[history.length - 1]);
  b.draw();
}

function hint() {
  actions.get('hint').toggle();
  inHintMode = !inHintMode;
}

function onAction(action) {
  if (action === 'hint') {
    hint();
  } else if (action === 'undo') {
    undo();
  } else if (action === 'load') {
    load();
  } else if (action === 'save') {
    save();
  } else if (action === 'check') {
    check();
  } else if (action === 'restart') {
    restart();
  }
}

document.body.addEventListener('keydown', (ev) => {
  if (hasModifiers(ev)) {
    return;
  }
  //console.log(ev.code);
  switch (ev.code) {
    case 'ArrowLeft':
      if (lastPos[0] > 1) {
        --lastPos[0];
      }
      break;
    case 'ArrowRight':
      if (lastPos[0] < 9) {
        ++lastPos[0];
      }
      break;
    case 'ArrowUp':
      if (lastPos[1] > 1) {
        --lastPos[1];
      }
      break;
    case 'ArrowDown':
      if (lastPos[1] < 9) {
        ++lastPos[1];
      }
      break;
    case 'Space':
      hint();
      break;
    case 'KeyL':
      load();
      break;
    case 'KeyS':
      save();
      break;
    case 'KeyR':
      restart();
      break;
    case 'KeyU':
      undo();
      break;
    case 'KeyC':
      check();
      break;
    case 'Digit1':
    case 'Digit2':
    case 'Digit3':
    case 'Digit4':
    case 'Digit5':
    case 'Digit6':
    case 'Digit7':
    case 'Digit8':
    case 'Digit9':
      const value = parseInt(ev.code.substring(5));
      onNumber(value);
      break;
    default:
      return;
  }
  ev.stopPropagation();
  ev.preventDefault();
  b.draw();
});

numbers = generateNumbers(document.querySelector('.numbers'), onNumber);
actions = generateActions(document.querySelector('.actions'), onAction);

updateCounters();

//window.b = b; // TODO temp
