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
    "https://user-images.githubusercontent.com/97990557/203665544-8258c825-8683-4ee2-b940-db8612c62d18.png",
  knifeLeft:
    "https://user-images.githubusercontent.com/97990557/203666048-922403cc-30aa-4b8c-bab3-64de29562e02.png",
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
