import { Application } from 'pixi.js';
import { Tile } from './tile';
import { Player } from './player';

export class Board {
  tiles: Tile[] = [];
  tilePositions: { x: number; y: number }[] = [];
  app: Application;

  constructor(app: Application, tileCount: number = 20) {
    this.app = app;
    this.createBoard(tileCount);
  }

  createBoard(tileCount: number) {
    const cols = 10;
    const spacing = 0.08 * this.app.screen.width;
    const startX = 0.05 * this.app.screen.width;
    const startY = 0.15 * this.app.screen.height;

    for (let i = 0; i < tileCount; i++) {
      const tile = new Tile();
      const x = startX + (i % cols) * spacing;
      const y = startY + Math.floor(i / cols) * spacing;
      tile.x = x;
      tile.y = y;
      this.tilePositions.push({ x, y });
      this.tiles.push(tile);
      this.app.stage.addChild(tile);
    }
  }

  getTilePosition(index: number) {
    return this.tilePositions[index % this.tilePositions.length];
  }

  movePlayer(player: Player, steps: number) {
    let moved = 0;
    let attempts = 0;

    while (moved < steps && attempts < this.tiles.length * 2) {
      attempts++;
      const nextIndex = (player.tileIndex + 1) % this.tiles.length;
      const nextTile = this.tiles[nextIndex];

      if (!nextTile.cracked) {
        player.tileIndex = nextIndex;
        moved++;
      } else {
        player.tileIndex = nextIndex;
      }
    }

    const tile = this.tiles[player.tileIndex];
    player.moveTo(this.tilePositions[player.tileIndex]);
    tile.stepOn();

    if (tile.hasStar) {
      player.stars++;
      tile.hasStar = false;
      tile.redraw();
    }
  }
}
