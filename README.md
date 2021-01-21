# Sudoku

## Motivation

A sudoku browser game in recent JS, drawn in canvas. Hopefully mobile friendly.  
The UX is somewhat inspired in Sudoku, the Clean One (for Android).

## References 

- sudoku
    - [canvas cheat sheet](https://simon.html5.org/dump/html5-canvas-cheat-sheet.html)
    - [sudopedia](http://sudopedia.enjoysudoku.com/)
- tap
    - [CLI](https://node-tap.org/docs/cli/)
    - [writing well structured tests](https://node-tap.org/docs/structure/)
    - [API/asserts](https://node-tap.org/docs/api/asserts/)

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

- resolution independent / mobile tests

## Unlikely but eventually:
- solving
    - implement solving algorithms
    - classify difficulty based on histogram and number/frequency of moves to solve
    
- generating
    ...