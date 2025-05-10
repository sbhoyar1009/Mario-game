import { Sprite, Container, Assets, Texture } from 'pixi.js';

export class Dice {
  container: Container;
  sprite: Sprite;
  textures: Texture[] = [];

  urls = [
    'https://upload.wikimedia.org/wikipedia/commons/2/2c/Alea_1.png',
    'https://upload.wikimedia.org/wikipedia/commons/b/b8/Alea_2.png',
    'https://upload.wikimedia.org/wikipedia/commons/2/2f/Alea_3.png',
    'https://upload.wikimedia.org/wikipedia/commons/8/8d/Alea_4.png',
    'https://upload.wikimedia.org/wikipedia/commons/5/55/Alea_5.png',
    'https://upload.wikimedia.org/wikipedia/commons/f/f4/Alea_6.png',
  ];

  constructor() {
    this.container = new Container();
    this.sprite = new Sprite();
    this.sprite.anchor.set(0.5);
    this.sprite.width = this.sprite.height = 64;
    this.sprite.x = 0;
    this.sprite.y = 0;
    this.container.x = 700;
    this.container.y = 100;
    this.container.addChild(this.sprite);
  }
  
  async loadTextures() {
    // 1. Register dice textures with aliases
    this.urls.forEach((url, i) => {
      Assets.add({ alias: `dice-${i + 1}`, src: url });
    });

    // 2. Load them
    const textures = await Assets.load([
      'dice-1',
      'dice-2',
      'dice-3',
      'dice-4',
      'dice-5',
      'dice-6',
    ]);

    // 3. Store them in order
    this.textures = [
      textures['dice-1'],
      textures['dice-2'],
      textures['dice-3'],
      textures['dice-4'],
      textures['dice-5'],
      textures['dice-6'],
    ];

    this.sprite.texture = this.textures[0]; // Initial face
  }

  roll(): Promise<number> {
    return new Promise((resolve) => {
      let rolls = 12;
      const result = Math.floor(Math.random() * 6);

      const interval = setInterval(() => {
        const frame = Math.floor(Math.random() * 6);
        this.sprite.texture = this.textures[frame];
        rolls--;

        if (rolls === 0) {
          clearInterval(interval);
          this.sprite.texture = this.textures[result];
          resolve(result + 1);
        }
      }, 80);
    });
  }

  get view() {
    return this.container;
  }
}
