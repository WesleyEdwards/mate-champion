import { emptyStats } from "../constants";

export class GameStatsManager {
  prevTime: number = 0;
  initial: boolean = true;
  totalTime: number = 0;
  lives: number = emptyStats.lives;
  level: number = emptyStats.level;
  ammo: number = emptyStats.ammo;
  score: number = emptyStats.score;

  constructor() {}

  addElapsedTime(elapsedTime: number) {
    this.totalTime += elapsedTime;
  }

  get showNextLevel() {
    return this.totalTime < 3000;
  }

  elapsedTime(timeStamp: number): number {
    const elapsed = this.initial ? 0 : timeStamp - this.prevTime;
    this.initial = false;
    this.prevTime = timeStamp;
    return elapsed;
  }

  loseLife() {
    this.lives--;
    this.prevTime = 0;
    this.initial = true;
    this.totalTime = 0;
  }

  nextLevel() {
    this.prevTime = 0;
    this.initial = true;
    this.totalTime = 0;
  }

  incrementScore(points: number) {
    this.score += points;
  }
  startGame() {
    this.initial = true;
  }

  resetAll() {
    this.lives = emptyStats.lives;
    this.level = emptyStats.level;
    this.ammo = emptyStats.ammo;
    this.score = emptyStats.score;
    this.prevTime = 0;
    this.initial = true;
    this.totalTime = 0;
  }
}
