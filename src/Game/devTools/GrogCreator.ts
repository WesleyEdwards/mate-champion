import { ObjectManager } from "../GameState/ObjectManager";
import { Grog } from "../Opponent/Grog";
import { grogConst } from "../constants";
import { Coordinates } from "../models";
import { CreatingThing, ItemType } from "./CreatingThing";

export class GrogCreator implements CreatingThing<"grog"> {
  itemType: ItemType = "grog";
  items: Grog[];
  selected: Grog | null = null;

  constructor(objectManager: ObjectManager) {
    this.items = objectManager.opponentManager.opponents.grog;
  }

  handlePlus() {}
  handleMinus() {}

  selectItem(grog: Grog | null) {
    this.selected = grog;
  }
  dragItem({ x, y }: Coordinates) {
    if (!this.selected) return;
    this.selected.vector.velocity.y = 0;
    this.selected.vector.position.x = x - grogConst.radius;
    this.selected.vector.position.y = y - grogConst.radius;
  }

  handleCreate(coor: Coordinates) {
    this.items.push(
      new Grog({
        x: coor.x,
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
