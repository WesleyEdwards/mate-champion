import { ObjectManager } from "../GameState/ObjectManager";
import { Coordinates, LevelInfo, StaticObject } from "../models";
import { PlatformCreator } from "./PlatformCreator";
import { ContentEvent, CreatingThing, ItemType } from "./CreatingThing";
import { addDevEventListeners } from "./eventListeners";
import { FloorCreator } from "./FloorCreator";
import { GrogCreator } from "./GrogCreator";
import { PackageCreator } from "./PackageCreator";
import {
  exportLevelInfo,
  findExistingItem,
  findExistingItems,
} from "./helpers";

type DevContentCreateProps = {
  canvas: HTMLCanvasElement;
  objectManager: ObjectManager;
  setLevel?: (level: Partial<LevelInfo>) => void;
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
  cameraOffset: Coordinates = { x: 0, y: 0 };
  prevColor: string = "";
  prevCurrCreating: ItemType = "platform";
  setLevel?: (level: Partial<LevelInfo>) => void;
  lastUpdate: number = 0;

  creatingOptions: Record<ItemType, CreatingThing>;

  prevDrag: Coordinates | null = null;
  dragSelect: Coordinates | null = null;

  constructor({ canvas, objectManager, setLevel }: DevContentCreateProps) {
    addDevEventListeners(this, canvas);
    this.objectManager = objectManager;
    this.platforms = objectManager.platformManager.platforms;
    this.creatingOptions = {
      platform: new PlatformCreator(objectManager),
      floor: new FloorCreator(objectManager),
      grog: new GrogCreator(objectManager),
      package: new PackageCreator(objectManager),
    };
    this.setLevel = setLevel;
  }

  update(offset: Coordinates, timestamp: number) {
    if (timestamp - this.lastUpdate > 3000) {
      this.lastUpdate = timestamp;
      this.setLevel?.(exportLevelInfo(this.objectManager));
    }
    this.cameraOffset = { x: offset.x, y: offset.y };

    if (window.selectedItem !== this.prevCurrCreating) {
      this.currentlyCreating.selectItem(null);
    }
    this.prevCurrCreating = window.selectedItem;
  }

  selectOneItem(xNoOffset: number, y: number, shiftKey: boolean) {
    const existingItem = findExistingItem(
      xNoOffset + this.cameraOffset.x,
      y - this.cameraOffset.y,
      this.currentlyCreating.items
    );

    if (!existingItem) {
      Object.values(this.creatingOptions).forEach((c) => {
        const existsInOther = findExistingItem(
          xNoOffset + this.cameraOffset.x,
          y - this.cameraOffset.y,
          c.items
        );
        if (existsInOther) {
          c.selectItem(existsInOther);
          window.selectedItem = c.itemType;
        }
      });
    }

    if (shiftKey && existingItem === null) return;

    this.currentlyCreating.selectItem(existingItem || null, shiftKey);
  }

  selectMultipleItems(xNoOffset: number, y: number) {
    if (!this.dragSelect) {
      this.dragSelect = { x: xNoOffset, y };
      return;
    }

    const coor1 = {
      x: Math.min(this.dragSelect.x, xNoOffset) + this.cameraOffset.x,
      y: Math.min(this.dragSelect.y, y) + this.cameraOffset.y,
    };
    const coor2 = {
      x: Math.max(this.dragSelect.x, xNoOffset) + this.cameraOffset.x,
      y: Math.max(this.dragSelect.y, y) + this.cameraOffset.y,
    };

    const existingItems = findExistingItems(
      coor1,
      coor2,
      this.currentlyCreating.items
    );

    this.currentlyCreating.selectItems(existingItems);
  }

  mouseDown(xNoOffset: number, y: number, shiftKey: boolean) {
    this.prevDrag = { x: xNoOffset, y };
    this.selectOneItem(xNoOffset, y, shiftKey);

    if (shiftKey) {
      this.dragSelect = { x: xNoOffset, y };
    }
  }

  mouseUp({ x: xNoOffset, y }: Coordinates, shiftKey: boolean) {
    if (Math.abs(xNoOffset - (this.dragSelect?.x ?? 0)) > 5 && shiftKey) {
      this.selectMultipleItems(xNoOffset, y);
    }
    this.prevDrag = null;
    this.selectOneItem(xNoOffset, y, shiftKey);
  }

  handleKeyEvent(action: ContentEvent, shiftKey?: boolean, coor?: Coordinates) {
    if (["plus", "minus", "delete", "duplicate"].includes(action)) {
      this.currentlyCreating.handleEvent(action);
    }

    if (!coor) return;
    if (action === "create") {
      this.currentlyCreating.handleEvent("create", {
        x: coor.x + this.cameraOffset.x,
        y: coor.y - this.cameraOffset.y,
      });
    }

    if (action === "drag" && this.prevDrag) {
      this.currentlyCreating.handleEvent(
        "drag",
        {
          x: coor.x - this.prevDrag.x,
          y: coor.y - this.prevDrag.y,
        },
        shiftKey
      );

      this.prevDrag = { ...coor };
    }
  }

  get currentlyCreating() {
    return this.creatingOptions[window.selectedItem];
  }
}
