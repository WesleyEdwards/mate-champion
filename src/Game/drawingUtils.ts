type imageObjects =
  | "knifeRight"
  | "knifeLeft"
  | "player"
  | "opponent"
  | "matePot";

const images: Record<imageObjects, string> = {
  player:
    "https://user-images.githubusercontent.com/97990557/203665426-fd8ff45f-0cfd-4fd9-938b-49c00026cec7.png",
  knifeRight:
    "https://user-images.githubusercontent.com/97990557/209459253-164f49e2-8887-4514-8ce5-53dfee752d55.png",
  knifeLeft:
    "https://user-images.githubusercontent.com/97990557/209459284-bc92aaef-701c-4a79-93d0-8a32db540f28.png",
  opponent:
    "https://user-images.githubusercontent.com/97990557/208226991-4b983424-8743-40d8-8467-06d52a798c1d.png",
  matePot:
    "https://user-images.githubusercontent.com/97990557/209288009-09b58ad3-31d9-433a-be1c-26131ae5b3e4.png",
};

export const makeImage = (
  width: number,
  height: number,
  object: imageObjects
) => {
  const image = new Image(width, height);

  image.src = images[object];

  return image;
};
