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
  console.log(b.getValidValues(lastPos));
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
  console.log(isValid);
  b.draw();
  return isValid;
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
