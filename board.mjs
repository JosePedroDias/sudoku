import { rndInt } from './utils.mjs';

const PI2 = 2 * Math.PI;

const FONT = 'sans-serif';

const GRID_COLOR = '#696';
const BG_COLOR = '#FFF';
const BG_SELECTED_COLOR = '#669';
const NUMBER_COLOR = '#000';
const NUMBER_SELECTED_COLOR = '#FFF';

function hashPos(pos) {
  return pos.join(',');
}

export class Board {
  constructor(parentEl, boardWidth, { getCellData, onClick }) {
    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('width', boardWidth);
    this.canvas.setAttribute('height', boardWidth);
    parentEl.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.boardWidth = boardWidth;
    this.cellWidth = Math.floor(boardWidth / 9);

    this.cells = new Map();
    for (let y = 0; y < 9; ++y) {
      for (let x = 0; x < 9; ++x) {
        const pos = [x, y];
        const data = getCellData
          ? getCellData(pos)
          : { value: undefined, hints: [] };
        this.cells.set(
          hashPos(pos),
          new Cell(pos, this.cellWidth, data.value, data.hints)
        );
      }
    }

    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    this.draw();

    this.canvas.addEventListener('click', (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      const g = this.canvas.getBoundingClientRect();
      const x = Math.floor((ev.clientX - g.x) / this.cellWidth);
      const y = Math.floor((ev.clientY - g.y) / this.cellWidth);
      const pos = [x, y];
      onClick(pos);
    });
  }

  draw(selectedNumber) {
    const c = this.ctx;
    const cw = this.cellWidth;

    c.fillStyle = BG_COLOR;
    c.fillRect(0, 0, this.boardWidth, this.boardWidth);

    c.strokeStyle = GRID_COLOR;
    c.lineWidth = this.boardWidth / 400;
    const g = 0.1;
    c.moveTo(cw * (0 + g), cw * 3);
    c.lineTo(cw * (9 - g), cw * 3);
    c.moveTo(cw * (0 + g), cw * 6);
    c.lineTo(cw * (9 - g), cw * 6);
    c.moveTo(cw * 3, cw * (0 + g));
    c.lineTo(cw * 3, cw * (9 - g));
    c.moveTo(cw * 6, cw * (0 + g));
    c.lineTo(cw * 6, cw * (9 - g));
    c.stroke();

    for (let cell of this.cells.values()) {
      cell.draw(c, selectedNumber);
    }
  }

  getCell(pos) {
    return this.cells.get(hashPos(pos));
  }

  getState() {
    const state = new Map();
    for (let key of this.cells.keys()) {
      const { value, hints } = this.cells.get(key);
      state.set(key, { value, hints });
    }
    return state;
  }

  setState(state) {
    for (let key of state.keys()) {
      const c = this.cells.get(key);
      const stateC = state.get(key);
      c.value = stateC.value;
      c.hints = stateC.hints;
    }
  }
}

class Cell {
  constructor(position, width, value, hints) {
    this.position = position;
    this.value = value;
    this.hints = hints || [];

    this.width = width;
    const hV = Math.floor(width * 0.8);
    const hH = Math.floor(width * 0.25);
    this.fontV = `${hV}px ${FONT}`;
    this.fontH = `${hH}px ${FONT}`;
  }

  clear(hintsToo) {
    this.value = undefined;
    if (hintsToo) {
      this.hints = [];
    }
  }

  setValue(value) {
    this.value = value;
  }

  toggleHint(hint) {
    const idx = this.hints.indexOf(hint);
    if (idx === -1) {
      this.hints.push(hint);
      this.hints.sort();
    } else {
      this.hints.splice(idx, 1);
    }
  }

  draw(ctx, selectedNumber) {
    const w = this.width;
    const x0 = w * this.position[0];
    const y0 = w * this.position[1];

    const isSelected = false; //rndInt(2) === 0;

    if (isSelected) {
      ctx.fillStyle = BG_SELECTED_COLOR;
      ctx.beginPath();
      ctx.arc(x0 + w * 0.5, y0 + w * 0.5, w * 0.46, 0, PI2);
      ctx.fill();
    }

    ctx.fillStyle = isSelected ? NUMBER_SELECTED_COLOR : NUMBER_COLOR;

    if (this.value) {
      ctx.font = this.fontV;
      ctx.fillText(this.value, x0 + w * 0.5, y0 + w * 0.57);
    } else {
      ctx.font = this.fontH;
      for (let hint of this.hints) {
        const y = Math.floor((hint - 1) / 3);
        const x = (hint - 1) % 3;
        ctx.fillText(
          hint,
          x0 + w * (0.25 + x * 0.25),
          y0 + w * (0.27 + y * 0.25)
        );
      }
    }
  }
}
