import {Filter} from "mongodb"
import {z, ZodType, ZodTypeDef} from "zod"

export type Condition<T> =
  | {equal: T}
  | {inside: T[]}
  | {or: Array<Condition<T>>}
  | {and: Array<Condition<T>>}
  | {always: true}
  | {never: true}
  | {listAnyElement: T extends (infer U)[] ? Condition<U> : never}
  | (keyof T extends never ? never : {[P in keyof T]?: Condition<T[P]>})

// Recursive type definition
export const createCondition = <T extends ZodType<any, any, any>>(
  schema: T
): ZodType<
  | {equal: z.infer<T>}
  | {inside: z.infer<T>[]}
  | {or: Array<z.infer<ZodType>>}
  | {and: Array<z.infer<ZodType>>}
  | {always: true}
  | Partial<Record<string, any>>,
  ZodTypeDef,
  any
> => {
  const condition: ZodType<any> = z.lazy(() =>
    z.union([
      z.object({equal: schema}),
      z.object({inside: z.array(schema)}),
      z.object({or: z.array(condition)}),
      z.object({and: z.array(condition)}),
      z.object({always: z.literal(true)}),
      z.object({never: z.literal(true)}),
      z.record(z.string(), condition) // Handles the recursive object case
    ])
  )
  return condition
}

export function evalCondition<T>(item: T, condition: Condition<T>): boolean {
  if ("never" in condition) {
    return false
  }

  if ("always" in condition) {
    return true
  }

  if ("equal" in condition) {
    return condition.equal === item
  }

  if ("inside" in condition) {
    return condition.inside.some((i) => areEqual(item, i))
  }

  if ("or" in condition) {
    return condition.or.some((orCondition) => evalCondition(item, orCondition))
  }

  if ("and" in condition) {
    return condition.and.every((andCondition) =>
      evalCondition(item, andCondition)
    )
  }
  if ("listAnyElement" in condition) {
    if (!Array.isArray(item)) throw new Error("Invalid condition")
    return item.some((value) => evalCondition(value, condition.listAnyElement))
  }

  if (
    typeof item === "object" &&
    typeof condition === "object" &&
    item !== null
  ) {
    return Object.entries(condition).every(([key, subCondition]) => {
      const itemValue = (item as any)[key]
      return (
        itemValue !== undefined &&
        evalCondition(itemValue, subCondition as Condition<any>)
      )
    })
  }

  return false
}

const areEqual = (a: any, b: any): boolean => {
  if (typeof a !== typeof b) return false
  if (typeof a === "object") {
    return JSON.stringify(a) === JSON.stringify(b)
  }
  return a === b
}

export function conditionToFilter<T>(condition: Condition<T>): Filter<T> {
  const acc: Filter<T> = {}

  if ("equal" in condition) {
    return condition.equal as Filter<T>
  }
  if ("inside" in condition) {
    return {$in: condition.inside} as Filter<T>
  }
  if ("never" in condition) {
    return {_id: false} as Filter<T>
  }
  if ("or" in condition) {
    acc.$or = condition.or.map((cond) => conditionToFilter(cond)) as any
    return acc
  }

  if ("and" in condition) {
    acc.$and = condition.and.map((cond) => conditionToFilter(cond)) as any
    return acc
  }

  if ("always" in condition) {
    if (condition.always) {
      return acc
    } else {
      throw new Error("Invalid 'always' condition. It must be true.")
    }
  }

  if ("listAnyElement" in condition) {
    return conditionToFilter(condition.listAnyElement) as any
  }

  for (const key in condition) {
    const value = condition[key]

    if (key === "equal" || key === "or" || key === "and" || key === "always") {
      continue
    }

    if (value && typeof value === "object") {
      acc[key as keyof Filter<T>] = conditionToFilter(value as any)
    }
  }

  return acc
}
