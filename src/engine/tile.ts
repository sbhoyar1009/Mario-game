import { Graphics } from 'pixi.js';

export class Tile extends Graphics {
  stepCount = 0;
  cracked = false;
  hasStar = false;

  constructor() {
    super();
    this.redraw();
  }

  stepOn() {
    this.stepCount++;
    if (this.stepCount >= 2) this.cracked = true;
    this.redraw();
  }

  redraw() {
    const size = 0.08 * window.innerWidth;
    this.clear();

    const fillColor = this.cracked
      ? 0x000000 // fully cracked (black)
      : this.stepCount === 1
        ? 0x888888 // stepped once (grey)
        : 0xffffff; // fresh (white)

    this.beginFill(fillColor);
    this.drawRect(0, 0, size, size);
    this.stroke({ width: 2, color: 0x000000, alpha: 1 });
    this.endFill();

    if (this.hasStar) {
      this.beginFill(0xffd700);
      this.drawCircle(size / 2, size / 2, size * 0.1);
      this.endFill();
    }

    if (this.cracked) {
      this.beginPath();
      this.moveTo(0, 0);
      this.lineTo(size, size);
      this.moveTo(size, 0);
      this.lineTo(0, size);
      this.stroke({ width: 2, color: 0xffffff });
    }
  }
}
