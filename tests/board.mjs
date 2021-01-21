import tap from 'tap';

import { record } from '../utils.mjs';
import { Board } from '../board.mjs';


tap.test('getStateAscii', (t) => {
    const b = new Board();

    tap.equal(b.getStateAscii(),
`.-----.-----.-----.
|. . .|. . .|. . .|
|. . .|. . .|. . .|
|. . .|. . .|. . .|
:----- ----- -----:
|. . .|. . .|. . .|
|. . .|. . .|. . .|
|. . .|. . .|. . .|
:----- ----- -----:
|. . .|. . .|. . .|
|. . .|. . .|. . .|
|. . .|. . .|. . .|
'-----'-----'-----'`);

    b.setState81('500420800403070010010060000020734006000205000100698040000080020060040905008057001');
    tap.equal(b.getStateAscii(),
`.-----.-----.-----.
|5 . .|4 2 .|8 . .|
|4 . 3|. 7 .|. 1 .|
|. 1 .|. 6 .|. . .|
:----- ----- -----:
|. 2 .|7 3 4|. . 6|
|. . .|2 . 5|. . .|
|1 . .|6 9 8|. 4 .|
:----- ----- -----:
|. . .|. 8 .|. 2 .|
|. 6 .|. 4 .|9 . 5|
|. . 8|. 5 7|. . 1|
'-----'-----'-----'`);

    t.end();
});

tap.test('getValueHistogram', (t)=> {
    const b = new Board();

    tap.same(b.getValueHistogram(), {1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0});

    b.setState81('500420800403070010010060000020734006000205000100698040000080020060040905008057001');
    tap.same(b.getValueHistogram(), {1:4, 2:4, 3:2, 4:5, 5:4, 6:4, 7:3, 8:4, 9:2});

    t.end();
});

tap.test('getValidValues', (t)=> {
    const b = new Board();
    b.setState81('500420800403070010010060000020734006000205000100698040000080020060040905008057001');

    tap.same(b.getValidValues([1, 1]), []);
    tap.same(b.getValidValues([2, 1]), [7, 9]);
    tap.same(b.getValidValues([5, 5]), [1]);
    tap.same(b.getValidValues([6, 7]), [1, 3, 6, 9]);

    // make it so 5, 5 can't have 1
    b.getCell([7, 5]).setValue(1);
    tap.same(b.getValidValues([5, 5]), []);

    t.end();
});

tap.test('getRelatedCells', (t)=> {
    function showRelatedCells(b, pos) {
        b.clear();
        b.getRelatedCells(pos).forEach(c => c.setValue(8));
        return b.getStateAscii();
    }

    const b = new Board();

    tap.same(showRelatedCells(b, [1, 1]),
`.-----.-----.-----.
|. 8 8|8 8 8|8 8 8|
|8 8 8|. . .|. . .|
|8 8 8|. . .|. . .|
:----- ----- -----:
|8 . .|. . .|. . .|
|8 . .|. . .|. . .|
|8 . .|. . .|. . .|
:----- ----- -----:
|8 . .|. . .|. . .|
|8 . .|. . .|. . .|
|8 . .|. . .|. . .|
'-----'-----'-----'`);

tap.same(showRelatedCells(b, [4, 5]), `.-----.-----.-----.
|. . .|8 . .|. . .|
|. . .|8 . .|. . .|
|. . .|8 . .|. . .|
:----- ----- -----:
|. . .|8 8 8|. . .|
|8 8 8|. 8 8|8 8 8|
|. . .|8 8 8|. . .|
:----- ----- -----:
|. . .|8 . .|. . .|
|. . .|8 . .|. . .|
|. . .|8 . .|. . .|
'-----'-----'-----'`);

    t.end();
});

tap.test('fillHints', (t)=> {
    const b = new Board();
    b.setState81('500420800403070010010060000020734006000205000100698040000080020060040905008057001');
    b.fillHints();

    tap.same(b.getStateAscii2(), `.-----------------.-----------------.-----------------.
|5     79    679  |4     2     139  |8     3679  379  |
|4     89    3    |589   7     9    |256   1     29   |
|2789  1     279  |3589  6     39   |23457 3579  23479|
:-----------------:-----------------:-----------------:
|89    2     59   |7     3     4    |15    589   6    |
|36789 34789 4679 |2     1     5    |137   3789  3789 |
|1     357   57   |6     9     8    |2357  4     237  |
:-----------------:-----------------:-----------------:
|379   34579 14579|139   8     1369 |3467  2     347  |
|237   6     127  |13    4     123  |9     378   5    |
|239   349   8    |39    5     7    |346   36    1    |
'-----------------'-----------------'-----------------'`);

    t.end();
});

tap.test('check', (t)=> {
    const b = new Board();
    tap.ok(b.check());

    b.setState81('500420800403070010010060000020734006000205000100698040000080020060040905008057001');
    record.calls = [];
    tap.ok(b.check(record));
    tap.equal(record.calls.length, 0);

    function testFailAndReasons(b, positionsWithValue, reasons) {
        b.clear();
        Object.keys(positionsWithValue).forEach(value => {
            positionsWithValue[value].forEach(p => b.getCell(p).setValue(value));
        });
        record.calls = [];
        tap.notOk(b.check(record));
        tap.equal(record.calls.length, reasons.length);
        tap.same(record.calls.map(line => line[0]), reasons);
    }

    testFailAndReasons(b, {5:[[1, 1], [4, 1]]}, [
        'repeated number in row #1: cells 1,1 and 4,1'
    ]);

    testFailAndReasons(b, {4:[[1, 1], [1, 7]]}, [
        'repeated number in col #1: cells 1,1 and 1,7'
    ]);

    testFailAndReasons(b, {3:[[1, 1], [2, 2]]}, [
        'repeated number in tile #1: cells 1,1 and 2,2'
    ]);

    t.end();
});

tap.test('checkDone', (t)=> {
    const b = new Board();
    tap.notOk(b.checkDone());

    b.setState81('500420800403070010010060000020734006000205000100698040000080020060040905008057001');
    tap.notOk(b.checkDone());

    b.setState81('576421839483579612912863574829734156634215798157698243395186427761342985248957361');
    tap.ok(b.checkDone());

    t.end();
});
