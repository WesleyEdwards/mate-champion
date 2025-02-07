import _ from "lodash"
import {LevelMap} from "./api/types"

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

export async function catchError<T>(
  promise: Promise<T>
): Promise<[undefined, T] | [Error]> {
  return promise
    .then((res) => [undefined, res] satisfies [undefined, T])
    .catch(async (error) => {
      if (error instanceof Response) {
        const errorJson = await error.json()
        return [new Error(errorJson.message)]
      }
      return [error]
    })
}
