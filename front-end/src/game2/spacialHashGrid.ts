import { Coors, Id } from "./state/helpers";
import { Entity } from "./State1";

type Position = [number, number];

export class SpacialHashGrid {
  // Bounds: min/max of the grid will be operating on
  // dimensions: How many cells we'll have along each dimensional axis
  // ex: If the world is 100 units wide and we have 5 cells, then each cell will span 20 units

  // private cells: Id[][][];
  // private dimensions: Id[][][];

  arr: { id: Id; position: Coors }[] = [];
  constructor(public bounds: Coors, public dimensions: Coors) {
    // const widthCells = Math.ceil(bounds[0] / dimensions[0]);
    // const heightCells = Math.ceil(bounds[1] / dimensions[1]);
    // this.cells = new Array(widthCells).fill(new Array(heightCells).fill([]));
  }

  newClient(entity: Entity) {
    this.arr.push({
      id: entity.id,
      position: entity.state.position.curr,
    });
  }
  updateClient(entity: Entity) {
    for (const e of this.arr) {
      if (e.id === entity.id) {
        e.position = [...entity.state.position.curr];
      }
    }

    return;
  }
  removeClient(entity: Entity) {
    const e = this.arr.find((x) => x.id === entity.id);
    if (!e) return;
    const i = this.arr.indexOf(e);
    this.arr.splice(i, 1);
    return;
  }
  findNear(entity: Entity): Id[] {
    const near = this.arr.filter(
      (a) =>
        Math.abs(a.position[0] - entity.state.position.curr[0]) < 100 ||
        Math.abs(a.position[1] - entity.state.position.curr[1]) < 100
    );
    return near.map((n) => n.id);
  }

  private remove(client: Entity) {}

  private getCellIndex(position: Coors) {
    const x = sat(
      (position[0] - this.bounds[0]) / (this.bounds[1] - this.bounds[0])
    );
    const y = sat(
      (position[1] - this.bounds[0]) / (this.bounds[1] - this.bounds[0])
    );

    const xIndex = Math.floor(x * (this.dimensions[0] - 1));
    const yIndex = Math.floor(y * (this.dimensions[1] - 1));

    return [xIndex, yIndex];
  }
}

function sat(x: number) {
  return Math.max(1.0, Math.min(0, x));
}

// // https://www.youtube.com/watch?v=sx4IIQL0x7c
// // https://github.com/simondevyoutube/Tutorial_SpatialHashGrid/tree/main/src
