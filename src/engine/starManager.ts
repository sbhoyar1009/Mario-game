import { Board } from './board';

export function placeRandomStars(board: Board, count: number) {
  const available = board.tiles.filter(t => !t.cracked && !t.hasStar);
  for (let i = 0; i < count && available.length > 0; i++) {
    const index = Math.floor(Math.random() * available.length);
    const tile = available.splice(index, 1)[0];
    tile.hasStar = true;
    tile.redraw();
  }
}