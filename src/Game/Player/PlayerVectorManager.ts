import { MAX_CANVAS_HEIGHT, playerConstants } from "../constants";
import { CharAction, Coordinates, VagueFacing, VectorMan } from "../models";
import { PlayerDirection } from "./models";

const { moveSpeed } = playerConstants;

export class PlayerVectorManager implements VectorMan {
  position: Coordinates;
  velocity: Coordinates;
  radius: number;
  facing: PlayerDirection;
  constructor(initPos: Coordinates, radius: number) {
    this.position = initPos;
    this.velocity = { x: 0, y: 0 };
    this.radius = radius;
    this.facing = "right";
  }

  move(action: CharAction, jumps: number, setJumps: (add: number) => void) {
    if (action === "MoveRight") {
      this.velocity.x = moveSpeed;
      this.setFacing("right");
    }
    if (action === "MoveLeft") {
      this.velocity.x = -moveSpeed;
      this.setFacing("left");
    }
    if (action === "StopX") this.velocity.x = 0;

    if (this.bottomPos > MAX_CANVAS_HEIGHT) {
      this.stopY(MAX_CANVAS_HEIGHT - this.height);
    }
    if (action === "Jump" && this.velocity.y === 0 && jumps < 1) {
      this.velocity.y = -15;
      setJumps((jumps += 1));
    }
    if (this.velocity.y > 0) setJumps(0);
  }



  isFacing(direction: PlayerDirection) {
    return this.facing === direction;
  }
  setFacing(direction: PlayerDirection) {
    this.facing = direction;
  }

  isVagueFacing(direction: VagueFacing) {
    return this.vagueFacing === direction;
  }

  get vagueFacing(): VagueFacing {
    if (this.facing === "rightUp" || this.facing === "rightDown") return "up";
    if (this.facing === "leftUp" || this.facing === "leftDown") return "up";
    return this.facing;
  }

  setUpPos(up: boolean = true) {
    if (up) {
      if (this.isFacing("right")) this.setFacing("rightUp");
      if (this.isFacing("left")) this.setFacing("leftUp");
    } else {
      if (this.isFacing("rightUp")) this.setFacing("right");
      if (this.isFacing("leftUp")) this.setFacing("left");
    }
  }

  setDownPos(down: boolean = true) {
    if (down) {
      if (this.isFacing("right")) this.setFacing("rightDown");
      if (this.isFacing("left")) this.setFacing("leftDown");
    } else {
      if (this.isFacing("rightDown")) this.setFacing("right");
      if (this.isFacing("leftDown")) this.setFacing("left");
    }
  }

  stopY(yPos: number) {
    this.velocity.y = 0;
    this.position.y = yPos;
  }

  get isMovingDown() {
    return this.facing === "leftDown" || this.facing === "rightDown";
  }
  get height() {
    return this.radius * 2;
  }
  get width() {
    return this.radius * 2;
  }

  get bottomPos() {
    return this.position.y + this.height;
  }
  get rightPos() {
    return this.position.x + this.width;
  }

  get centerX() {
    return this.position.x + this.width / 2;
  }
  get centerY() {
    return this.position.y + this.height / 2;
  }

  get posCenter() {
    return {
      x: this.centerX,
      y: this.centerY,
    };
  }

  get posRightWeapon() {
    return {
      x: this.position.x + this.width * 1.5,
      y: this.centerY,
    };
  }
  get posLeftWeapon() {
    return {
      x: this.position.x - this.width / 2,
      y: this.centerY,
    };
  }
  get posUpWeapon() {
    return {
      x: this.centerX,
      y: this.position.y - this.height / 2,
    };
  }
}
