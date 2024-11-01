import {Entity} from "./entities/Entity"
import {Coors, Id} from "./entities/entityTypes"

export class SpacialHashGrid {
  // Bounds: min/max of the grid will be operating on
  // dimensions: How many cells we'll have along each dimensional axis
  // ex: If the world is 100 units wide and we have 5 cells, then each cell will span 20 units

  // private cells: Id[][][];
  // private dimensions: Id[][][];

  clients: Record<Id, {position: Coors; dimensions: Coors} | undefined> = {}

  // arr: {id: Id; position: Coors}[] = []
  constructor(
    public bounds: Coors,
    public dimensions: Coors
  ) {
    // const widthCells = Math.ceil(bounds[0] / width);
    // const heightCells = Math.ceil(bounds[1] / height);
    // this.cells = new Array(widthCells).fill(new Array(heightCells).fill([]));
  }

  newClient(entity: Entity) {
    this.clients[entity.id] = {
      position: [...entity.position.curr],
      dimensions: [...entity.dimensions]
    }
  }

  updateClient(entity: Entity) {
    this.clients[entity.id] = {
      position: [...entity.position.curr],
      dimensions: [...entity.dimensions]
    }
  }

  removeClient(entity: Entity) {
    this.clients[entity.id] = undefined
  }
  findNear(entity: Entity): Id[] {
    const near = Object.entries(this.clients).reduce<Id[]>((acc, [id, a]) => {
      if (!a) return acc

      if (
        Math.abs(a.position[0]) - Math.abs(entity.posLeft) < 100 ||
        Math.abs(a.position[1]) - Math.abs(entity.position.curr[1]) < 100
      ) {
        acc.push(id)
      }
      return acc
    }, [])
    return near
  }

  dropAll() {
    this.clients = {}
  }

  private getCellIndex(position: Coors) {
    const x = sat(
      (position[0] - this.bounds[0]) / (this.bounds[1] - this.bounds[0])
    )
    const y = sat(
      (position[1] - this.bounds[0]) / (this.bounds[1] - this.bounds[0])
    )

    const xIndex = Math.floor(x * (this.dimensions[0] - 1))
    const yIndex = Math.floor(y * (this.dimensions[1] - 1))

    return [xIndex, yIndex]
  }
}

function sat(x: number) {
  return Math.max(1.0, Math.min(0, x))
}

// // https://www.youtube.com/watch?v=sx4IIQL0x7c
// // https://github.com/simondevyoutube/Tutorial_SpatialHashGrid/tree/main/src
