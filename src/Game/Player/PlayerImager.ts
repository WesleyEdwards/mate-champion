import { DrawImageInfo, mateImages, MateImages } from "../Drawing/ImageRepos";
import { SpriteOption } from "../Drawing/drawingUtils";
import { Coordinates } from "../models";
import { PlayerDirection } from "./models";

export class PlayerImager {
  images: MateImages;

  constructor() {
    this.images = mateImages;
  }

  draw(
    facing: PlayerDirection,
    shanking: boolean,
    position: Coordinates,
    canvas: CanvasRenderingContext2D
  ) {
    const findImage = this.findImage(facing, shanking);
    canvas.drawImage(
      findImage.image.image,
      position.x - (findImage.xOffset || 0),
      position.y - (findImage.yOffset || 0),
      findImage.image.width,
      findImage.image.height
    );
  }

  findImage(facing: PlayerDirection, shanking: boolean): DrawImageInfo {
    if (shanking) {
      return this.getShankingImage(facing);
    }
    return { image: this.images[facing] };
  }

  getShankingImage(facing: PlayerDirection): DrawImageInfo {
    if (facing === "left" || facing === "leftDown" || facing === "rightDown") {
      return {
        image: this.images.shanking[facing],
        xOffset: this.images.shanking[facing].width - this.images.left.width,
      };
    }
    if (facing === "rightUp" || facing === "leftUp") {
      return {
        image: this.images.shanking[facing],
        yOffset: this.images.shanking[facing].height - this.images.right.height,
      };
    }
    return {
      image: this.images.shanking[facing],
    };
  }

  otherShankingImage(facing: PlayerDirection, shanking: boolean): SpriteOption {
    if (!shanking) {
      if (facing === "rightDown") return "right";
      if (facing === "leftDown") return "left";
      return facing;
    }
    if (facing === "leftUp") return "leftUpAttack";
    if (facing === "left") return "leftAttack";
    if (facing === "rightUp") return "rightUpAttack";
    if (facing === "right") return "rightAttack";
    throw new Error("Not implemented");
  }
}
