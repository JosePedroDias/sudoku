const PI2 = 2 * Math.PI;

const FONT = 'sans-serif';

const GRID_COLOR = '#696';
const BG_COLOR = '#FFF';
const BG_SELECTED_COLOR = '#669';
const BG_SELECTED_NUMBER_COLOR = '#336';
const BG_INVALID_COLOR = '#966';
const NUMBER_COLOR = '#000';
const NUMBER_SELECTED_COLOR = '#FFF';

export function hashPos(pos) {
  return pos.join(',');
}

export function posEqual(p, P) {
  return p[0] === P[0] && p[1] === P[1];
}

export function getRow(n) {
  const res = [];
  for (let i = 1; i <= 9; ++i) {
    res.push([n, i]);
  }
  return res;
}

export function getCol(n) {
  const res = [];
  for (let i = 1; i <= 9; ++i) {
    res.push([i, n]);
  }
  return res;
}

const tileStarts = {
  1: [1, 1],
  2: [4, 1],
  3: [7, 1],
  4: [1, 4],
  5: [4, 4],
  6: [7, 4],
  7: [1, 7],
  8: [4, 7],
  9: [7, 7],
};

export function getTile(n) {
  const [tx, ty] = tileStarts[n];
  const res = [];
  for (let j = 0; j < 3; ++j) {
    for (let i = 0; i < 3; ++i) {
      res.push([tx + i, ty + j]);
    }
  }
  return res;
}

export class Board {
  constructor(parentEl, boardWidth, { getCellData, onClickCell }) {
    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('width', boardWidth);
    this.canvas.setAttribute('height', boardWidth);
    parentEl.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.boardWidth = boardWidth;
    this.cellWidth = Math.floor(boardWidth / 9);
    this.selectedPosition = [-1, -1];

    this.cells = new Map();
    for (let y = 1; y <= 9; ++y) {
      for (let x = 1; x <= 9; ++x) {
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
      const pos = [x + 1, y + 1];
      onClickCell(pos);
    });
  }

  draw() {
    const c = this.ctx;
    const cw = this.cellWidth;

    c.fillStyle = BG_COLOR;
    c.fillRect(0, 0, this.boardWidth, this.boardWidth);

    c.strokeStyle = GRID_COLOR;
    c.lineWidth = this.boardWidth / 400;
    const g = 0.1;
    c.beginPath();
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
      const isSelectedPos = posEqual(cell.position, this.selectedPosition);
      cell.draw(c, this.selectedNumber, isSelectedPos);
    }
  }

  setSelectedPosition(pos) {
    this.selectedPosition = pos;
  }

  setSelectedNumber(num) {
    this.selectedNumber = num;
  }

  getCell(pos) {
    return this.cells.get(hashPos(pos));
  }

  getAllCells() {
    const res = [];
    for (let c of this.cells.values()) {
      res.push(c);
    }
    return res;
  }

  getRowCells(n) {
    return getRow(n).map((pos) => this.getCell(pos));
  }

  getColCells(n) {
    return getCol(n).map((pos) => this.getCell(pos));
  }

  getTileCells(n) {
    return getTile(n).map((pos) => this.getCell(pos));
  }

  getState() {
    const state = new Map();
    for (let key of this.cells.keys()) {
      const { value, hints } = this.cells.get(key);
      state.set(key, [value, hints]);
    }
    return state;
  }

  setState(state) {
    for (let key of state.keys()) {
      const c = this.cells.get(key);
      const [value, hints] = state.get(key);
      c.value = value;
      c.hints = hints;
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

  setInvalid() {
    this.isInvalid = true;
  }

  clearInvalid() {
    delete this.isInvalid;
  }

  clear(hintsToo) {
    this.clearInvalid();
    this.value = undefined;
    if (hintsToo) {
      this.hints = [];
    }
  }

  setValue(value) {
    this.clearInvalid();
    this.value = value;
  }

  toggleHint(hint) {
    this.clearInvalid();
    this.value = undefined;
    const idx = this.hints.indexOf(hint);
    if (idx === -1) {
      this.hints.push(hint);
      this.hints.sort();
    } else {
      this.hints.splice(idx, 1);
    }
  }

  draw(ctx, selectedNumber, hasSelectedPos) {
    const w = this.width;
    const x0 = w * (this.position[0] - 1);
    const y0 = w * (this.position[1] - 1);

    let hasSelectedNumber = false;
    if (selectedNumber) {
      if (selectedNumber === this.value) {
        hasSelectedNumber = true;
      } else if (!this.value) {
        hasSelectedNumber = this.hints.indexOf(selectedNumber) !== -1;
      }
    }

    const isSelected = this.isInvalid || hasSelectedNumber || hasSelectedPos;

    if (isSelected) {
      ctx.fillStyle = this.isInvalid
        ? BG_INVALID_COLOR
        : hasSelectedPos
        ? BG_SELECTED_COLOR
        : BG_SELECTED_NUMBER_COLOR;
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
