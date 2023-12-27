import { playerConst } from "../constants";
import { devSettings } from "../devSettings";
import { Coordinates } from "../models";

export class CameraDisplay {
  prevCameraOffset: Coordinates = { x: 0, y: 0 };
  cameraOffset: Coordinates = { x: 0, y: 0 };
  playerDrift: Coordinates = { x: 0, y: 0 };
  lastKnownScrollPosition: number = 0;
  ticking: boolean = false;

  constructor() {
    if (devSettings.courseBuilder) {
      this.addScrollEventListeners();
    }
  }

  update(elapsedTime: number, playerVelocity: Coordinates, posY: number) {
    this.prevCameraOffset = { x: this.cameraOffset.x, y: this.cameraOffset.y };

    this.calcDrift(elapsedTime, playerVelocity.x);
    this.calcOffsetY(posY);
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

    this.cameraOffset.x += playerVelocityX * elapsedTime;
  }

  calcOffsetY(posY: number) {
    if (posY > 250) {
      this.cameraOffset.y = 0;
      return;
    }
    this.cameraOffset.y = 300 - posY;
  }

  reset() {
    this.prevCameraOffset = { x: 0, y: 0 };
    this.cameraOffset = { x: 0, y: 0 };
    this.playerDrift = { x: 0, y: 0 };
  }

  addScrollEventListeners() {
    window.addEventListener("wheel", (e) => {
      if (e.shiftKey) {
        this.cameraOffset.x += e.deltaY;
      }
    });
  }
}
