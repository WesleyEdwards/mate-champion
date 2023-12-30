import playerSprites from "../../assets/mate-player.png";
import matePackage from "../../assets/mate-package.png";
import bulletHor from "../../assets/bullet-hor.png";
import pot from "../../assets/pot.png";

export type DrawInfo = {
  xOffset: number; // Where on the sprite image the start of the image is
  yOffset: number;
  width: number; // how much of the sprite sheet shows (64 will show two images squished into one)
  height: number;
  canvasX: number; // Where on the canvas the image will be drawn
  canvasY: number;
  spriteWidth: number; // How big the image will be drawn
  spriteHeight: number;
};

type imageObjects = "matePot" | "bulletVert" | "bulletHor" | "package";

const images: Record<imageObjects, string> = {
  matePot: pot,
  bulletHor: bulletHor,
  bulletVert: bulletHor,
  package: matePackage,
};

export type MCImage = {
  image: HTMLImageElement;
  width: number;
  height: number;
};

export function makeImage(
  width: number,
  height: number,
  object: imageObjects
): MCImage {
  const image = new Image(width, height);

  image.src = images[object];

  return { image, width, height };
}

export type Drawable = "opponent";

// Most of the sprites will be 32x32 and only one row. The others require more specificity.
// export type SpriteMap = Partial<Record<SpriteOption, number | SpritePicInfo>>;

export type SpritePicInfo = {
  x: number;
  y: number;
  height: number;
  width: number;
  extra?: "beginX" | "beginY" | "endX" | "endY"; // default is "endX"
};
