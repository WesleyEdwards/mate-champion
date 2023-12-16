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
import { findExistingItem, findExistingItems } from "./helpers";

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

    // @ts-ignore - this is a hack to get the current item type
    const selected = (window.hackyHack ?? "platform") as ItemType;
    if (selected !== this.currentlyCreating.itemType) {
      this.currentlyCreating = this.creatingOptions[selected];
      this.currentlyCreating.selectItem(null);
    }
  }

  selectOneItem(xNoOffset: number, y: number, shiftKey: boolean) {
    const existingItem = findExistingItem(
      xNoOffset + this.offsetX,
      y,
      this.currentlyCreating.items
    );

    if (shiftKey && existingItem === null) return;

    this.currentlyCreating.selectItem(existingItem || null, shiftKey);
  }

  selectMultipleItems(xNoOffset: number, y: number) {
    if (!this.dragSelect) {
      this.dragSelect = { x: xNoOffset, y };
      return;
    }

    const coor1 = {
      x: Math.min(this.dragSelect.x, xNoOffset) + this.offsetX,
      y: Math.min(this.dragSelect.y, y),
    };
    const coor2 = {
      x: Math.max(this.dragSelect.x, xNoOffset) + this.offsetX,
      y: Math.max(this.dragSelect.y, y),
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
        x: coor.x + this.offsetX,
        y: coor.y,
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
}
