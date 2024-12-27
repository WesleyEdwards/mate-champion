import {AddableEntity} from "../../components/GameEdit/CourseBuilderSettings"
import {Ammo} from "../entities/Ammo"
import {Entity} from "../entities/Entity"
import {CurrAndPrev, Coors, EntityOfType} from "../entities/entityTypes"
import {Groog} from "../entities/groog"
import {InfoText} from "../entities/infoText"
import {Floor, Platform} from "../entities/platform"

export const copyEntity = (
  e: Entity,
  copyOfWithOffset?: (coors: CurrAndPrev) => Coors
): Entity => {
  if (
    e.typeId === "endGate" ||
    e.typeId === "player" ||
    e.typeId === "floor" ||
    e.typeId === "infoText" ||
    e.typeId === "bullet"
  ) {
    console.error("Trying to duplicate", e, copyOfWithOffset)
    return new InfoText({color: "", initPosition: [0, 0], message: ""})
    // throw new Error("You shouldn't have to copy these.")
  }

  const map: {
    [K in AddableEntity]: (old: EntityOfType[K]) => EntityOfType[K]
  } = {
    groog: (old) =>
      new Groog({
        moveSpeed: old.velocity[0],
        position: copyOfWithOffset?.(old.position) ?? old.position.curr,
        timeBetweenJump: old.state.timeBetweenJump,
        timeBetweenTurn: old.state.timeBetweenTurn
      }),
    floor: (old) =>
      new Floor({
        startX: old.posLeft,
        width: old.width
      }),
    platform: (old) =>
      new Platform({
        color: old.color,
        dimensions: [old.width, old.height],
        position: copyOfWithOffset?.(old.position) ?? old.position.curr
      }),
    ammo: (old) =>
      new Ammo(copyOfWithOffset?.(old.position) ?? old.position.curr)
  }
  return map[e.typeId](e as never)
}
