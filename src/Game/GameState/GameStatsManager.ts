import { emptyStats } from "../constants";

type PlayInfo = {
  lives: number;
  level: number;
  ammo: number;
  score: number;
};

export class GameStatsManager {
  timeInLevel: number = 0;
  initial: boolean = true;
  totalTime: number = 0;
  uiInfo: PlayInfo = { ...emptyStats };
  prevTime: number = 0;
  elapsedTime: number = 0;
  scrollOffset: number = 0;

  constructor() {}

  updateTime(timeStamp: number) {
    if (this.initial) {
      this.prevTime = timeStamp;
      this.initial = false;
    }

    this.elapsedTime = timeStamp - this.prevTime;
    this.prevTime = timeStamp;
    this.timeInLevel += this.elapsedTime;
  }

  loseLife() {
    this.uiInfo.lives--;
    this.timeInLevel = 0;
    this.totalTime = 0;
  }

  nextLevel() {
    this.uiInfo.level++;
    this.uiInfo.ammo += 20;
    this.uiInfo.score += 100;
    this.resetLevel();
  }

  incrementScore(points: number) {
    this.uiInfo.score += points;
  }

  resetLevel() {
    this.scrollOffset = 0;
    this.timeInLevel = 0;
    this.initial = true;
  }

  incrementScrollOffset(num: number) {
    this.scrollOffset -= num;
  }

  get ammo() {
    return this.uiInfo.ammo;
  }
  get score() {
    return this.uiInfo.score;
  }
  get level() {
    return this.uiInfo.level;
  }
  get lives() {
    return this.uiInfo.lives;
  }

  addAmmo(num: number) {
    this.uiInfo.ammo += num;
  }
  addScore(num: number) {
    this.uiInfo.score += num;
  }
  addLives(num: number) {
    this.uiInfo.lives += num;
  }
}
