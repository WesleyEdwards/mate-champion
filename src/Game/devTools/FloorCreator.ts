import { ObjectManager } from "../GameState/ObjectManager";
import { Platform } from "../Platform/Platform";
import { Coordinates, StaticObject } from "../models";
import { ContentEvent, CreatingThing, ItemType } from "./CreatingThing";

export class FloorCreator implements CreatingThing<"platform"> {
  selected: Platform | null = null;
  platforms: Platform[];
  prevColor: string = "";
  itemType: ItemType = "floor";

  constructor(objectManager: ObjectManager) {
    this.platforms = objectManager.platformManager.platforms as Platform[];
  }

  get items() {
    return this.platforms.filter((p) => p.isFloor) as Platform[];
  }

  selectItem(platform: StaticObject | null) {
    if (this.selected) this.selected.color = this.prevColor;

    if (!platform || !(platform instanceof Platform)) {
      return (this.selected = null);
    }
    this.selected = platform;
    this.platforms.map((p) => {
      if (p === platform) {
        this.selected = platform;
        this.prevColor = p.color;
        p.color = "pink";
      }
    });
  }

  handleEvent(event: ContentEvent, coor?: Coordinates) {
    
    if (event === "delete") return this.handleDelete();
    if (event === "plus") return this.handlePlus();
    if (event === "minus") return this.handleMinus();
    
    if (!coor) return console.log("no coor");
    if (event === "drag") {
      return this.dragItem(coor);
    }

    if (event === "create") {
      return this.handleCreate(coor);
    }
  }

  dragItem({ x }: Coordinates) {
    if (!this.selected) return;
    this.selected.vector.position.x = x;
  }

  handleCreate(coor: Coordinates) {
    this.platforms.push(
      new Platform({
        x: coor.x - 50,
        width: 100,
        color: "springgreen",
      })
    );
  }

  handleDelete() {
    if (this.selected) {
      const index = this.platforms.indexOf(this.selected);
      this.platforms.splice(index, 1);
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
