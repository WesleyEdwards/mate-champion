import { ObjectManager } from "../GameState/ObjectManager";
import { Platform } from "../Platform/Platform";
import { platformConst } from "../constants";
import { debounceLog } from "../helpers/utils";
import { LevelInfo } from "../level-info/levelInfo";
import { Coordinates, StaticObject } from "../models";
import { DevKeys, addDevEventListeners } from "./eventListeners";
import { exportLevelInfo } from "./helpers";

type DevContentCreateProps = {
  canvas: HTMLCanvasElement;
  objectManager: ObjectManager;
};

/**
 * This class is used to create the level info for the level-info/levelInfo.ts file.
 * It is used to create the level info for the level-info/levelInfo.ts file.
 *
 * ctrl + click to create a platform
 * alt + click to create a floor platform
 * delete to delete a platform
 *
 * ctrl + plus to add a platform width
 * ctrl + minus to subtract a platform width
 *
 *
 */

export class DevContentCreate {
  objectManager: ObjectManager;
  platforms: StaticObject[];
  offsetX: number = 0;
  selectedPlatform: StaticObject | null = null;
  draggingOffset?: Coordinates;
  prevColor: string = "";
  constructor({ canvas, objectManager }: DevContentCreateProps) {
    addDevEventListeners(this, canvas);
    this.objectManager = objectManager;
    this.platforms = objectManager.platformManager.platforms;
  }

  update(offsetX: number) {
    this.offsetX = offsetX;
  }

  selectPlatform(platform: StaticObject | null) {
    if (this.selectedPlatform) this.selectedPlatform.color = this.prevColor;

    if (!platform) {
      return (this.selectedPlatform = null);
    }
    this.selectedPlatform = platform;
    this.platforms.map((p) => {
      if (p === platform) {
        this.selectedPlatform = platform;
        this.prevColor = p.color;
        p.color = "pink";
      }
    });
  }

  findExistingPlatform(x: number, y: number) {
    return this.platforms.find(
      (platform) =>
        x >= platform.vector.posX &&
        x <= platform.vector.posX + platform.vector.width &&
        y >= platform.vector.posY &&
        y <= platform.vector.posY + platform.vector.height
    );
  }

  mouseDown(xNoOffset: number, y: number) {
    const x = xNoOffset + this.offsetX;

    const existingPlatform = this.findExistingPlatform(x, y);

    if (existingPlatform) {
      this.draggingOffset = {
        x: x - existingPlatform.vector.posX,
        y: y - existingPlatform.vector.posY,
      };
      return this.selectPlatform(existingPlatform);
    }
  }

  mouseMove(xNoOffset: number, y: number) {
    const x = xNoOffset + this.offsetX;

    if (!!this.draggingOffset && this.selectedPlatform) {
      const { x: offsetX, y: offsetY } = this.draggingOffset;
      this.selectedPlatform.vector.position.x = x - offsetX;
      if (!this.selectedPlatform.isFloor) {
        this.selectedPlatform.vector.position.y = y - offsetY;
      }
    }
  }

  mouseUp(xNoOffset: number, y: number) {
    this.draggingOffset = undefined;
    const x = xNoOffset + this.offsetX;

    const existingPlatform = this.findExistingPlatform(x, y);

    if (existingPlatform) {
      return this.selectPlatform(existingPlatform);
    }
  }

  handleCreatePlatform(xNoOffset: number, y: number, floating: boolean) {
    const x = xNoOffset + this.offsetX;
    this.platforms.push(
      new Platform(
        floating
          ? {
              x: x - 50,
              y: y - 20,
              width: 100,
              height: 40,
              color: "springgreen",
            }
          : {
              x: x - 50,
              width: 100,
              color: "springgreen",
            }
      )
    );
  }

  handleDelete() {
    if (this.selectedPlatform) {
      const index = this.platforms.indexOf(this.selectedPlatform);
      this.platforms.splice(index, 1);
    }
    this.selectPlatform(null);
  }

  handlePlus() {
    if (this.selectedPlatform) {
      this.selectedPlatform.vector.width += 10;
    }
  }

  handleMinus() {
    if (this.selectedPlatform && this.selectedPlatform.vector.width > 10) {
      this.selectedPlatform.vector.width -= 10;
    }
  }
}
