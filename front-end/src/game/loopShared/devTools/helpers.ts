import { Coordinates, HasPosition } from "../models";

export function findExistingItems(
  coor1: Coordinates,
  coor2: Coordinates,
  items: HasPosition[]
): HasPosition[] {
  return items.filter(
    (item) =>
      coor1.x <= item.vector.position.x + item.vector.width &&
      coor2.x >= item.vector.position.x &&
      coor1.y <= item.vector.position.y + item.vector.height &&
      coor2.y >= item.vector.position.y
  );
}

export function findExistingItem(
  x: number,
  y: number,
  items: HasPosition[]
): HasPosition | null {
  return (
    items.find((item) => {
      // platforms base their position on the top-left corner,
      // while everything else is based on the middle of the object
      if ("isFloor" in item) {
        return (
          x >= item.vector.position.x &&
          x <= item.vector.position.x + item.vector.width &&
          y >= item.vector.position.y &&
          y <= item.vector.position.y + item.vector.height
        );
      }
      const distX = item.vector.width / 2;
      const distY = item.vector.height / 2;
      return (
        x >= item.vector.position.x - distX &&
        x <= item.vector.position.x + distX &&
        y >= item.vector.position.y - distY &&
        y <= item.vector.position.y + distY
      );
    }) || null
  );
}
