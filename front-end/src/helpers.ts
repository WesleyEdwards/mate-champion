import _ from "lodash"
import {LevelMap} from "./game/loopShared/models"

export function camelCaseToTitleCase(str: string) {
  return str.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
    return str.toUpperCase()
  })
}

const doNotUpdateKeys = ["_id"]

export const getLevelDiff = (
  original: LevelMap,
  override: Partial<LevelMap>
): Partial<LevelMap> => {
  return Object.entries(override).reduce((acc, [k, v]) => {
    if (doNotUpdateKeys.includes(k)) {
      return acc
    }
    if (objectsAreDifferent(original[k], v)) {
      ;(acc as any)[k] = v
    }
    return acc
  }, {} as Partial<LevelMap>)
}

export const objectsAreDifferent = <T>(a: T, b: T) => {
  const areDiff = !_.isEqual(a, b)
  return !_.isEqual(a, b)
}
