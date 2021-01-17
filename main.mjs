import { obj2map, map2obj } from './utils.mjs';
import { storageFactory } from './storage.mjs';
import { hasModifiers } from './keys.mjs';
import { ElapsedTime } from './elapsed-time.mjs';
import { Board } from './board.mjs';
import { generateNumbers } from './numbers.mjs';
import { generateActions } from './actions.mjs';

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
  lastPos = [5, 5],
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
  //printSelectedCellHints();
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
    const hasValue = c.toggleValue(value);
    if (hasValue) {
      b.getRelatedCells(lastPos).forEach((c2) => c2.unsetHint(value, true));
    }
  }
  b.draw();

  history.push(b.getState());

  updateCounters();
  b.draw();
}

function updateCounters() {
  const hist = b.getValueHistogram();
  for (let n = 1; n <= 9; ++n) {
    numbers.get(n).setCount(9 - (hist[n] || 0));
  }
}

function check() {
  const isValid = b.check((msg) => console.log(msg));
  b.draw();
  console.log('check went ok?', isValid);

  setTimeout(() => {
    b.unsetInvalidCells();
    b.draw();
  }, 2500);

  return isValid;
}

function fillHints() {
  b.fillHints();
  b.draw();
}

function load() {
  const dt = storage.getItem('time');
  et.reset(dt);
  const st = obj2map(storage.getItem('state'));
  history = [st];
  b.setState(st);
  b.draw();
  updateCounters();
}

function save() {
  storage.setItem('time', et.dt);
  storage.setItem('state', map2obj(b.getState()));
}

function undo() {
  if (history.length < 2) {
    return;
  }
  history.pop();
  b.setState(history[history.length - 1]);
  b.draw();
}

function toggleHintMode() {
  actions.get('hint mode').toggle();
  inHintMode = !inHintMode;
}

function printSelectedCellHints() {
  console.log(b.getValidValues(lastPos));
}

function onAction(action) {
  if (action === 'load') {
    load();
  } else if (action === 'save') {
    save();
  } else if (action === 'hint mode') {
    toggleHintMode();
  } else if (action === 'undo') {
    undo();
  } else if (action === 'fill hints') {
    fillHints();
  } else if (action === 'check') {
    check();
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
      toggleHintMode();
      break;
    case 'KeyL':
      load();
      break;
    case 'KeyS':
      save();
      break;
    case 'KeyU':
      undo();
      break;
    case 'KeyH':
      fillHints();
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

window.b = b; // TODO temp
