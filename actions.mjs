export class SAction {
  constructor(containerEl, value, idx) {
    this.el = document.createElement('div');
    this.el.setAttribute('data-value', value);
    this.el.classList.add('action');
    this.el.classList.add(`action-${idx}`);
    this.el.innerHTML = value;
    containerEl.appendChild(this.el);

    this.value = value;
  }

  toggle(className) {
    this.el.classList.toggle(className || 'alt');
  }

  setLabel(text) {
    //this.el.firstChild.textNode.nodeValue = text;
    this.el.innerHTML = text;
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

  actionNames.forEach((actionName, idx) => {
    actions.set(actionName, new SAction(containerEl, actionName, idx));
  });

  actions.get('value/hint').setLabel('');

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
