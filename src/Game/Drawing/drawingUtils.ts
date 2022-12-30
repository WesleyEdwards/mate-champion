type imageObjects =
  | "mate-left"
  | "shank-left"
  | "mate-left-up"
  | "shank-left-up"
  | "mate-right"
  | "mate-right-up"
  | "shank-right"
  | "shank-right-up"
  | "mate-pot"
  | "opponent-left"
  | "opponent-right"
  | "yerba-ammo";

const images: Record<imageObjects, string> = {
  "mate-left":
    "https://user-images.githubusercontent.com/97990557/210005713-6be27cfb-fb8f-4f60-9b19-28231e0f1145.png",
  "shank-left":
    "https://user-images.githubusercontent.com/97990557/210005307-0e316a5c-13bb-4676-86c3-a877e50a0fa3.png",
  "mate-left-up":
    "https://user-images.githubusercontent.com/97990557/210007854-808a5224-398f-40a8-9ade-17f26bfdbc3f.png",
  "shank-left-up":
    "https://user-images.githubusercontent.com/97990557/210008996-7c6cc39f-0233-40bf-b62f-2fb84b696697.png",
  "mate-right":
    "https://user-images.githubusercontent.com/97990557/210005678-afa98993-b045-4134-9c4e-34cb390b3813.png",
  "mate-right-up":
    "https://user-images.githubusercontent.com/97990557/210007849-6598cd2c-758a-474c-8785-c479ea2dc83b.png",
  "shank-right":
    "https://user-images.githubusercontent.com/97990557/210005644-678881bc-d23b-475a-9966-c2d1a59e1cbe.png",
  "shank-right-up":
    "https://user-images.githubusercontent.com/97990557/210009002-374d01c7-7678-4b6b-a88b-e898c65136d3.png",
  "mate-pot":
    "https://user-images.githubusercontent.com/97990557/209984096-f821db2f-2f59-4599-976f-feb1b6295194.png",
  "opponent-left":
    "https://user-images.githubusercontent.com/97990557/210022545-8ad89050-eb77-4acf-960c-ef0a727da23d.png",
  "opponent-right":
    "https://user-images.githubusercontent.com/97990557/210022551-968ab0ed-5598-4ef1-b1d7-4afd1d6c8995.png",
  "yerba-ammo":
    "https://user-images.githubusercontent.com/97990557/210006253-209cfbac-631a-42e2-baf5-d3f906160a9b.png",
};

export interface MCImage {
  image: HTMLImageElement;
  width: number;
  height: number;
}

export function makeImage(
  width: number,
  height: number,
  object: imageObjects
): MCImage {
  const image = new Image(width, height);

  image.src = images[object];

  return { image, width, height };
}
