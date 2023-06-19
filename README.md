# Sudoku

## Motivation

A sudoku browser game in recent JS, drawn in canvas. Hopefully mobile friendly.
The UX is somewhat inspired in [Sudoku, the Clean One](https://play.google.com/store/apps/details?id=ee.dustland.android.dustlandsudoku).

## References

- JS
  - [canvas cheat sheet](https://simon.html5.org/dump/html5-canvas-cheat-sheet.html)
  - [dark mode](https://flaviocopes.com/javascript-detect-dark-mode/)
- sudoku
  - [sudopedia](http://sudopedia.enjoysudoku.com/)
  - [sudoju wiki](https://www.sudokuwiki.org/sudoku.htm)
- tap
  - [CLI](https://node-tap.org/docs/cli/)
  - [writing well structured tests](https://node-tap.org/docs/structure/)
  - [API/asserts](https://node-tap.org/docs/api/asserts/)
- fonts

  - [icomoon app](https://icomoon.io/app/)
  - [quicksand](https://www.fontsquirrel.com/fonts/quicksand)
  - [convertio](https://convertio.co/otf-woff/)

## Vocabulary in source code

- hint ~ candidate

## Local HTTPS Dev

    brew install mkcert
    mkcert -install
    mkcert localhost
    npm i -g --only=prod https-localhost

    npx https-localhost (prefix with sudo if in linux)
    visit: https://localhost/ https://localhost/generate.html

## Remote HTTPS Dev

    npm i -g --only=prod localtunnel
    npm i -g --only=prod http-server

    http-server &
    lt --port 8080 --subdomain sdku

## TODO (eventually)

- playing game
  - ask for suggestion as a toast
- solving
  - [ ] implement solving algorithms
  - [ ] classify difficulty based on histogram and number/frequency of moves to solve
- generating boards
  - [x] generate full sudoku
  - [ ] apply template checking unique solution
