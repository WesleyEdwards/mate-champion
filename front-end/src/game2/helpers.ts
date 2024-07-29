import { addEventListeners } from "../Game/helpers/eventListeners";
import { FullLevelInfo } from "../Game/models";
import { Champ1 } from "./champ";
import { floorConst } from "./floor";
import { Groog1 } from "./groog";
import { Floor1, Platform1 } from "./platform";
import { emptyTime } from "./state/timeHelpers";
import { Entity, GameStateProps } from "./State1";

export const initGameState = ({
  firstLevel,
}: {
  firstLevel: FullLevelInfo;
}): GameStateProps => {
  const entities: Entity[] = [];

  firstLevel.platforms.forEach((p) => {
    entities.push(
      new Platform1({
        color: p.color,
        position: { curr: [p.x, p.y], prev: [p.x, p.y] },
        dimensions: [p.width, p.height],
        dead: false,
      })
    );
  });
  firstLevel.floors.forEach((f) => {
    entities.push(
      new Floor1({
        color: f.color,
        position: {
          curr: [f.x, floorConst.floorY],
          prev: [f.x, floorConst.floorY],
        },
        dimensions: [f.width, floorConst.floorHeight],
        dead: false,
      })
    );
  });

  firstLevel.opponents.grog.forEach((g) => {
    entities.push(new Groog1([g.initPos.x, g.initPos.y], [g.moveSpeed, 0]));
  });
  entities.push(new Champ1({ curr: [400, 400], prev: [400, 400] }));

  return {
    currStateOfGame: "initial",
    camera: {
      position: [0, 0],
      velocity: [0, 0],
      time: { idleTime: emptyTime("up") },
    },
    time: { deltaT: 0, prevStamp: performance.now() },
    stats: { score: 0 },
    entities: entities,

    keys: addEventListeners(() => {
      window.pause = !window.pause;
      console.log("Paused", window.pause);
    }),
    toRemove: [],
  };
};
