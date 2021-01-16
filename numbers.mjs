export class SNumber {
  constructor(containerEl, value, count) {
    this.value = value;
    this.count = count;

    const valueEl = document.createElement('div');
    valueEl.innerHTML = value;
    valueEl.className = 'number-value';

    const countEl = document.createElement('div');
    countEl.innerHTML = count;
    countEl.className = 'number-count';
    this.countEl = countEl;

    this.el = document.createElement('div');
    this.el.setAttribute('data-value', value);
    this.el.className = 'number';
    this.el.appendChild(valueEl);
    this.el.appendChild(countEl);
    containerEl.appendChild(this.el);

    this.value = value;
    this.count = count;
  }

  setCount(val) {
    this.count = val;
    this.countEl.innerHTML = val;
  }
}

export function generateNumbers(containerEl, onNumber) {
  const numbers = new Map();

  const rowEls = containerEl.querySelectorAll('.numbers-row');
  for (let n = 0; n < 9; ++n) {
    const rowNr = Math.floor(n / 3);
    const sn = new SNumber(rowEls[rowNr], n + 1, 0);
    numbers.set(n + 1, sn);
  }

  containerEl.addEventListener('click', (ev) => {
    let el = ev.target;
    while (el.className !== 'number') {
      el = el.parentElement;
      if (!el) {
        return;
      }
    }
    const value = parseInt(el.getAttribute('data-value'), 10);
    onNumber(value);
  });

  return numbers;
}
