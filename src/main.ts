
import { Application } from 'pixi.js';
import { Game } from './game';

let app: Application;
let game: Game;

(async () => {
  app = new Application()
  await app.init({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x333333,
  });

  app.canvas.style.width = '100vw';
  app.canvas.style.height = '100vh';
  app.canvas.style.display = 'block';
  document.body.appendChild(app.canvas);

  // Wait for modal interaction before starting the game
  (window as any).startPixiGame = () => {
    document.getElementById('instructions-modal')!.style.display = 'none';
    if (game) {
      app.stage.removeChildren();
    }
    game = new Game(app);
  };
})();
