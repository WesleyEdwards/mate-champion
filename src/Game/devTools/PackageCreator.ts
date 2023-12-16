import { Package } from "../Bullet/Package";
import { ObjectManager } from "../GameState/ObjectManager";
import { packageConst } from "../constants";
import { Coordinates } from "../models";
import { ContentEvent, CreatingThing, ItemType } from "./CreatingThing";

export class PackageCreator implements CreatingThing<"package"> {
  itemType: ItemType = "package";
  packages: Package[];
  selected: Package[] | null = null;

  constructor(objectManager: ObjectManager) {
    this.packages = objectManager.matePackManager.packages;
  }

  get items() {
    return this.packages;
  }

  selectItem(matePackage: Package | null) {
    this.selected = matePackage ? [matePackage] : null;
  }

  selectItems(packages: Package[]) {
    this.selected = packages;
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
    this.selected.forEach((matePackage) => {
      matePackage.vector.position.x = x;
      matePackage.vector.position.y = y;
    });
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
      this.selected.forEach((matePackage) => {
        const index = this.packages.indexOf(matePackage);
        this.packages.splice(index, 1);
      });
    }
    this.selected = null;
  }
}