import { playerConst } from "../constants";
import { debounceLog } from "../helpers/utils";

export class CameraDisplay {
  prevX: number = 0;
  currX: number = 0;
  playerDriftX: number = 0;

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
}
