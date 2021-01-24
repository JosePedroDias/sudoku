import { Board, VALUES } from './board.mjs';
import { rndInt } from './utils.mjs';

function getUniqueValues(cells) {
  return withoutRepeats(cells.map((c) => c.value).filter((c) => !!c));
}

function getHints(cells) {
  return cells.map((c) => !!c.value);
}

function withUniqueTwo(hintsArr) {
  const foundStrings = {};
  const foundHintsOfTwo = [];
  const foundHintsOfMore = [];

  hintsArr.forEach((hints) => {
    const hintsS = hints.join('');
    if (foundStrings[hintsS]) {
      return;
    } else if (hints.length > 2) {
      foundStrings[hintsS] = true;
      foundHintsOfMore.push([...hints]);
      return;
    } else if (hints.length < 2) {
      return;
    }
    foundStrings[hintsS] = true;
    foundHintsOfTwo.push([...hints]);
  });

  foundHintsOfTwo.forEach((hints) => {
    foundHintsOfMore.forEach((hints2) => {});
  });

  return foundHintsOfTwo;
}

function valueLacking(values) {
  return withoutRepeats(VALUES, values);
}

const kinds = ['row', 'col', 'box'];

const methodNameMap = {
  row: 'getRowCells',
  col: 'getColCells',
  box: 'getBoxCells',
};

export function getNakedSingles(b) {
  for (let i = 1; i <= 9; ++i) {
    for (let k of kinds) {
      const cells = b[methodNameMap[k]](i);
      const uniqueValues = getUniqueValues(cells);
      if (uniqueValues.length === 8) {
        return `${k} #${i} has naked single ${valueLacking(uniqueValues)}`;
      }
    }
  }
}

// naked single ~ check neighbours (row, col, box) for every number present but x. if so, it's a naked single (no hints required)
export function isSingle(c) {
  return !c.value && c.hints.length === 1;
}

export function getSingles(b) {
  return b.getAllCells().filter(isSingle);
}

// if 2 candidates
export function getNakedPairs(b) {
  for (let i = 1; i <= 9; ++i) {
    for (let k of kinds) {
      const cells = b[methodNameMap[k]](i);
      const hints = getHints(b[mn](i));
      if (uniqueValues.length === 8) {
        return `${k} #${i} has naked single ${valueLacking(uniqueValues)}`;
      }
    }
  }
}
