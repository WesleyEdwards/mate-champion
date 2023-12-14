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

  export type ContentEvent = "drag" | "create" | "delete" | "plus" | "minus" | "duplicate";

export interface CreatingThing<
  T extends ItemType = any,
  K extends ItemTypeToClass<T> = any
> {
  itemType: ItemType;
  items: K[];
  selected: K | K[] | null;
  selectItem: (item: K | null, multiple?: boolean) => void;
  selectItems: (items: K[]) => void;
  handleEvent: (event: ContentEvent, coor?: Coordinates) => void;
}
