const light = {
  grid: '#888',
  bgBoard: '#FFF',
  bgBoard2: '#F1F1F1',
  bgBoardb: '#FDD',
  bgBoard2b: '#F1D1D1',
  bgInvalid: 'hsl(0, 70%, 30%)',
  bgSelectedNumber: '#888',
  selectedPosition: '#444',
  number1: 'hsl(36, 70%, 30%)',
  number2: 'hsl(72, 70%, 30%)',
  number3: 'hsl(108, 70%, 30%)',
  number4: 'hsl(144, 70%, 30%)',
  number5: 'hsl(180, 70%, 30%)',
  number6: 'hsl(216, 70%, 30%)',
  number7: 'hsl(252, 70%, 30%)',
  number8: 'hsl(288, 70%, 30%)',
  number9: 'hsl(324, 70%, 30%)',
  numberSelected: '#FFF',
};

const dark = {
  grid: '#666',
  bgBoard: '#000',
  bgBoard2: '#0E0E0E',
  bgBoardb: '#200',
  bgBoard2b: '#2E0E0E',
  bgInvalid: 'hsl(0, 70%, 70%)',
  bgSelectedNumber: '#666',
  selectedPosition: '#AAA',
  number1: 'hsl(36, 70%, 70%)',
  number2: 'hsl(72, 70%, 70%)',
  number3: 'hsl(108, 70%, 70%)',
  number4: 'hsl(144, 70%, 70%)',
  number5: 'hsl(180, 70%, 70%)',
  number6: 'hsl(216, 70%, 70%)',
  number7: 'hsl(252, 70%, 70%)',
  number8: 'hsl(288, 70%, 70%)',
  number9: 'hsl(324, 70%, 70%)',
  numberSelected: '#000',
};

function cloneTheme(theme, numberColor) {
  return {
    ...theme,
    number1: numberColor,
    number2: numberColor,
    number3: numberColor,
    number4: numberColor,
    number5: numberColor,
    number6: numberColor,
    number7: numberColor,
    number8: numberColor,
    number9: numberColor,
  };
}

const lightMono = cloneTheme(light, 'hsl(36, 0%, 30%)');
const darkMono = cloneTheme(dark, 'hsl(36, 0%, 70%)');

export const themes = {
  light,
  dark,
  lightMono,
  darkMono,
};
