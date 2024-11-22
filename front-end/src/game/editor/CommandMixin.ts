import {Entity} from "../entities/Entity"
import {Coors, Id} from "../entities/entityTypes"
import {incrementPosition, toRounded} from "./editHelpers"
import {GameEditConstructor} from "./GameEdit"

export type EditEvent =
  | {
      type: "add"
      entities: Entity[]
    }
  | {
      type: "move"
      entities: Set<Id>
      delta: Coors
    }
  | {
      type: "remove"
      entities: Entity[]
    }
  | {
      type: "resize"
      old: Entity
      entityId: Id
      proposed: Entity
    }

export function CommandStackMixin<TBase extends GameEditConstructor>(
  Base: TBase
) {
  return class extends Base {
    events: EditEvent[] = []
    undoneEvents: EditEvent[] = []

    command(event: EditEvent) {
      this.handleCommand(event)
      this.events.push(event)
      this.undoneEvents.length = 0
    }

    undo() {
      const mostRecent = this.events.pop()
      if (mostRecent) {
        this.undoCommand(mostRecent)
        this.undoneEvents.push(mostRecent)
      }
    }

    redo() {
      const undone = this.undoneEvents.pop()
      if (undone) {
        this.handleCommand(undone)
        this.events.push(undone)
      }
    }

    private handleCommand(event: EditEvent) {
      const map: {
        [K in EditEvent["type"]]: (
          action: Extract<EditEvent, {type: K}>
        ) => void
      } = {
        add: (event) => {
          this.selectedEntities.clear()
          for (const entity of event.entities) {
            this.entities.push(entity)
            this.selectedEntities.add(entity.id)
          }
        },
        move: (event) => {
          this.moveEntities(event)
        },
        resize: (event) => {
          const currE = this.entities.find((e) => e.id === event.entityId)
          if (currE) {
            currE.dimensions = [...event.proposed.dimensions]
            currE.position.curr = [...event.proposed.position.curr]
          }
        },
        remove: (event) => {
          const toDelete = new Set(event.entities.map((e) => e.id))
          this.entities = this.entities.filter((e) => !toDelete.has(e.id))
        }
      }
      map[event.type](event as never)
    }

    private undoCommand(event: EditEvent) {
      const map: {
        [K in EditEvent["type"]]: (
          action: Extract<EditEvent, {type: K}>
        ) => void
      } = {
        add: (event) => {
          this.entities = this.entities.filter(
            (e) => !event.entities.includes(e)
          )
        },
        move: (event) => {
          const diff: Coors = [-event.delta[0], -event.delta[1]]
          this.moveEntities({delta: diff, entities: event.entities})
        },
        resize: (event) => {
          const currE = this.entities.find((e) => e.id === event.entityId)
          if (currE) {
            currE.dimensions = [...event.old.dimensions]
            currE.position.curr = [...event.old.position.curr]
          }
        },
        remove: (event) => {
          for (const entity of event.entities) {
            this.entities.push(entity)
          }
        }
      }
      map[event.type](event as never)
    }

    moveEntities = (event: {entities: Set<Id>; delta: Coors}) => {
      const diff = event.delta
      for (const entityId of event.entities) {
        const e = this.fromId(entityId)
        if (!e) continue
        const d: Coors =
          e.typeId === "floor" || e.typeId === "endGate"
            ? [diff[0], 0]
            : [...diff]
        incrementPosition(e.position.curr, d)
      }

      for (const entity of this.entities) {
        entity.position.curr = toRounded([...entity.position.curr])
      }
    }
  }
}
