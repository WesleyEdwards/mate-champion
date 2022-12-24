import { playerConstants, MAX_CANVAS_HEIGHT, GRAVITY } from "./constants";
import { makeImage } from "./drawingUtils";
import { Coordinates, Keys, PlayerAction } from "./models";

const { shankTime, shankCoolDown, moveSpeed, radius } = playerConstants;

export class Player {
  position: Coordinates;
  velocity: Coordinates;
  jumps: number;
  width: number;
  height: number;
  image: HTMLImageElement;
  knifeImage: HTMLImageElement;
  knifeLeft: HTMLImageElement;
  shank: number;
  facing: "left" | "right";

  constructor() {
    this.position = { x: 100, y: 100 };
    this.velocity = { x: 0, y: 0 };
    this.jumps = 0;
    this.width = radius * 2;
    this.height = radius * 2;
    this.image = makeImage(this.width, this.height, "player");
    this.knifeImage = makeImage(this.width, this.height, "knifeRight");
    this.knifeLeft = makeImage(this.width, this.height, "knifeLeft");
    this.shank = 0;
    this.facing = "right";
  }

  update(keys: Keys, xOffset: number) {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (keys.up) this.move("Jump");

    if (keys.right && this.position.x < 400) this.move("MoveRight");
    if (keys.right && this.position.x >= 400) this.move("StopX");

    if (keys.left && this.position.x >= 100) this.move("MoveLeft");
    if (keys.left && this.position.x < 100) this.move("StopX");

    if (!keys.right && !keys.left) this.move("StopX");

    if (keys.space && Date.now() - this.shank > shankTime + shankCoolDown) {
      this.shank = Date.now();
    }

    if (this.bottomPos > MAX_CANVAS_HEIGHT) this.move("StopY");
    else this.velocity.y += GRAVITY;
  }

  move(action: PlayerAction) {
    if (action === "MoveRight") {
      this.velocity.x = moveSpeed;
      this.facing = "right";
    }
    if (action === "MoveLeft") {
      this.velocity.x = -moveSpeed;
      this.facing = "left";
    }
    if (action === "StopX") this.velocity.x = 0;
    if (action === "StopY") {
      this.velocity.y = 0;
      this.position.y = MAX_CANVAS_HEIGHT - this.height;
    }

    if (action === "Jump" && this.velocity.y === 0 && this.jumps < 1) {
      this.velocity.y = -15;
      this.jumps++;
    }
    if (this.velocity.y > 0) this.jumps = 0;
  }

  draw(canvas: CanvasRenderingContext2D) {
    canvas.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
    if (this.shanking) {
      if (this.facing === "right") {
        canvas.drawImage(
          this.knifeImage,
          this.position.x + this.width / 2,
          this.position.y,
          this.width,
          this.height
        );
      } else {
        canvas.drawImage(
          this.knifeLeft,
          this.position.x - this.width / 1.4,
          this.position.y,
          this.width,
          this.height
        );
      }
    }
  }

  get shanking() {
    return Date.now() - this.shank < shankTime;
  }

  get bottomPos() {
    return this.position.y + this.height;
  }
  get rightPos() {
    return this.position.x + this.width;
  }
}

export default Player;
