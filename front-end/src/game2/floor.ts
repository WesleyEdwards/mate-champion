import { Coordinates } from "../Game/models";
import { Champ, champConst } from "./champ";
import { PlatformState } from "./platform";
import { RenderFunH } from "./render/helpers";

export type FloorState = {
  color: string;
  position: Coordinates;
  widthHeight: Coordinates;
};

export const floorConst = {
  floorY: 530,
  floorHeight: 60,
} as const;

export const renderFloor: RenderFunH<FloorState> = (f) => (cxt) => {
  cxt.fillStyle = f.color;
  cxt.strokeStyle = "black";
  cxt.lineWidth = 8;

  cxt.strokeRect(0, 0, f.widthHeight.x, f.widthHeight.y);
  cxt.fillRect(0, 0, f.widthHeight.x, f.widthHeight.y);
};

export const updateFloors = (floors: FloorState[], champ: Champ) => {
  for (const floor of floors) {
    calcPlatPlayerCollision(floor, champ);
  }
};

export function calcPlatPlayerCollision(
  floor: FloorState | PlatformState,
  champ: Champ
) {
  const betweenCenterAndEdgeX = champConst.width / 2;
  const cx = champ.position.curr.x;
  if (
    cx + betweenCenterAndEdgeX < floor.position.x ||
    cx - betweenCenterAndEdgeX > floor.position.x + floor.widthHeight.x
  ) {
    return;
  }

  const betweenCenterAndBottom = champConst.height / 2;

  const previous = champ.position.prev.y + betweenCenterAndBottom;
  const recent = champ.position.curr.y + betweenCenterAndBottom;

  if (recent >= floor.position.y && previous <= floor.position.y) {
    const setY = floor.position.y - betweenCenterAndBottom;
    champ.queueActions.push({ name: "setY", y: setY });
  }
}
