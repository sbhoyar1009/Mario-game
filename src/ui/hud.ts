import { Container, Text, TextStyle } from 'pixi.js';

export class HUD {
  container: Container;
  diceText: Text;
  turnText: Text;
  scoreTexts: Text[] = [];

  constructor() {
    this.container = new Container();

    const style = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0xffffff,
    });

    this.diceText = new Text('Dice: -', style);
    this.diceText.x = 20;
    this.diceText.y = 10;

    this.turnText = new Text('Turn: -', style);
    this.turnText.x = 20;
    this.turnText.y = 40;

    this.container.addChild(this.diceText);
    this.container.addChild(this.turnText);
  }

  setDiceValue(value: number) {
    this.diceText.text = `Dice: ${value}`;
  }

  setTurn(playerName: string) {
    this.turnText.text = `Turn: ${playerName}`;
  }

  setScores(playerScores: { name: string; stars: number }[]) {
    // Clear old score texts
    for (const text of this.scoreTexts) {
      this.container.removeChild(text);
    }
    this.scoreTexts = [];

    const style = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 20,
      fill: 0xffff00,
    });

    playerScores.forEach((p, index) => {
      const text = new Text(`${p.name}: ${p.stars}⭐`, style);
      text.x = 600;
      text.y = 10 + index * 30;
      this.scoreTexts.push(text);
      this.container.addChild(text);
    });
  }

  get view() {
    return this.container;
  }
}
