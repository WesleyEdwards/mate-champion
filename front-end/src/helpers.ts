import _ from "lodash"
import {FullLevelInfo, LevelInfo, LevelMap} from "./game/loopShared/models"

export function camelCaseToTitleCase(str: string) {
  return str.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
    return str.toUpperCase()
  })
}

function isKeyofLevelInfo(key: string): key is keyof LevelInfo {
  return ["description", "owner", "public", "creatorName", "name"].includes(key)
}

const doNotUpdateKeys = ["_id", "createdAt", "updatedAt"]

export const getLevelDiff = (
  original: FullLevelInfo,
  override: FullLevelInfo
): {details: Partial<LevelInfo>; map: Partial<LevelMap>} => {
  return Object.entries(override).reduce(
    (acc, [k, v]) => {
      if (doNotUpdateKeys.includes(k)) {
        return acc
      }
      // @ts-ignore
      if (objectsAreDifferent(original[k], v)) {
        if (isKeyofLevelInfo(k)) {
          ;(acc.details as any)[k] = v
        } else {
          ;(acc.map as any)[k] = v
        }
      }
      return acc
    },
    {details: {} as Partial<LevelInfo>, map: {} as Partial<LevelMap>}
  )
}

export const objectsAreDifferent = <T>(a: T, b: T) => {
  return !_.isEqual(a, b)
}

export const getDetailsAndMap = (
  level: FullLevelInfo
): {details: LevelInfo; map: LevelMap} => {
  return Object.entries(level).reduce(
    (acc, [k, v]) => {
      if (isKeyofLevelInfo(k)) {
        ;(acc.details as any)[k] = v
      } else {
        ;(acc.map as any)[k] = v
      }
      return acc
    },
    {details: {} as LevelInfo, map: {} as LevelMap}
  )
}
