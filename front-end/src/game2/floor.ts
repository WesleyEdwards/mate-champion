import { Coordinates } from "../Game/models";
import { Champ, champConst } from "./champ";
import { Groog } from "./groog";
import { PlatformState } from "./platform";
import { RenderFunH } from "./render/helpers";
import { CurrAndPrev } from "./state/helpers";

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

export const updateFloors = (
  floors: FloorState[],
  champ: Champ,
  grogs: Groog[]
) => {
  for (const floor of floors) {
    calcPlatPlayerCollision(floor, champ.position, (x) =>
      champ.queueActions.push(x)
    );
    for (const grog of grogs) {
      calcPlatPlayerCollision(floor, grog.position, (x) =>
        grog.queueActions.push(x)
      );
    }
  }
};

export function calcPlatPlayerCollision(
  floor: FloorState | PlatformState,
  personPos: CurrAndPrev,
  setYPos: (params: { name: "setY"; y: number }) => void
) {
  const betweenCenterAndEdgeX = champConst.width / 2;
  const cx = personPos.curr.x;
  if (
    cx + betweenCenterAndEdgeX < floor.position.x ||
    cx - betweenCenterAndEdgeX > floor.position.x + floor.widthHeight.x
  ) {
    return;
  }

  const betweenCenterAndBottom = champConst.height / 2;

  const previous = personPos.prev.y + betweenCenterAndBottom;
  const recent = personPos.curr.y + betweenCenterAndBottom;

  if (recent >= floor.position.y && previous <= floor.position.y) {
    const setY = floor.position.y - betweenCenterAndBottom;
    setYPos({ name: "setY", y: setY });
  }
}
