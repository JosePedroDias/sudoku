export class SAction {
  constructor(containerEl, value) {
    this.el = document.createElement('div');
    this.el.setAttribute('data-value', value);
    this.el.className = 'action';
    this.el.innerHTML = value;
    containerEl.appendChild(this.el);

    this.value = value;
  }

  toggle() {
    this.el.classList.toggle('alt');
  }
}

export function generateActions(containerEl, onAction) {
  const actions = new Map();

  const actionNames = [
    'value/hint',
    'Pause',
    'Undo',
    'Load',
    'Save',
    'Hints',
    'Check',
  ];

  for (let actionName of actionNames) {
    actions.set(actionName, new SAction(containerEl, actionName));
  }

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
