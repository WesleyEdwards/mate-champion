import { addEventListeners } from "../Game/helpers/eventListeners";
import { WinState } from "../Game/helpers/types";
import { Keys } from "../Game/models";
import { MBulletState } from "./bullet";
import { Camera } from "./camera";
import { ChampState, Champ1 } from "./champ";
import { FloorState, floorConst } from "./floor";
import { Floor1, Platform1, PlatformState } from "./platform";
import { renderBg } from "./render/background";
import { accountForPosition } from "./render/helpers";
import { SpacialHashGrid } from "./spacialHashGrid";
import { reconcileActions } from "./state/reconcileActions";
import { updateCamera } from "./state/camera";
import { processChampActionRaw } from "./state/champ/actions";
import { Coors, CurrAndPrev, Id, ToRemove, updateTime } from "./state/helpers";
import { updateKeys } from "./state/keys";
import { emptyTime } from "./state/timeHelpers";

export type GameStateProps = {
  currStateOfGame: WinState;
  camera: Camera;
  time: {
    deltaT: number;
    prevStamp: number;
  };
  stats: {
    score: number;
  };
  player: Champ1;
  entities: Entity[];
  keys: Keys;
  toRemove: Id[];
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
    this.gridHash.newClient(this.state.player);
  }

  remove: Id[] = [];

  /** Step */
  step(timeStamp: number) {
    updateTime(this.state.time, timeStamp);
    updateKeys(this.state.keys, this.state.player.state);
    updateCamera(
      this.state.camera,
      this.state.time.deltaT,
      this.state.player.state
    );

    for (const entity of this.state.entities) {
      this.gridHash.updateClient(entity);
      entity.handleInteraction?.(this.nearEntities(entity));
      entity.step(this.state.time.deltaT);
    }

    // Update player.
    this.state.player.handleInteraction?.(this.nearEntities(this.state.player));
    this.state.player.step(this.state.time.deltaT);
    this.gridHash.updateClient(this.state.player);

    reconcileActions(this.state.player, this.state.entities);

    if (this.state.entities.some((e) => e.state.dead)) {
      this.state.entities = this.state.entities.filter((e) => !e.state.dead);
    }
  }

  nearEntities(e: Entity): Entity[] {
    const near = this.gridHash.findNear(e);
    const nearEntities = [];
    if (near.includes(this.state.player.id)) {
      nearEntities.push(this.state.player);
    }
    this.state.entities.forEach((e) => {
      if (near.includes(e.id)) {
        nearEntities.push(e);
      }
    });
    return nearEntities;
  }

  /** Render */
  render(cxt: CanvasRenderingContext2D) {
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

    this.state.player.render(cxt);
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
