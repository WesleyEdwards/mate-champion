type imageObjects =
  | "matePot"
  | "opponentLeft"
  | "opponentRight"
  | "bulletVert"
  | "bulletHor"
  | "package";

export const bgImageUrl =
  "./public/sprites/back-ground.png";

export const instructionsUrl =
  "https://user-images.githubusercontent.com/97990557/210724055-8d8862af-16b0-442e-ba70-e89a389578cd.png";

const images: Record<imageObjects, string> = {
  matePot:
    "https://user-images.githubusercontent.com/97990557/209984096-f821db2f-2f59-4599-976f-feb1b6295194.png",
  opponentLeft:
    "https://user-images.githubusercontent.com/97990557/210022545-8ad89050-eb77-4acf-960c-ef0a727da23d.png",
  opponentRight: "./public/sprites/opp-1-sprites-1.png",
  bulletHor:
    "https://user-images.githubusercontent.com/97990557/210044411-c18b7c57-3883-46df-95a4-b9c21e8379ed.png",
  bulletVert:
    "https://user-images.githubusercontent.com/97990557/210044402-0ea81fd0-730b-444d-a7d1-29e5a2fe561b.png",
  package:
    "https://user-images.githubusercontent.com/97990557/210724150-d78ce97f-94ac-4bdd-98c2-91182af9877c.png",
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
  opponent: "./public/sprites/opp-1-sprites-1.png",
  player: "./public/sprites/mate-player.png",
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
