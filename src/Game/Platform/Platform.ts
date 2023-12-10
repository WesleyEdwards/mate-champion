import { platformConst, playerConst } from "../constants";
import { DrawObjProps } from "../helpers/types";
import { StaticObject } from "../models";
import {
  ObjVectorManager,
  ObjVectorManagerProps,
} from "../VectorManager/ObjVectorManager";

export type FloorType = {
  x: number;
  width: number;
  color: string;
};

export type FloatingType = {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};

type PlatProps = FloorType | FloatingType;

function isFloating(props: PlatProps): props is FloatingType {
  return "y" in props && "height" in props;
}
function isFloatingBool(props: PlatProps): boolean {
  return "y" in props && "height" in props;
}

function createObjVectorProps(props: PlatProps): ObjVectorManagerProps {
  if (isFloating(props)) {
    const { x, y, width, height } = props;
    return { pos: { x, y }, width, height };
  } else {
    const { x, width } = props;
    return {
      pos: { x, y: platformConst.floorY },
      width,
      height: platformConst.floorHeight,
    };
  }
}

export class Platform implements StaticObject {
  color: string;
  vector: ObjVectorManager;
  isFloor: boolean;

  constructor(params: PlatProps) {
    this.vector = new ObjVectorManager(createObjVectorProps(params));
    this.color = params.color;
    this.isFloor = !isFloatingBool(params);
  }

  draw({ cxt, offsetX }: DrawObjProps) {
    cxt.fillStyle = this.color;
    cxt.strokeStyle = "black";
    cxt.lineWidth = 8;

    cxt.strokeRect(
      this.vector.posX - offsetX,
      this.vector.posY + 4,
      this.vector.width,
      this.vector.height
    );
    cxt.fillRect(
      this.vector.posX - offsetX,
      this.vector.posY + 4,
      this.vector.width,
      this.vector.height
    );
  }
}
