import { ObjectManager } from "../GameState/ObjectManager";
import { Coordinates, HasPosition, StaticObject } from "../models";
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
import { findExistingItem } from "./helpers";

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

  selectOneItem(xNoOffset: number, y: number, shiftKey: boolean) {
    const existingItem = findExistingItem(
      xNoOffset + this.offsetX,
      y,
      this.currentlyCreating.items
    );

    if (shiftKey && existingItem === null) return;
    console.log(existingItem, shiftKey);

    this.currentlyCreating.selectItem(existingItem || null, shiftKey);
  }

  mouseDown(xNoOffset: number, y: number, shiftKey: boolean) {
    this.prevDrag = { x: xNoOffset, y };
    this.selectOneItem(xNoOffset, y, shiftKey);
  }

  mouseUp({ x: xNoOffset, y }: Coordinates, shiftKey: boolean) {
    this.prevDrag = null;
    this.selectOneItem(xNoOffset, y, shiftKey);
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
