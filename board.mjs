import { repeated, withoutRepeats, repeat } from './utils.mjs';
import { themes } from './theme.mjs';

const PI2 = 2 * Math.PI;

//const FONT = 'sans-serif';
const FONT = 'quicksand';

export const VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const ASCII1 = '.-----.-----.-----.';
const ASCII2 = ':----- ----- -----:';
const ASCII3 = "'-----'-----'-----'";

function setBold(str, on) {
  return `${on ? 'bold ' : ''}${str}`;
}

export function hashPos(pos) {
  return pos.join(',');
}

export function hasValidValue(value) {
  return value >= 1 && value <= 9;
}

export function hasValidPos(pos) {
  return hasValidValue(pos[0]) && hasValidValue(pos[1]);
}

export function posEqual(p, P) {
  return p[0] === P[0] && p[1] === P[1];
}

export function getAllPositions() {
  const res = [];
  for (let y = 1; y <= 9; ++y) {
    for (let x = 1; x <= 9; ++x) {
      res.push([x, y]);
    }
  }
  return res;
}

export function getRowPositions(n) {
  const res = [];
  for (let i = 1; i <= 9; ++i) {
    res.push([i, n]);
  }
  return res;
}

export function getColPositions(n) {
  const res = [];
  for (let i = 1; i <= 9; ++i) {
    res.push([n, i]);
  }
  return res;
}

