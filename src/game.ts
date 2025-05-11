import { Application, Assets } from 'pixi.js';
import { Board } from './engine/board';
import { Player } from './engine/player';
import { Dice } from './engine/dice';
import { placeRandomStars } from './engine/starManager';
import { HUD } from './ui/hud';

export class Game {
  app: Application;
  board: Board;
  players: Player[] = [];
  dice: Dice;
  hud: HUD;
  currentPlayerIndex = 0;
  targetStars = 3;
  isSinglePlayer = false;
  isInputLocked = false;

  constructor(app: Application) {
    this.app = app;
    this.board = new Board(app, 50);
    this.dice = new Dice();
    this.hud = new HUD();
    this.setup();
  }

  async setup() {
    const manifest = {
      bundles: [
        {
          name: 'main',
          assets: [
            { alias: 'bunny', src: 'https://pixijs.io/examples/examples/assets/bunny.png' },
            { alias: 'avatar2', src: 'https://pixijs.io/examples/examples/assets/eggHead.png' },
            { alias: 'dice-1', src: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Alea_1.png' },
            { alias: 'dice-2', src: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Alea_2.png' },
            { alias: 'dice-3', src: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Alea_3.png' },
            { alias: 'dice-4', src: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Alea_4.png' },
            { alias: 'dice-5', src: 'https://upload.wikimedia.org/wikipedia/commons/5/55/Alea_5.png' },
            { alias: 'dice-6', src: 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Alea_6.png' },
          ],
        },
      ],
    };

    Assets.init({ manifest });
    await Assets.loadBundle('main');
    await this.dice.loadTextures();
    this.app.stage.addChild(this.dice.view);
    this.app.stage.addChild(this.hud.view);

    this.initializeGameSettings();
    placeRandomStars(this.board, 10);
    this.setupInput();
  }

  initializeGameSettings() {
    this.isSinglePlayer = confirm("Play single-player mode against CPU?");

    const name1 = prompt("Enter name for Player 1:", "Player 1") || "Player 1";
    const name2 = this.isSinglePlayer
      ? "CPU"
      : prompt("Enter name for Player 2:", "Player 2") || "Player 2";

    const starInput = parseInt(prompt("Enter number of stars required to win (min 3):", "3") || "3");
    this.targetStars = Math.max(3, starInput);

    this.players.push(new Player(this.app, this.board.getTilePosition(0), 'bunny', name1));
    this.players.push(new Player(this.app, this.board.getTilePosition(0), 'avatar2', name2));
  }

  setupInput() {
    window.addEventListener('keydown', async (e) => {
      if (e.key === ' ' && !this.isInputLocked) {
        this.isInputLocked = true;

        const currentPlayer = this.players[this.currentPlayerIndex];
        this.hud.setTurn(currentPlayer.name);

        const steps = await this.dice.roll();
        this.hud.setDiceValue(steps);

        this.board.movePlayer(currentPlayer, steps);
        this.hud.setScores(this.players.map(p => ({ name: p.name, stars: p.stars })));

        if (this.board.tiles[currentPlayer.tileIndex].cracked) {
          alert(`${currentPlayer.name} landed on a cracked tile! Going back to start.`);
          currentPlayer.tileIndex = 0;
          currentPlayer.moveTo(this.board.getTilePosition(0));
        }

        if (currentPlayer.stars >= this.targetStars) {
          alert(`${currentPlayer.name} wins with ${currentPlayer.stars} stars!`);
          this.resetGame();
          return;
        }

        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;

        if (this.isSinglePlayer && this.currentPlayerIndex === 1) {
          setTimeout(() => this.simulateCpuTurn(), 1000);
        } else {
          this.isInputLocked = false;
        }
      }
    });
  }

  async simulateCpuTurn() {
    const currentPlayer = this.players[1];
    this.hud.setTurn(currentPlayer.name);
    const steps = await this.dice.roll();
    this.hud.setDiceValue(steps);

    this.board.movePlayer(currentPlayer, steps);
    this.hud.setScores(this.players.map(p => ({ name: p.name, stars: p.stars })));

    if (this.board.tiles[currentPlayer.tileIndex].cracked) {
      alert(`${currentPlayer.name} landed on a cracked tile! Going back to start.`);
      currentPlayer.tileIndex = 0;
      currentPlayer.moveTo(this.board.getTilePosition(0));
    }

    if (currentPlayer.stars >= this.targetStars) {
      alert(`${currentPlayer.name} wins with ${currentPlayer.stars} stars!`);
      this.resetGame();
      return;
    }

    this.currentPlayerIndex = 0;
    this.isInputLocked = false;
  }

  resetGame() {
    this.app.stage.removeChildren();
    const modal = document.getElementById('instructions-modal');
    if (modal) modal.style.display = 'flex';
  }
}
