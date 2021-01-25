import { storageFactory } from './storage.mjs';
import { ElapsedTime } from './elapsed-time.mjs';
import { Board, posEqual } from './board.mjs';
import { generateNumbers } from './numbers.mjs';
import { generateActions } from './actions.mjs';
import { rndArray } from './utils.mjs';

let b;

document.fonts.ready.then(() => {
  b.draw();
});

const inDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (inDarkMode) {
  document.body.classList.add('dark');
}

function scaleUI() {
  const scale = Math.min(...[window.innerWidth, window.innerHeight]) / 1000;
  [
    document.querySelector('.elapsed-time'),
    document.querySelector('.board'),
    document.querySelector('div.paused'),
    document.querySelector('.actions'),
    document.querySelector('.numbers'),
  ].forEach((el) => (el.style.transform = `scale(${scale.toFixed(2)})`));
}

const storage = storageFactory('sdku');

const et = new ElapsedTime(document.querySelector('.elapsed-time'));
const numbers = generateNumbers(document.querySelector('.numbers'), onNumber);
const actions = generateActions(document.querySelector('.actions'), onAction);

let lastPos = [5, 5],
  history = [],
  inHintMode = false,
  isPaused = false;

function onClickCell(pos) {
  const samePos = posEqual(b.getSelectedPosition(), pos);
  if (!samePos) {
    b.setSelectedPosition(pos);
  } else if (b.hasSelectedNumber()) {
    const value = b.getSelectedNumber();
    onNumber(value);
  }
  b.draw();

  lastPos = pos;
}

const boardFromHash = location.hash && location.hash.substring(1);

let gcdIdx = 0;
let getCellData = undefined;

if (boardFromHash) {
  getCellData = (pos) => {
    const v = parseInt(boardFromHash[gcdIdx++], 10) || undefined;
    if (pos[0] === 9 && pos[1] === 9) {
      gcdIdx = 0;
    }
    return { value: v, hints: [] };
  };
  location.hash = '';
}

b = new Board({
  parentEl: document.querySelector('.board'),
  boardWidth: 700,
  inDarkMode,
  onClickCell,
  getCellData,
});

if (!boardFromHash) {
  actionLoad();
  et.start();
}
history.push(b.getState());

function onNumber(value) {
  if (!inHintMode && b.getSelectedNumber() !== value) {
    selectNumber(value);
    const valuesWith = b.getCellsWithValues().filter((c) => c.value === value);
    if (valuesWith.length > 0) {
      const c = rndArray(valuesWith);
      lastPos = [...c.position];
      b.setSelectedPosition(lastPos);
    }
    b.draw();
    return;
  }

  const c = b.getCell(lastPos);
  if (c.readOnly) {
    return;
  }
  if (inHintMode) {
    c.toggleHint(value);
  } else {
    const oldValue = c.value;
    c.toggleValue(value);
    const relatedCells = b.getRelatedCells(lastPos);
    if (oldValue) {
      relatedCells.forEach((c2) => {
        // not to set hints on unvisited cells
        if (c2.hints.length === 0) {
          return;
        }
        const valids = b.getValidValues(c2.position);
        if (valids.indexOf(oldValue) !== -1) {
          // helps a bit...
          c2.setHint(oldValue, true);
        }
      });
    }
    if (c.value) {
      relatedCells.forEach((c2) => c2.unsetHint(value, true));
      if (b.checkDone()) {
        et.stop();
        b.setSelectedNumber(undefined);
        window.alert('done!');
      }
    }
  }

  history.push(b.getState());

  updateCounters();
  b.draw();
}

function updateCounters() {
  const selNum = b.getSelectedNumber();

  const hist = b.getValueHistogram();
  b.unsetInvalidCells();
  for (let n = 1; n <= 9; ++n) {
    const number = numbers.get(n);
    number.setCount(Math.max(9 - (hist[n] || 0), 0));
    number.el.classList[n === selNum ? 'add' : 'remove']('selected');
  }
}

