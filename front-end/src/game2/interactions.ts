import { Champ1, ChampState } from "./champ";
import { processChampActionRaw } from "./state/champ/actions";
import { Coors } from "./state/helpers";
import { Entity } from "./State1";

/**
 * @param entity The entity that may collide with the floor
 * @param floor Floor to check
 * @returns the Y position where the entity should be set. Null if no collision.
 */
export function calcPlatEntityCollision(
  entity: Entity,
  floor: Entity
): number | null {
  const betweenCenterAndEdgeX = entity.state.dimensions[0] / 2;
  const cx = entity.state.position.curr[0];
  if (
    cx + betweenCenterAndEdgeX < floor.state.position.curr[0] ||
    cx - betweenCenterAndEdgeX >
      floor.state.position.curr[0] + floor.state.dimensions[0]
  ) {
    return null;
  }

  const betweenCenterAndBottom = entity.state.dimensions[1] / 2;

  const previous = entity.state.position.prev[1] + betweenCenterAndBottom;
  const recent = entity.state.position.curr[1] + betweenCenterAndBottom;

  if (
    recent >= floor.state.position.curr[1] &&
    previous <= floor.state.position.curr[1]
  ) {
    const setY = floor.state.position.curr[1] - betweenCenterAndBottom;
    console.log(setY);
    entity.state.position.curr[1] = entity.state.position.curr[1];
    return setY;
  }
  return null;
}
