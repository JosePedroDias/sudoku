import { rndInt } from './utils.mjs';
import { ElapsedTime } from './elapsed-time.mjs';
import { Board } from './board.mjs';
import { generateNumbers } from './numbers.mjs';
import { generateActions } from './actions.mjs';

const boardWidth = 720 * 0.8;

function getCellData(pos) {
  const value = rndInt(2) === 0 ? rndInt(9) + 1 : undefined;
  const hints = [];
  for (let n = 1; n <= 9; ++n) {
    if (rndInt(3) === 0) {
      hints.push(n);
    }
  }
  return {
    value,
    hints,
  };
}

let b;

function onClick(pos) {
  const c = b.getCell(pos);

  if (c.value) {
    c.setValue(rndInt(9) + 1);
  } else {
    c.toggleHint(1);
  }

  b.draw();
}

b = new Board(document.querySelector('.board'), boardWidth, {
  getCellData,
  onClick,
});

const et = new ElapsedTime(document.querySelector('.elapsed-time'));
et.start();

let numbers, actions;

function onNumber(number) {
  console.log(number);
  const num = numbers.get(number);
  num.setCount(num.count + 1);
}

function onAction(action) {
  console.log(action);
  if (action === 'hint') {
    actions.get('hint').toggle();
  }
}

numbers = generateNumbers(document.querySelector('.numbers'), onNumber);
actions = generateActions(document.querySelector('.actions'), onAction);

window.b = b; // TODO temp
