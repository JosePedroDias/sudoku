function booleanProp(initialValue) {
  const inputEl = document.createElement('input');
  inputEl.setAttribute('type', 'checkbox');
  if (initialValue) {
    inputEl.setAttribute('checked', '');
  }

  return {
    el: inputEl,
    getter: () => inputEl.checked,
  };
}

function propButton(settingsEl, label, onClick) {
  const pEl = document.createElement('p');
  const el = document.createElement('button');
  el.appendChild(document.createTextNode(label));
  el.addEventListener('click', onClick);
  pEl.appendChild(el);
  settingsEl.appendChild(pEl);
}

function propRow(row, settingsEl, config) {
  const pEl = document.createElement('p');
  const labelEl = document.createElement('label');
  labelEl.appendChild(document.createTextNode(row.label));
  const { el, getter } = booleanProp(config[row.name]);
  pEl.appendChild(labelEl);
  pEl.appendChild(el);
  row.getter = getter;
  pEl.appendChild(el);
  settingsEl.appendChild(pEl);
  row.getter = getter;
}

const rowData = [
  { label: 'colored numbers', name: 'coloredNumbers' },
  { label: 'show related', name: 'showRelated' },
  { label: 'highlight number', name: 'highlightNumber' },
  { label: 'update candidates', name: 'updateCandidates' },
];

export function generateSettings(config, allDoneFn) {
  const settingsEl = document.querySelector('div.settings');
  settingsEl.innerHTML = '';
  document.body.classList.toggle('settings');

  for (let row of rowData) {
    propRow(row, settingsEl, config);
  }

  function updateConfigData() {
    for (let row of rowData) {
      config[row.name] = row.getter();
    }
  }

  propButton(settingsEl, 'change', () => {
    updateConfigData();
    document.body.classList.toggle('settings');
    settingsEl.innerHTML = '';
    allDoneFn(config);
  });
}
