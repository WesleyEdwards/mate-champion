import { ObjectManager } from "../GameState/ObjectManager";
import { Coordinates, StaticObject } from "../models";
import { PlatformCreator } from "./PlatformCreator";
import { CreatingThing, CreatorItem, ItemType } from "./CreatingThing";
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
  draggingOffset?: Coordinates;
  prevColor: string = "";
  currentlyCreating: CreatingThing;

  creatingOptions: Record<ItemType, CreatingThing>;

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

  mouseDown(xNoOffset: number, y: number) {
    const x = xNoOffset + this.offsetX;

    const existingItem = this.findExistingItem(x, y);

    if (existingItem) {
      this.draggingOffset = {
        x: x - existingItem.vector.posX,
        y: y - existingItem.vector.posY,
      };

      return this.currentlyCreating.selectItem(existingItem);
    }
  }

  mouseUp({ x: xNoOffset, y }: Coordinates) {
    this.draggingOffset = undefined;
    const x = xNoOffset + this.offsetX;

    const existingPlatform = this.findExistingItem(x, y);

    this.currentlyCreating.selectItem(existingPlatform || null);
  }

  handleKeyEvent(
    action: "drag" | "create" | "delete" | "plus" | "minus",
    coor?: Coordinates
  ) {
    if (action === "create" || action === "drag") {
      if (!coor) {
        return console.error("no coordinates passed to handleKeyEvent");
      }
      const xWithOffset = coor.x + this.offsetX;

      if (action === "create") {
        const offSetCoor = { x: xWithOffset, y: coor.y };
        this.currentlyCreating.handleCreate(offSetCoor);
      }
      // debounceLog(action === "drag", this.draggingOffset);
      if (action === "drag" && this.draggingOffset) {
        const { x: offsetX, y: offsetY } = this.draggingOffset;
        this.currentlyCreating.dragItem({
          x: xWithOffset - offsetX,
          y: coor.y - offsetY,
        });
      }
    }

    switch (action) {
      case "delete":
        return this.currentlyCreating.handleDelete();
      case "plus":
        return this.currentlyCreating.handlePlus();
      case "minus":
        return this.currentlyCreating.handleMinus();
    }
  }
}
