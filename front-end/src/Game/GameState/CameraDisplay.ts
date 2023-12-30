import { PlayerVectorManager } from "../Player/PlayerVectorManager";
import { MAX_CANVAS_HEIGHT, MAX_CANVAS_WIDTH, cameraConst } from "../constants";
import { devSettings } from "../devSettings";
import { debounceLog } from "../helpers/utils";
import { Coordinates } from "../models";

export class CameraDisplay {
  cameraOffset: Coordinates = { x: 0, y: 0 };
  cameraVelocity: Coordinates = { x: 0, y: 0 };
  // For some reason, when you leave the page for an extended amount of time,
  // it starts eating up computing power and the camera shifts to somewhere else
  idleTime: number = 0;

  constructor() {
    if (devSettings.courseBuilder) {
      this.addScrollEventListeners();
    }
  }

  update(elapsedTime: number, playerVector: PlayerVectorManager) {
    this.idleTime += elapsedTime;
    if (playerVector.velocity.x !== 0 || playerVector.velocity.y !== 0) {
      this.idleTime = 0;
    }
    if (this.idleTime > 3000) return;

    // y increases as the player goes up

    this.cameraOffset.x += this.cameraVelocity.x * elapsedTime;
    this.cameraOffset.y += this.cameraVelocity.y * elapsedTime;

    this.calcCameraX(playerVector.position.x);
    this.calcCameraY(playerVector.position.y);
  }

  calcCameraX(playerPos: number) {
    const playerDistFromWall = playerPos - this.cameraOffset.x;
    const diffX = playerDistFromWall - cameraConst.idealDistFromLeftWall;
    const newVelocity = diffX * 0.02;
    this.cameraVelocity.x = newVelocity;
  }

  calcCameraY(playerPos: number) {
    const distFromCeiling = playerPos + this.cameraOffset.y;
    const diffY = distFromCeiling - cameraConst.idealMinDistFromCeiling;

    const isBelow = this.cameraOffset.y <= 0 && diffY > 0;

    if (isBelow) {
      this.cameraOffset.y = 0;
      this.cameraVelocity.y = 0;
      return;
    }

    const fallingFactor = diffY > 30 ? diffY * 0.1 : 1;

    const newVelocity = -diffY * fallingFactor * 0.001;

    this.cameraVelocity.y = newVelocity;
  }

  draw(cxt: CanvasRenderingContext2D) {
    if (devSettings.cameraLines) {
      cxt.fillStyle = "red";
      cxt.moveTo(cameraConst.idealDistFromLeftWall, 0);
      cxt.lineTo(cameraConst.idealDistFromLeftWall, MAX_CANVAS_HEIGHT);
      cxt.stroke();

      cxt.moveTo(0, cameraConst.idealMinDistFromCeiling);
      cxt.lineTo(MAX_CANVAS_WIDTH, cameraConst.idealMinDistFromCeiling);
      cxt.stroke();
    }
  }

  reset() {
    this.cameraOffset = { x: 0, y: 0 };
    this.cameraVelocity = { x: 0, y: 0 };
  }

  addScrollEventListeners() {
    window.addEventListener("wheel", (e) => {
      if (e.shiftKey) {
        this.cameraOffset.x += e.deltaY;
      }
    });
  }
}
