import { ObjectManager } from "../GameState/ObjectManager";
import { Platform } from "../Platform/Platform";
import { Coordinates, StaticObject } from "../models";
import { ContentEvent, CreatingThing, ItemType } from "./CreatingThing";

export class PlatformCreator implements CreatingThing<"platform"> {
  selected: Platform[] = [];
  defaultColor: string = "springgreen";
  items: Platform[];
  itemType: ItemType = "platform";

  constructor(objectManager: ObjectManager) {
    this.items = objectManager.platformManager.platforms as Platform[];
  }

  getItems() {
    return this.items as Platform[];
  }

  unSelectAll() {
    this.selected.forEach((p) => {
      p.color = this.defaultColor;
    });
    this.selected.splice(0, this.selected.length);
  }

  selectAll(platforms: Platform[]) {
    this.unSelectAll();
    this.selected = platforms;
    this.selected.forEach((p) => {
      p.color = "pink";
    });
  }

  selectItem(platform: StaticObject | null, multiple?: boolean) {
    if (platform && this.selected.includes(platform as Platform)) return;

    if (!platform || platform.isFloor) {
      this.unSelectAll();
      return;
    }

    if (!multiple && this.selected.length > 0) {
      this.unSelectAll();
    }

    this.items.map((p) => {
      if (p === platform) {
        this.selected.push(p as Platform);
        p.color = "pink";
      }
    });
  }

  selectItems(platforms: Platform[]) {
    this.unSelectAll();
    this.selected = platforms;
    this.selected.forEach((p) => {
      p.color = "pink";
    });
  }

  handleEvent(event: ContentEvent, coor?: Coordinates, shiftKey?: boolean) {
    if (event === "delete") return this.handleDelete();
    if (event === "plus") return this.handlePlus();
    if (event === "minus") return this.handleMinus();
    if (event === "duplicate") return this.handleDuplicate();

    if (!coor) return;

    if (event === "drag") {
      if (shiftKey) {
        return this.selected.forEach((p) => {
          p.vector.width += coor.x;
        });
      }
      return this.selected.forEach((p) => {
        p.vector.position.x += coor.x;
        p.vector.position.y += coor.y;
      });
    }

    if (event === "create") {
      return this.items.push(
        new Platform({
          x: coor.x - 50,
          y: coor.y - 20,
          width: 100,
          height: 40,
          color: "springgreen",
        })
      );
    }
  }

  handleDuplicate() {
    const newItems: Platform[] = [];
    this.selected.forEach((p) => {
      const newPlatform = new Platform({
        x: p.vector.position.x + 50,
        y: p.vector.position.y + 50,
        width: p.vector.width,
        height: p.vector.height,
        color: p.color,
      });
      this.items.push(newPlatform);
      newItems.push(newPlatform);
    });
    console.log(newItems);
    this.unSelectAll();
    this.selectAll(newItems);
  }

  handleDelete() {
    this.selected.forEach((p) => {
      const index = this.items.indexOf(p);
      this.items.splice(index, 1);
    });
    this.selected = [];
  }

  handlePlus() {
    if (this.selected && this.selected[0].vector.width < 100) {
      this.selected.forEach((p) => {
        p.vector.width += 10;
      });
    }
  }

  handleMinus() {
    if (this.selected && this.selected[0].vector.width > 10) {
      this.selected.forEach((p) => {
        p.vector.width -= 10;
      });
    }
  }
}
