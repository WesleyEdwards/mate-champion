import { Package } from "../Bullet/Package";
import { ObjectManager } from "../GameState/ObjectManager";
import { packageConst } from "../constants";
import { Coordinates } from "../models";
import { CreatingThing, ItemType } from "./CreatingThing";

export class PackageCreator implements CreatingThing<"package"> {
  itemType: ItemType = "package";
  packages: Package[];
  selected: Package | null = null;

  constructor(objectManager: ObjectManager) {
    this.packages = objectManager.matePackManager.packages;
  }

  handlePlus() {}
  handleMinus() {}

  get items() {
    return this.packages;
  }

  selectItem(matePackage: Package | null) {
    this.selected = matePackage;
  }
  dragItem({ x, y }: Coordinates) {
    if (!this.selected) return;
    this.selected.vector.position.x = x;
    this.selected.vector.position.y = y;
  }

  handleCreate(coor: Coordinates) {
    this.packages.push(
      new Package({
        x: coor.x - packageConst.width / 2,
        y: coor.y - packageConst.height / 2,
      })
    );
  }
  handleDelete() {
    if (this.selected) {
      const index = this.packages.indexOf(this.selected);
      this.packages.splice(index, 1);
    }
    this.selected = null;
  }
}
