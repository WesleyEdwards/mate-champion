import { playerConst } from "../constants";
import { devSettings } from "../devSettings";

export class CameraDisplay {
  prevX: number = 0;
  currX: number = 0;
  playerDriftX: number = 0;
  lastKnownScrollPosition: number = 0;
  ticking: boolean = false;

  constructor() {
    if (devSettings.courseBuilder) {
      this.addScrollEventListeners();
    }
  }

  update(elapsedTime: number, playerVelocityX: number) {
    this.prevX = this.currX;
    this.calcDrift(elapsedTime, playerVelocityX);
  }

  calcDrift(elapsedTime: number, playerVelocityX: number) {
    if (this.playerDriftX < playerConst.driftX && playerVelocityX > 0) {
      this.playerDriftX += playerVelocityX * elapsedTime;
      return;
    }

    if (this.playerDriftX > -playerConst.driftX && playerVelocityX < 0) {
      this.playerDriftX += playerVelocityX * elapsedTime;
      return;
    }

    this.currX += playerVelocityX * elapsedTime;
  }

  reset() {
    this.prevX = 0;
    this.currX = 0;
    this.playerDriftX = 0;
  }

  addScrollEventListeners() {
    window.addEventListener("wheel", (e) => {
      if (e.shiftKey) {
        this.currX += e.deltaY;
      }
    });
  }
}