const boxStarts = {
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

export function getBoxPositions(n) {
  const [tx, ty] = boxStarts[n];
  const res = [];
  for (let j = 0; j < 3; ++j) {
    for (let i = 0; i < 3; ++i) {
      res.push([tx + i, ty + j]);
    }
  }
  return res;
}

export function getBoxNr(pos) {
  const [x, y] = pos;
  const xc = x < 4 ? 1 : x < 7 ? 2 : 3;
  const yc = y < 4 ? 1 : y < 7 ? 2 : 3;
  return 1 + xc - 1 + (yc - 1) * 3;
}

export function checkSequence(cells, kind, logFn) {
  const filledCells = cells.filter((c) => c.value);
  const filledValues = filledCells.map((c) => c.value);
  const repeatedIndices = repeated(filledValues);
  if (repeatedIndices) {
    const c1 = filledCells[repeatedIndices[0]];
    const c2 = filledCells[repeatedIndices[1]];
    c1.setInvalid();
    c2.setInvalid();
    logFn &&
      logFn(
        `repeated number in ${kind}: cells ${c1.position} and ${c2.position}`
      );
  }
  return !repeatedIndices;
}

export class Board {
  constructor({
    parentEl,
    boardWidth,
    inDarkMode,
    getCellData,
    onClickCell,
  } = {}) {
    this.boardWidth = boardWidth;
    this.cellWidth = boardWidth && Math.floor(boardWidth / 9);
    this.inDarkMode = inDarkMode;
    this.theme = inDarkMode ? themes.dark : themes.light;

    this.cells = new Map();
    for (let pos of getAllPositions()) {
      const data = getCellData
        ? getCellData(pos)
        : { value: undefined, hints: [] };
      this.cells.set(
        hashPos(pos),
        new Cell(pos, this.cellWidth, data.value, data.hints)
      );
    }

    if (boardWidth) {
      this.canvas = document.createElement('canvas');
      this.canvas.setAttribute('width', boardWidth);
      this.canvas.setAttribute('height', boardWidth);
      parentEl.appendChild(this.canvas);
      this.ctx = this.canvas.getContext('2d');
      this.selectedPosition = [-1, -1];

      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';

      this.draw();

      onClickCell &&
        this.canvas.addEventListener('click', (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          const g = parentEl.getBoundingClientRect();
          const cw = g.width / 9;
          const x0 = ev.clientX - g.x;
          const y0 = ev.clientY - g.y;
          const pos = [Math.floor(x0 / cw) + 1, Math.floor(y0 / cw) + 1];
          onClickCell(pos);
        });
    }
  }

  toggleTheme() {
    this.inDarkMode = !this.inDarkMode;
    this.theme = this.inDarkMode ? themes.dark : themes.light;
  }

  draw() {
    const c = this.ctx;
    const cw = this.cellWidth;
    const theme = this.theme;

    const relatedPositions = this.hasSelectedPosition()
      ? this.getRelatedCells(this.selectedPosition).map((c) =>
          c.position.join(',')
        )
      : [];

    for (let [cx, cy] of getAllPositions()) {
      const pos = `${cx},${cy}`;
      --cx;
      --cy;
      const isAltCell = (cx + cy) % 2 === 1;
      const isRelated = relatedPositions.indexOf(pos) !== -1;
      c.fillStyle =
        theme[`bgBoard${isAltCell ? '2' : ''}${isRelated ? 'b' : ''}`];
      c.fillRect(
        cx * this.cellWidth,
        cy * this.cellWidth,
        this.cellWidth,
        this.cellWidth
      );
    }

    c.strokeStyle = theme.grid;
    c.lineWidth = this.boardWidth / 200;
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
      cell.draw(c, this.selectedNumber, isSelectedPos, this.theme);
    }
  }

  hasSelectedPosition() {
    return hasValidPos(this.selectedPosition);
  }

  setSelectedPosition(pos) {
    this.selectedPosition = pos;
  }

  getSelectedNumber() {
    return this.hasSelectedNumber() && this.selectedNumber;
  }

  setSelectedNumber(num) {
    this.selectedNumber = num;
  }

  hasSelectedNumber() {
    return hasValidValue(this.selectedNumber);
  }

  getCell(pos) {
    return this.cells.get(hashPos(pos));
  }

  getAllCells() {
    return getAllPositions().map((pos) => this.getCell(pos));
  }

  getRowCells(n) {
    return getRowPositions(n).map((pos) => this.getCell(pos));
  }

  getColCells(n) {
    return getColPositions(n).map((pos) => this.getCell(pos));
  }

  getBoxCells(n) {
    return getBoxPositions(n).map((pos) => this.getCell(pos));
  }

  getCellsWithValues() {
    return this.getAllCells().filter((c) => c.value);
  }

  getCellsWithoutValues() {
    return this.getAllCells().filter((c) => !c.value);
  }

  getRelatedCells(pos) {
    const ownCell = this.getCell(pos);
    const [x, y] = pos;
    const tn = getBoxNr(pos);
    const cells = [
      ...this.getRowCells(y),
      ...this.getColCells(x),
      ...this.getBoxCells(tn),
    ];
    return withoutRepeats(cells, [ownCell]);
  }

  getValidValues(pos) {
    const ownCell = this.getCell(pos);
    if (ownCell.value) {
      return [];
    }
    const relatedCells = this.getRelatedCells(pos);
    const relatedValues = relatedCells
      .filter((c) => c.value)
      .map((c) => c.value);
    return withoutRepeats(VALUES, relatedValues);
  }

  clear() {
    this.getAllCells().forEach((c) => c.clear());
  }

  setValuesReadOnly() {
    this.getCellsWithValues().forEach((c) => (c.readOnly = true));
  }

  getValueHistogram() {
    const hist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
    for (let c of this.getAllCells()) {
      if (c.value) {
        ++hist[c.value];
      }
    }
    return hist;
  }

  check(logFn) {
    this.unsetInvalidCells();

    let ok = true;
    for (let n = 1; n <= 9; ++n) {
      ok = ok && checkSequence(this.getRowCells(n), `row #${n}`, logFn);
      ok = ok && checkSequence(this.getColCells(n), `col #${n}`, logFn);
      ok = ok && checkSequence(this.getBoxCells(n), `box #${n}`, logFn);
    }

    return ok;
  }

  fillHints() {
    this.getAllCells().forEach((c) => {
      if (!c.hasValue()) {
        c.hints = this.getValidValues(c.position);
      }
    });
  }

  unsetInvalidCells() {
    this.getAllCells().forEach((c) => c.unsetInvalid());
  }

  checkDone() {
    if (!this.check()) {
      return false;
    }
    return this.getCellsWithoutValues().length === 0;
  }

  getState() {
    const state = [];
    for (let pos of getAllPositions()) {
      const { value, readOnly, hints } = this.cells.get(hashPos(pos));
      state.push([value || 0, readOnly, ...hints]);
    }
    return state;
  }

  getState81() {
    const res = [];
    for (let y = 1; y <= 9; ++y) {
      for (let x = 1; x <= 9; ++x) {
        res.push(this.getCell([x, y]).value || 0);
      }
    }
    return res.join('');
  }

  getStateAscii() {
    const lines = [ASCII1];
    for (let y = 1; y <= 9; ++y) {
      const r = [];
      for (let x = 1; x <= 9; ++x) {
        r.push(this.getCell([x, y]).value || '.');
      }
      lines.push(
        `|${r[0]} ${r[1]} ${r[2]}|${r[3]} ${r[4]} ${r[5]}|${r[6]} ${r[7]} ${r[8]}|`
      );
      if (y === 3 || y === 6) {
        lines.push(ASCII2);
      }
    }
    lines.push(ASCII3);
    return lines.join('\n');
  }

  getStateAscii2() {
    const m = Math.max(
      ...this.getAllCells().map((c) => (c.value ? 1 : c.hints.length))
    );
    const n = m * 3 + 2;
    const lines = [`.${repeat('-', n)}.${repeat('-', n)}.${repeat('-', n)}.`];
    const sep = `:${repeat('-', n)}:${repeat('-', n)}:${repeat('-', n)}:`;
    function z(s) {
      return s + repeat(' ', m - s.length);
    }
    for (let y = 1; y <= 9; ++y) {
      const r = [];
      for (let x = 1; x <= 9; ++x) {
        const c = this.getCell([x, y]);
        r.push(c.value ? `${c.value}` : c.hints.join(''));
      }
      lines.push(
        `|${z(r[0])} ${z(r[1])} ${z(r[2])}|${z(r[3])} ${z(r[4])} ${z(r[5])}|${z(
          r[6]
        )} ${z(r[7])} ${z(r[8])}|`
      );
      if (y === 3 || y === 6) {
        lines.push(sep);
      }
    }
    lines.push(`'${repeat('-', n)}'${repeat('-', n)}'${repeat('-', n)}'`);
    return lines.join('\n');
  }

  setState(state) {
    const cellsLeft = [...state];
    for (let pos of getAllPositions()) {
      const [value, readOnly, ...hints] = cellsLeft.shift();
      const c = this.getCell(pos);
      c.value = value || undefined;
      readOnly ? (c.readOnly = true) : delete c.readOnly;
      c.hints = hints;
    }
  }

  setState81(str) {
    let i = 0;
    for (let y = 1; y <= 9; ++y) {
      for (let x = 1; x <= 9; ++x) {
        const value = parseInt(str[i++], 10);
        const c = this.getCell([x, y]);
        c.value = hasValidValue(value) ? value : undefined;
        c.hints = [];
      }
    }
  }
}

