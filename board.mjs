import { rndColor } from './utils.mjs';

const FONT = 'sans-serif';

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
    this.ctx.clearRect(0, 0, this.boardWidth, this.boardWidth);
    for (let cell of this.cells.values()) {
      cell.draw(this.ctx, selectedNumber);
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
    ctx.fillStyle = rndColor();
    ctx.fillRect(x0, y0, w, w);

    if (this.value) {
      ctx.font = this.fontV;
      ctx.fillStyle = rndColor();
      ctx.fillText(this.value, x0 + w * 0.5, y0 + w * 0.57);
    } else {
      ctx.font = this.fontH;
      ctx.fillStyle = rndColor();
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
