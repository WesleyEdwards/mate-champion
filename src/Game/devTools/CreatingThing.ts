import { Platform } from "../Platform/Platform";
import { Coordinates } from "../models";

export type CreatorItem = Platform;

export type ItemType = "platform" | "floor";

export interface CreatingThing<T extends CreatorItem> {
  itemType: ItemType;
  items: T[];
  selected: T | null;
  selectItem: (item: T | null) => void;
  dragItem: (coor: Coordinates) => void;
  handleCreate: (coor: Coordinates) => void;
  handleDelete: () => void;
  handlePlus: () => void;
  handleMinus: () => void;
}
