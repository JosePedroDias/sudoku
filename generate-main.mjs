import { generate } from './generate.mjs';
import { Board } from './board.mjs';

const s = generate();

const boardEl = document.querySelector('.board');
const b = new Board({
  parentEl: boardEl,
  boardWidth: 600,
});
boardEl.style.paddingTop = '100px';

b.setState81(s);
b.draw();

window.b = b; // TODO temp
