import { ObjectManager } from "../GameState/ObjectManager";
import { Grog } from "../Opponent/Grog";
import { Coordinates } from "../models";
import { ContentEvent, CreatingThing, ItemType } from "./CreatingThing";

export class GrogCreator implements CreatingThing<"grog"> {
  itemType: ItemType = "grog";
  items: Grog[];
  selected: Grog[] = [];

  constructor(objectManager: ObjectManager) {
    this.items = objectManager.opponentManager.opponents.grog;
  }

  unSelectAll() {
    this.selected.splice(0, this.selected.length);
  }

  selectItem(grog: Grog | null, multiple?: boolean) {
    if (grog && this.selected.includes(grog)) return;

    if (!grog) return this.unSelectAll();

    if (!multiple && this.selected.length > 0) {
      this.unSelectAll();
    }

    this.items.forEach((g) => {
      if (g === grog) this.selected.push(g);
    });
  }

  selectItems(grogs: Grog[]) {
    this.unSelectAll();
    grogs.forEach((g) => {
      this.selected.push(g);
    });
  }

  handleEvent(
    event: ContentEvent,
    coor?: Coordinates | undefined,
    shiftKey?: boolean
  ) {
    if (event === "delete") return this.handleDelete();

    if (!coor) return console.log("no coor");
    if (event === "drag") {
      return this.dragItem(coor);
    }

    if (event === "create") {
      return this.handleCreate(coor);
    }
  }

  dragItem({ x, y }: Coordinates) {
    if (!this.selected) return;
    this.selected.forEach((g) => {
      g.vector.position.x += x;
      g.vector.position.y += y;
    });
  }

  handleCreate(initPos: Coordinates) {
    this.items.push(new Grog({ initPos, moveSpeed: 0.07 }));
  }
  handleDelete() {
    this.selected.forEach((g) => {
      const index = this.items.indexOf(g);
      this.items.splice(index, 1);
    });
    this.selected = [];
  }
}
