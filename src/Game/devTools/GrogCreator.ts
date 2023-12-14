import { ObjectManager } from "../GameState/ObjectManager";
import { Grog } from "../Opponent/Grog";
import { grogConst } from "../constants";
import { Coordinates } from "../models";
import { ContentEvent, CreatingThing, ItemType } from "./CreatingThing";

export class GrogCreator implements CreatingThing<"grog"> {
  itemType: ItemType = "grog";
  items: Grog[];
  selected: Grog | null = null;

  constructor(objectManager: ObjectManager) {
    this.items = objectManager.opponentManager.opponents.grog;
  }

  selectItem(grog: Grog | null) {
    this.selected = grog;
  }

  selectItems(grogs: Grog[]) {
    throw new Error("Method not implemented.");
  }

  handleEvent(event: ContentEvent, coor?: Coordinates | undefined) {
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
    this.selected.vector.velocity.y = 0;
    this.selected.vector.position.x = x;
    this.selected.vector.position.y = y;
  }

  handleCreate(coor: Coordinates) {
    this.items.push(
      new Grog({
        initPos: { x: coor.x - grogConst.radius, y: coor.y - grogConst.radius },
        moveSpeed: 0,
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
}
