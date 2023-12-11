import { ObjectManager } from "../GameState/ObjectManager";
import { Platform } from "../Platform/Platform";
import { Coordinates, StaticObject } from "../models";
import { CreatingThing, ItemType } from "./CreatingThing";

export class PlatformCreator implements CreatingThing<"platform"> {
  selected: Platform | null = null;
  prevColor: string = "";
  items: Platform[];
  itemType: ItemType = "platform";
  constructor(objectManager: ObjectManager) {
    this.items = objectManager.platformManager.platforms as Platform[];
  }

  getItems() {
    return this.items as Platform[];
  }

  selectItem(platform: StaticObject | null) {
    if (this.selected) this.selected.color = this.prevColor;

    if (!platform || platform.isFloor) {
      return (this.selected = null);
    }

    this.selected = platform as Platform;
    this.items.map((p) => {
      if (p === platform) {
        this.selected = platform as Platform;
        this.prevColor = p.color;
        p.color = "pink";
      }
    });
  }

  dragItem({ x, y }: Coordinates) {
    if (!this.selected) return;
    this.selected.vector.position.x = x;
    this.selected.vector.position.y = y;
  }

  handleCreate(coor: Coordinates) {
    this.items.push(
      new Platform({
        x: coor.x - 50,
        y: coor.y - 20,
        width: 100,
        height: 40,
        color: "springgreen",
      })
    );
  }

  handleDelete() {
    if (this.selected) {
      const index = this.items.indexOf(this.selected);
      this.items.splice(index, 1);
    }
    this.selected = null;
  }

  handlePlus() {
    if (this.selected) {
      this.selected.vector.width += 10;
    }
  }

  handleMinus() {
    if (this.selected && this.selected.vector.width > 10) {
      this.selected.vector.width -= 10;
    }
  }
}
