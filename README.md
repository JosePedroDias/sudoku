# Sudoku

## Motivation


## References 

- [canvas cheat sheet](https://simon.html5.org/dump/html5-canvas-cheat-sheet.html)

## Dev

    brew install mkcert
    mkcert -install
    mkcert localhost
    npm i -g --only=prod https-localhost

    npx https-localhost (prefix with sudo if in linux)
    visit: https://localhost/

## TODO

- clearing a cell should set hints back?
- changing a cell value should set old hints back and remove new
- validate undo
- pause
- resolution independent
- register whether hints were asked and check too
- high score?
