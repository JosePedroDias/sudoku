import { Board } from './board.mjs';
import { rndInt } from './utils.mjs';

const containerEl = document.querySelector('.main');

const boardWidth = 720;

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

b = new Board(containerEl, boardWidth, { getCellData, onClick });
window.b = b; // TODO temp