function actionCheck() {
  const isValid = b.check((msg) => console.log(msg));
  b.draw();
  const act = actions.get('Check');
  const cls = isValid ? 'ok' : 'nok';
  act.toggle(cls);

  setTimeout(() => {
    b.unsetInvalidCells();
    b.draw();
    act.toggle(cls);
  }, 2500);

  return isValid;
}

function actionHints() {
  b.fillHints();
  b.draw();
}

function actionToggleTheme() {
  document.body.classList.toggle('dark');
  b.toggleTheme();
  b.draw();
}

function actionLoad() {
  try {
    const dt = storage.getItem('time') | 0;
    if (dt > et.dt) {
      et.reset(dt);
    }
    const st = storage.getItem('state');

    b.setState(st);
    history = [st];

    updateCounters();
    b.draw();
  } catch {}
}

function actionSave() {
  storage.setItem('time', et.dt);
  storage.setItem('state', b.getState());
}

function actionUndo() {
  if (history.length < 2) {
    return;
  }
  history.pop();
  b.setState(history[history.length - 1]);

  updateCounters();
  unselectNumber();
  b.draw();
}

function actionToggleMode() {
  actions.get('mode').toggle();
  inHintMode = !inHintMode;
}

function actionTogglePause() {
  actions.get('Pause').toggle();
  isPaused = !isPaused;
  document.body.classList.toggle('paused');
  if (isPaused) {
    et.stop();
  } else {
    et.start();
  }
}

function actionBegin() {
  b.setValuesReadOnly();
  b.draw();
  et.reset(0);
  et.start();
  if (!isPaused) {
    actions.get('Pause').toggle();
  }
}

function actionNew() {
  b.clear();
  updateCounters();
  b.draw();
}

function onAction(action) {
  if (action === 'mode') {
    actionToggleMode();
  } else if (action === 'Pause') {
    actionTogglePause();
  } else if (action === 'Undo') {
    actionUndo();
  } else if (action === 'New') {
    actionNew();
  } else if (action === 'Begin') {
    actionBegin();
  } else if (action === 'Theme') {
    actionToggleTheme();
  } else if (action === 'Load') {
    actionLoad();
  } else if (action === 'Save') {
    actionSave();
  } else if (action === 'Hints') {
    actionHints();
  } else if (action === 'Check') {
    actionCheck();
  }
}

window.addEventListener('beforeunload', () => {
  actionSave();
});

document.body.addEventListener('keydown', (ev) => {
  /*console.log({
    code: ev.code,
    ctrl: ev.ctrlKey,
    alt: ev.altKey,
    shift: ev.shiftKey,
  });*/
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
    case 'Backspace':
      unselectNumber();
      break;
    case 'Space':
      actionToggleMode();
      break;
    case 'KeyP':
      actionTogglePause();
      break;
    case 'KeyU':
      actionUndo();
      break;
    case 'KeyN':
      actionNew();
      break;
    case 'KeyB':
      actionBegin();
      break;
    case 'KeyL':
      actionLoad();
      break;
    case 'KeyS':
      actionSave();
      break;
    case 'KeyH':
      actionHints();
      break;
    case 'KeyC':
      actionCheck();
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
      if (isPaused) {
        break;
      }
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

function selectNumber(value) {
  b.setSelectedNumber(value);
  updateCounters();
  b.draw();
}

function unselectNumber() {
  if (!b.hasSelectedNumber()) {
    return;
  }
  b.setSelectedNumber(undefined);
  updateCounters();
  b.draw();
}

document.addEventListener('click', (ev) => {
  if (ev.target !== document.body.parentNode) {
    return;
  }
  ev.preventDefault();
  ev.stopPropagation();
  unselectNumber();
});

scaleUI();
window.addEventListener('resize', scaleUI);

updateCounters();
b.setSelectedPosition(lastPos);
b.draw();

window.b = b; // TODO temp
