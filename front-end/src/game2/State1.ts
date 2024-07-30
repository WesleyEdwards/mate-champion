import { WinState } from "../Game/helpers/types";
import { Keys } from "../Game/models";
import { Camera } from "./camera";
import { displayNextLevel, renderBg } from "./render/background";
import { accountForPosition } from "./render/helpers";
import { SpacialHashGrid } from "./spacialHashGrid";
import { reconcileActions } from "./state/reconcileActions";
import { updateCamera } from "./state/camera";
import { Coors, CurrAndPrev, Id, ToRemove, updateTime } from "./state/helpers";
import { TimerDown, updateTimers } from "./state/timeHelpers";

export type GameStateProps = {
  currStateOfGame: WinState;
  camera: Camera;
  time: {
    deltaT: number;
    prevStamp: number;
  };
  timers: {
    nextLevelTimer: TimerDown;
  };
  stats: {
    score: number;
  };
  entities: Entity[];
  keys: Keys;
};

export type EntityType = "player" | "groog" | "floor" | "platform" | "bullet";

export type Entity = {
  id: Id;
  typeId: EntityType;
  step: (deltaT: number) => void;
  render: (cxt: CanvasRenderingContext2D) => void;
  state: {
    position: CurrAndPrev;
    dimensions: Coors;
    dead: boolean;
  };
  handleInteraction?: (entities: Entity[]) => void;
};

export class Game {
  gridHash: SpacialHashGrid;
  constructor(public state: GameStateProps) {
    this.gridHash = new SpacialHashGrid([-100, 4000], [20, 20]);
    for (const entity of state.entities) {
      this.gridHash.newClient(entity);
    }
  }

  /** Step */
  step(timeStamp: number) {
    updateTime(this.state.time, timeStamp);
    updateTimers(this.state.timers, this.state.time.deltaT);

    if (this.state.currStateOfGame === "playing") {
      this.stepGamePlay();
    } else {
      if (this.state.timers.nextLevelTimer.val <= 0) {
        this.state.currStateOfGame = "playing";
      }
    }
  }

  stepGamePlay() {
    updateCamera(this.state.camera, this.state.time.deltaT);
    for (const entity of this.state.entities) {
      this.gridHash.updateClient(entity);
      entity.handleInteraction?.(this.nearEntities(entity));
      entity.step(this.state.time.deltaT);
      if (entity.typeId === "player") {
        if (entity.state.dead) {
          console.log("ri[");
          this.state.currStateOfGame = "loseLife";
          this.state.timers.nextLevelTimer.val = gameStateConst.showMessageTime;
        }
      }
    }

    reconcileActions(this.state);

    if (this.state.entities.some((e) => e.state.dead)) {
      this.state.entities = this.state.entities.filter((e) => !e.state.dead);
    }
  }

  nearEntities(e: Entity): Entity[] {
    const near = this.gridHash.findNear(e);
    return this.state.entities.filter((e) => near.includes(e.id));
  }

  /** Render */
  render(cxt: CanvasRenderingContext2D) {
    if (this.state.currStateOfGame === "nextLevel") {
      displayNextLevel(cxt, this.state.currStateOfGame, 1);
      return;
    }

    const camPos = this.state.camera.position;

    cxt.save();
    cxt.translate(-camPos[0], camPos[1]);

    renderBg(this.state.camera, cxt);

    for (const entity of this.state.entities) {
      cxt.save();
      accountForPosition(entity.state.position, cxt);
      entity.render(cxt);
      cxt.restore();
    }

    cxt.restore();
  }
}

export function areTouching1(
  objectAPos: Coors,
  where: Coors,
  dist: number
): boolean {
  // For some reason, 'where' was coming in as undefined here (from looping through opponents)
  const distBetween = Math.sqrt(
    Math.pow(objectAPos[0] - (where?.[0] ?? 0), 2) +
      Math.pow(objectAPos[1] - (where?.[1] ?? 0), 2)
  );
  return distBetween < dist;
}

export const gameStateConst = {
  showMessageTime: 2000,
} as const;