class Cell {
  constructor(position, width, value, hints) {
    this.position = position;
    this.value = value;
    this.hints = hints || [];

    if (width) {
      this.width = width;
      const hV = Math.floor(width * 0.8);
      const hH = Math.floor(width * 0.25);
      this.fontV = `${hV}px ${FONT}`;
      this.fontH = `${hH}px ${FONT}`;
    }
  }

  setInvalid() {
    this.isInvalid = true;
  }

  unsetInvalid() {
    delete this.isInvalid;
  }

  clear() {
    this.value = undefined;
    this.hints = [];
    delete this.readOnly;
  }

  hasValue() {
    return this.value >= 1 && this.value <= 9;
  }

  setValue(value) {
    this.value = value;
    if (value) {
      this.hints = [];
    }
  }

  toggleValue(value) {
    const hadValue = this.hasValue();
    const hadSameValue = hadValue && value === this.value;
    this.value = hadSameValue ? undefined : value;
    if (hadSameValue) {
      this.hints = [];
    }
    return !hadValue;
  }

  hasHint(hint) {
    return this.hints.indexOf(hint) !== -1;
  }

  setHint(hint, keepValue) {
    if (this.value && !keepValue) {
      this.value = undefined;
    }
    const idx = this.hints.indexOf(hint);
    if (idx === -1) {
      this.hints.push(hint);
      this.hints.sort();
    }
  }

  unsetHint(hint, keepValue) {
    if (this.value && !keepValue) {
      this.value = undefined;
    }
    const idx = this.hints.indexOf(hint);
    if (idx !== -1) {
      this.hints.splice(idx, 1);
      if (this.value === hint) {
        this.value = undefined;
      }
    }
  }

  toggleHint(hint, keepValue) {
    if (this.hasHint(hint)) {
      this.unsetHint(hint, keepValue);
    } else {
      this.setHint(hint, keepValue);
    }
  }

  draw(ctx, selectedNumber, hasSelectedPos, theme) {
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

    const isFilled = this.isInvalid || hasSelectedNumber;
    const isSelected = hasSelectedPos;
    const isReadOnly = this.readOnly;

    // draw filled circle bg
    if (isFilled) {
      ctx.fillStyle = this.isInvalid ? theme.bgInvalid : theme.bgSelectedNumber;
      ctx.beginPath();
      ctx.arc(x0 + w * 0.5, y0 + w * 0.5, w * 0.46, 0, PI2);
      ctx.fill();
    }

    // draw circle stroke overlay
    if (isSelected) {
      ctx.strokeStyle = theme.selectedPosition;
      ctx.beginPath();
      ctx.arc(x0 + w * 0.5, y0 + w * 0.5, w * 0.47, 0, PI2);
      ctx.stroke();
    }

    // draw value/hints text
    ctx.fillStyle = isFilled
      ? theme.numberSelected
      : theme[`number${this.value}`];

    if (this.value) {
      ctx.font = setBold(this.fontV, isReadOnly);
      ctx.fillText(this.value, x0 + w * 0.5, y0 + w * 0.53);
    } else {
      ctx.font = setBold(this.fontH, true);
      for (let hint of this.hints) {
        const y = Math.floor((hint - 1) / 3);
        const x = (hint - 1) % 3;
        ctx.fillStyle = isFilled
          ? theme.numberSelected
          : theme[`number${hint}`];
        ctx.fillText(
          hint,
          x0 + w * (0.25 + x * 0.25),
          y0 + w * (0.27 + y * 0.25)
        );
      }
    }
  }
}
