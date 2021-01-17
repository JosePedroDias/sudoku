# Sudoku

## Motivation

A sudoku browser game in recent JS, drawn in canvas. Hopefully mobile friendly.  
The UX is somewhat inspired in Sudoku, the Clean One (for Android).

## References 

- [canvas cheat sheet](https://simon.html5.org/dump/html5-canvas-cheat-sheet.html)
- [sudopedia](http://sudopedia.enjoysudoku.com/)

## Local HTTPS Dev

    brew install mkcert
    mkcert -install
    mkcert localhost
    npm i -g --only=prod https-localhost

    npx https-localhost (prefix with sudo if in linux)
    visit: https://localhost/

## Remote HTTPS Dev
    npm i -g --only=prod localtunnel
    npm i -g --only=prod http-server

    http-server &
    lt --port 8080 --subdomain sdku

## TODO

- validate undos are being well captured
- resolution independent / mobile tests
- register whether hints were asked and check too
- high score?
