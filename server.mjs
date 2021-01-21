import { Board } from './board.mjs';

const b = new Board();

b.setState81('500420800403070010010060000020734006000205000100698040000080020060040905008057001');

console.log(b.getStateAscii());
