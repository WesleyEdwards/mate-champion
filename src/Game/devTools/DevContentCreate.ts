import { ObjectManager } from "../GameState/ObjectManager";
import { Coordinates, StaticObject } from "../models";
import { PlatformCreator } from "./PlatformCreator";
import {
  ContentEvent,
  CreatingThing,
  CreatorItem,
  ItemType,
} from "./CreatingThing";
import { addDevEventListeners } from "./eventListeners";
import { FloorCreator } from "./FloorCreator";
import { GrogCreator } from "./GrogCreator";
import { PackageCreator } from "./PackageCreator";
import { debounceLog } from "../helpers/utils";

type DevContentCreateProps = {
  canvas: HTMLCanvasElement;
  objectManager: ObjectManager;
};

/**
 * This class is used to create content for levels. for the level-info/levelInfo.ts file.
 *
 * items it can create:
 * - platforms
 * - floor platforms
 *
 * ctrl + click to create an item
 * delete to delete an item
 *
 * ctrl + plus to add width
 * ctrl + minus to subtract width
 *
 *
 */

export class DevContentCreate {
  objectManager: ObjectManager;
  platforms: StaticObject[];
  offsetX: number = 0;
  prevColor: string = "";
  currentlyCreating: CreatingThing;

  creatingOptions: Record<ItemType, CreatingThing>;

  prevDrag: Coordinates | null = null;
  dragSelect: Coordinates | null = null;

  constructor({ canvas, objectManager }: DevContentCreateProps) {
    addDevEventListeners(this, canvas);
    this.objectManager = objectManager;
    this.platforms = objectManager.platformManager.platforms;
    this.creatingOptions = {
      platform: new PlatformCreator(objectManager),
      floor: new FloorCreator(objectManager),
      grog: new GrogCreator(objectManager),
      package: new PackageCreator(objectManager),
    };
    this.currentlyCreating = this.creatingOptions.platform;
  }

  update(offsetX: number) {
    this.offsetX = offsetX;

    const select = window.document.getElementById(
      "course-builder-select"
    ) as HTMLSelectElement;
    if (select.value === this.currentlyCreating.itemType) return;
    this.currentlyCreating.selectItem(null);
    this.currentlyCreating = this.creatingOptions[select.value as ItemType];
  }

  findExistingItem(x: number, y: number) {
    return this.currentlyCreating.items.find(
      (item) =>
        x >= item.vector.posX &&
        x <= item.vector.posX + item.vector.width &&
        y >= item.vector.posY &&
        y <= item.vector.posY + item.vector.height
    );
  }

  mouseDown(xNoOffset: number, y: number, shiftKey: boolean) {
    this.prevDrag = { x: xNoOffset, y };

    const existingItem = this.findExistingItem(xNoOffset + this.offsetX, y);
    if (existingItem) {
      return this.currentlyCreating.selectItem(existingItem, shiftKey);
    }
  }

  mouseUp({ x: xNoOffset, y }: Coordinates) {
    this.prevDrag = null;

    const existingPlatform = this.findExistingItem(xNoOffset + this.offsetX, y);
    this.currentlyCreating.selectItem(existingPlatform || null);
  }

  handleKeyEvent(action: ContentEvent, coor?: Coordinates) {
    if (["plus", "minus", "delete", "duplicate"].includes(action)) {
      this.currentlyCreating.handleEvent(action);
    }

    if (!coor) return;
    if (action === "create") {
      this.currentlyCreating.handleEvent("create", {
        x: coor.x + this.offsetX,
        y: coor.y,
      });
    }

    if (action === "drag" && this.prevDrag) {
      this.currentlyCreating.handleEvent("drag", {
        x: coor.x - this.prevDrag.x,
        y: coor.y - this.prevDrag.y,
      });

      this.prevDrag = { ...coor };
    }
  }
}
