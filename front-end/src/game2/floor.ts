import { Coordinates } from "../Game/models";
import { Champ, champConst } from "./champ";
import { Groog, groogConst } from "./groog";
import { PlatformState } from "./platform";
import { RenderFun } from "./render/helpers";
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

export const renderFloor: RenderFun<FloorState> = (f) => (cxt) => {
  cxt.fillStyle = f.color;
  cxt.strokeStyle = "black";
  cxt.lineWidth = 8;

  cxt.strokeRect(0, 0, f.widthHeight.x, f.widthHeight.y);
  cxt.fillRect(0, 0, f.widthHeight.x, f.widthHeight.y);
};

export const updateFloorsAndPlatforms = (
  floors: FloorState[],
  platforms: PlatformState[],
  champ: Champ,
  grogs: Groog[]
) => {
  for (const grog of grogs) {
    for (const floor of floors) {
      collWithGroog(grog, floor);
    }

    for (const plat of platforms) {
      collWithGroog(grog, plat);
    }
  }

  // Champ
  for (const floor of floors) {
    collWithChamp(champ, floor);
  }

  for (const p of platforms) {
    if (champ.facing.y !== "down") {
      collWithChamp(champ, p);
    }
  }
};

const collWithChamp = (c: Champ, f: FloorState | PlatformState) => {
  calcPlatPlayerCollision(f, c.position, champConst.widthHeight, (x) =>
    c.acceptQueue.push(x)
  );
};

const collWithGroog = (g: Groog, f: FloorState | PlatformState) => {
  calcPlatPlayerCollision(f, g.position, groogConst.widthHeight, (x) =>
    g.queueActions.push(x)
  );
};

export function calcPlatPlayerCollision(
  floor: FloorState | PlatformState,
  personPos: CurrAndPrev,
  personWidthHeight: Coordinates,
  setYPos: (params: { name: "setY"; y: number }) => void
) {
  const betweenCenterAndEdgeX = personWidthHeight.x / 2;
  const cx = personPos.curr.x;
  if (
    cx + betweenCenterAndEdgeX < floor.position.x ||
    cx - betweenCenterAndEdgeX > floor.position.x + floor.widthHeight.x
  ) {
    return;
  }

  const betweenCenterAndBottom = personWidthHeight.y / 2;

  const previous = personPos.prev.y + betweenCenterAndBottom;
  const recent = personPos.curr.y + betweenCenterAndBottom;

  if (recent >= floor.position.y && previous <= floor.position.y) {
    const setY = floor.position.y - betweenCenterAndBottom;
    setYPos({ name: "setY", y: setY });
  }
}
