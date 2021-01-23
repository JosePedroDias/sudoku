import { storageFactory } from './storage.mjs';
import { ElapsedTime } from './elapsed-time.mjs';
import { Board } from './board.mjs';
import { generateNumbers } from './numbers.mjs';
import { generateActions } from './actions.mjs';

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

let b,
  lastPos = [5, 5],
  history = [],
  inHintMode = false,
  isPaused = false;

function onClickCell(pos) {
  const c = b.getCell(pos);

  b.setSelectedPosition(pos);
  if (c.value) {
    b.setSelectedNumber(c.value);
  }
  b.draw();

  lastPos = pos;
}

const boardFromHash = location.hash && location.hash.substring(1);

let gcdIdx = 0;
const getCellData =
  boardFromHash &&
  function (pos) {
    const v = parseInt(boardFromHash[gcdIdx++], 10) || undefined;
    if (pos[0] === 9 && pos[1] === 9) {
      gcdIdx = 0;
    }
    return { value: v, hints: [] };
  };

b = new Board({
  parentEl: document.querySelector('.board'),
  boardWidth: 700,
  onClickCell,
  getCellData,
});

if (!boardFromHash) {
  actionLoad();
  et.start();
}
history.push(b.getState());

function onNumber(value) {
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
        b.setSelectedNumber(-1);
        window.alert('done!');
      } else {
        b.setSelectedNumber(c.value);
      }
    }
  }

  history.push(b.getState());

  updateCounters();
  updateHash();
  b.draw();
}

function updateCounters() {
  const hist = b.getValueHistogram();
  for (let n = 1; n <= 9; ++n) {
    numbers.get(n).setCount(9 - (hist[n] || 0));
  }
}

function updateHash() {
  location.hash = b.getState81();
}

function actionCheck() {
  const isValid = b.check((msg) => console.log(msg));
  b.draw();
  const act = actions.get('Check');
  act.setLabel('Check *');
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
  actions.get('Hints').setLabel('Hints *');
  b.fillHints();
  b.draw();
}

function actionLoad() {
  const dt = storage.getItem('time');
  if (dt > et.dt) {
    et.reset(dt);
  }
  const st = storage.getItem('state');
  history = [st];
  b.setState(st);

  updateCounters();
  updateHash();
  b.draw();
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
  updateHash();
  b.draw();
}

function actionToggleMode() {
  actions.get('value/hint').toggle();
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
}

function actionNew() {
  b.clear();
  updateCounters();
  updateHash();
  b.draw();
}

function onAction(action) {
  if (action === 'value/hint') {
    actionToggleMode();
  } else if (action === 'Pause') {
    actionTogglePause();
  } else if (action === 'Undo') {
    actionUndo();
  } else if (action === 'New') {
    actionNew();
  } else if (action === 'Begin') {
    actionBegin();
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
  // console.log({ code:ev.code, ctrl: ev.ctrlKey, alt: ev.altKey, shift: ev.shiftKey });
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

scaleUI();
window.addEventListener('resize', scaleUI);

updateCounters();
b.setSelectedPosition(lastPos);
b.draw();

window.b = b; // TODO temp
