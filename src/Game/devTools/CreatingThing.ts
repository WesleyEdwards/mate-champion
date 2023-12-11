import { Grog } from "../Opponent/Grog";
import { Platform } from "../Platform/Platform";
import { Coordinates } from "../models";

export type CreatorItem = Platform | Grog;

export type ItemType = "platform" | "floor" | "grog" | "package";

type ItemTypeToClass<T extends ItemType> = T extends "platform"
  ? Platform
  : T extends "floor"
  ? Platform
  : T extends "grog"
  ? Grog
  : never;

export interface CreatingThing<
  T extends ItemType = any,
  K extends ItemTypeToClass<T> = any
> {
  itemType: ItemType;
  items: K[];
  selected: K | null;
  selectItem: (item: K | null) => void;
  dragItem: (coor: Coordinates) => void;
  handleCreate: (coor: Coordinates) => void;
  handleDelete: () => void;
  handlePlus: () => void;
  handleMinus: () => void;
}
