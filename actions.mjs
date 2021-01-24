const iconClasses = [
  'pen',
  'pause',
  'undo',
  'trash',
  'stopwatch',
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
    }
  }

  setLabel(text) {
    //this.el.innerHTML = text;
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
    'Load',
    'Save',
    'Hints',
    'Check',
  ];

  actionNames.forEach((actionName, idx) => {
    actions.set(actionName, new SAction(containerEl, actionName, idx));
  });

  //actions.get('value/hint').setLabel('');

  containerEl.addEventListener('click', (ev) => {
    let el = ev.target;
    while (!el.classList.contains('action')) {
      el = el.parentElement;
      if (!el) {
        return;
      }
    }
    const value = el.getAttribute('data-value');
    onAction(value);
  });

  return actions;
}
