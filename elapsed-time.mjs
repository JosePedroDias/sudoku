import { zeroPad } from './utils.mjs';

export class ElapsedTime {
  constructor(el) {
    this.textNode = el.firstChild;
    this.dt = 0;
  }

  draw() {
    const dt = this.dt;
    const ss = dt % 60;
    const mm = Math.floor(dt / 60);
    this.textNode.nodeValue = `${mm}:${zeroPad(ss)}`;
  }

  start() {
    this.startDate = new Date(Date.now() - this.dt * 1000);
    this.timer = setInterval(this.onTick, 1000);
  }

  stop() {
    clearInterval(this.timer);
  }

  reset() {
    this.dt = 0;
    this.startDate = new Date(Date.now() - this.dt * 1000);
    this.draw();
  }

  onTick = () => {
    const d = new Date();
    const dt = Math.floor((d.valueOf() - this.startDate.valueOf()) / 1000);
    this.dt = dt;
    this.draw();
  };
}
