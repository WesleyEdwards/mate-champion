import { playerConst } from "../constants";
import { devSettings } from "../devSettings";
import { Coordinates } from "../models";

export class CameraDisplay {
  prevVel: Coordinates = { x: 0, y: 0 };
  currVel: Coordinates = { x: 0, y: 0 };
  playerDrift: Coordinates = { x: 0, y: 0 };
  lastKnownScrollPosition: number = 0;
  ticking: boolean = false;

  constructor() {
    if (devSettings.courseBuilder) {
      this.addScrollEventListeners();
    }
  }

  update(elapsedTime: number, playerVelocity: Coordinates) {
    this.prevVel = { x: this.currVel.x, y: this.currVel.y };

    this.calcDrift(elapsedTime, playerVelocity.x);
  }

  calcDrift(elapsedTime: number, playerVelocityX: number) {
    if (this.playerDrift.x < playerConst.driftX && playerVelocityX > 0) {
      this.playerDrift.x += playerVelocityX * elapsedTime;
      return;
    }

    if (this.playerDrift.x > -playerConst.driftX && playerVelocityX < 0) {
      this.playerDrift.x += playerVelocityX * elapsedTime;
      return;
    }

    this.currVel.x += playerVelocityX * elapsedTime;
  }

  reset() {
    this.prevVel = { x: 0, y: 0 };
    this.currVel = { x: 0, y: 0 };
    this.playerDrift = { x: 0, y: 0 };
  }

  addScrollEventListeners() {
    window.addEventListener("wheel", (e) => {
      if (e.shiftKey) {
        this.currVel.x += e.deltaY;
      }
    });
  }
}
