import { packageConst } from "../constants";
import { StatsManagerInfo } from "../helpers/types";
import { emptyStats } from "../helpers/utils";

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
  fps: number = 0;

  constructor() {}

  update({ killedOpp, shot, packagesReceived }: StatsManagerInfo): boolean {
    if (killedOpp) this.addScore(10);
    if (shot) this.shotAmmo();
    if (packagesReceived) this.addAmmo();
    return !!killedOpp || shot || packagesReceived;
  }

  updateTime(timeStamp: number) {
    this.fps = Math.round(1000 / (timeStamp - this.prevTime));

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
    this.timeInLevel = 0;
    this.initial = true;
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

  addAmmo() {
    this.uiInfo.ammo += packageConst.worth;
  }
  shotAmmo() {
    this.uiInfo.ammo -= 1;
  }
  addScore(num: number) {
    this.uiInfo.score += num;
  }
  addLives(num: number) {
    this.uiInfo.lives += num;
  }
}
