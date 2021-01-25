const iconClasses = [
  'pen',
  'pause',
  'undo',
  'trash',
  'stopwatch',
  'paint',
  'load',
  'save',
  'magic',
  'check',
];

export class SAction {
  constructor(containerEl, value, idx) {
    this.idx = idx;

    this.iconEl = document.createElement('span');
    this.iconEl.classList.add(`icon-${iconClasses[idx]}`);

    this.el = document.createElement('div');
    this.el.setAttribute('data-value', value);
    this.el.classList.add('action');
    this.el.innerHTML = value;

    this.el.appendChild(this.iconEl);
    containerEl.appendChild(this.el);

    this.value = value;
  }

  toggle(className) {
    this.el.classList.toggle(className || 'alt');
    if (this.idx === 0) {
      this.iconEl.classList.toggle('icon-pen');
      this.iconEl.classList.toggle('icon-pencil');
    } else if (this.idx === 1) {
      this.iconEl.classList.toggle('icon-pause');
      this.iconEl.classList.toggle('icon-play');
    }
  }
}

export function generateActions(containerEl, onAction) {
  const actions = new Map();

  const actionNames = [
    'mode',
    'Pause',
    'Undo',
    'New',
    'Begin',
    'Theme',
    'Load',
    'Save',
    'Hints',
    'Check',
  ];

  actionNames.forEach((actionName, idx) => {
    actions.set(actionName, new SAction(containerEl, actionName, idx));
  });

  containerEl.addEventListener('click', (ev) => {
    let el = ev.target;
    while (!el.classList.contains('action')) {
      el = el.parentElement;
      if (!el) {
        return;
      }
    }
    ev.stopPropagation();
    ev.preventDefault();
    const value = el.getAttribute('data-value');
    onAction(value);
  });

  return actions;
}
