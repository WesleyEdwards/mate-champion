import oopSprites from "../../assets/opp-1-sprites-1.png";
import playerSprites from "../../assets/mate-player.png";
import matePackage from "../../assets/mate-package.png";
import bulletHor from "../../assets/bullet-hor.png";
import pot from "../../assets/pot.png";

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

export type Drawable = "opponent" | "player";

export const drawableMap: Record<Drawable, string> = {
  opponent: oopSprites,
  player: playerSprites,
};

export type SpriteOption =
  | "forward"
  | "right"
  | "left"
  | "rightUp"
  | "leftUp"
  | "rightAttack"
  | "leftAttack"
  | "rightUpAttack"
  | "leftUpAttack";

// Most of the sprites will be 32x32 and only one row. The others require more specificity.
export type SpriteMap = Partial<Record<SpriteOption, number | SpritePicInfo>>;

export const spriteMap = {
  opponent: {
    forward: 0,
    right: 1,
    left: 2,
    rightAttack: 3,
    leftAttack: 4,
  },
  player: {
    right: 0,
    left: 1,
    rightUp: 2,
    leftUp: 3,
    rightAttack: { x: 4, y: 0, height: 1, width: 1.5 },
    leftAttack: { x: 5.5, y: 0, height: 1, width: 1.5, extra: "beginX" },
    rightUpAttack: { x: 0, y: 1, height: 1.5, width: 1, extra: "beginY" },
    leftUpAttack: { x: 1, y: 1, height: 1.5, width: 1, extra: "beginY" },
  },
} satisfies Record<Drawable, SpriteMap>;

export type SpritePicInfo = {
  x: number;
  y: number;
  height: number;
  width: number;
  extra?: "beginX" | "beginY" | "endX" | "endY"; // default is "endX"
};
