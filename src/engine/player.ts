import { Sprite, Texture, Application, Assets } from 'pixi.js';

export class Player {
  sprite: Sprite;
  tileIndex = 0;
  stars = 0;
  name: string;
  app: Application;

  constructor(app: Application, position: { x: number; y: number }, textureId: string, name: string) {
    this.app = app;
    const texture = Assets.get(textureId) as Texture;
    this.sprite = new Sprite(texture);
    this.sprite.anchor.set(0.5);

    const size = 0.06 * app.screen.width;
    this.sprite.width = size;
    this.sprite.height = size;
    this.sprite.x = position.x + size / 2;
    this.sprite.y = position.y + size / 2;

    this.name = name;
    app.stage.addChild(this.sprite);
  }

  moveTo(pos: { x: number; y: number }) {
    const size = 0.06 * this.app.screen.width;
    this.sprite.x = pos.x + size / 2;
    this.sprite.y = pos.y + size / 2;
  }
}
