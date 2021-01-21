import { Board } from './board.mjs';

function numHints(c) { return c.hints.length; }

function candidatesToFill(b) {
    const unfilledCells = b.getAllCells().filter(c => !c.value);
    unfilledCells.sort((a, b)=> numHints(a) - numHints(b));
    return unfilledCells.map(c => [c.position, [...c.hints]])
}

function solve(state81) {
    const b = new Board();
    b.setState81(state81);

    const history = []; // array of [state, candidates]

    function generateHistoryStep() {
        b.fillHints();
        let cands = candidatesToFill(b);
        const step = [b.getState(), cands];
        history.push(step);
        return step;
    }

    let lastHist = generateHistoryStep();

    function backtrack() {
        const [state, cands] = lastHist;
        if (cands.length === 0) {
            console.log('stepping back!');
            history.pop();
            lastHist = history[history.length-1];
            return backtrack();
        }
        b.setState(state);
        return cands;
    }

    function fillCandidate() {
        const cands = lastHist[1];

        if (cands.length > 0) {
            const [pos, hints] = cands.shift();
            const value = hints.shift();
            if (!value) {
                cands.shift();
                return fillCandidate();
            } else {
                console.log(`\n ${history.length} filling ${pos} with ${value}, leaving ${hints}...`);
                b.getCell(pos).setValue(value);
            }
        } else {
            backtrack();
            return fillCandidate();
        }
    }

    for (;;) {
        if (b.checkDone()) {
            console.log('all done!');
            console.log(b.getStateAscii());
            process.exit(0);
        }
        else if (!b.check()) {
            backtrack();
            continue;
        }

        lastHist = generateHistoryStep();
        // console.log(b.getStateAscii());

        fillCandidate();
    }
}

//solve('500420800403070010010060000020734006000205000100698040000080020060040905008057001');
solve('260083000107020408000040000000250010645000932010096000000030000703060501000570084');
