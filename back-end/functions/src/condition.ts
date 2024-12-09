import {Filter} from "mongodb"
import {z} from "zod"
import {SafeParsable} from "./request_body"

export type Condition<T> =
  | {always: true}
  | {never: true}
  | {equal: T}
  | {inside: T[]}
  | {or: Array<Condition<T>>}
  | {and: Array<Condition<T>>}
  | {listAnyElement: T extends (infer U)[] ? Condition<U> : never}
  | (keyof T extends never ? never : {[P in keyof T]?: Condition<T[P]>})

const errorMessage = (message: string) =>
  ({success: false, error: {message}} as const)

type SF<T> = ReturnType<SafeParsable<T>["safeParse"]>
export const createConditionSchema = <T>(
  schema: z.ZodType<T, any, any>
): SafeParsable<T> => {
  return {
    safeParse: (body: any) => {
      if (
        typeof body !== "object" ||
        body === null ||
        body === undefined ||
        Array.isArray(body)
      ) {
        return errorMessage("Invalid condition type")
      }

      const bodyKeys = Object.keys(body)
      if (bodyKeys.length !== 1) {
        return errorMessage("Single key expected")
      }

      const key = bodyKeys[0]

      if (key === "always" || key === "never") {
        return z.object({[key]: z.literal(true)}).safeParse(body) as SF<T>
      }

      if (key === "equal") {
        return z.object({equal: schema}).safeParse(body) as SF<T>
      }
      if (key === "inside") {
        return z.object({inside: schema.array()}).safeParse(body) as SF<T>
      }
      if (key === "listAnyElement") {
        if (schema instanceof z.ZodArray) {
          const others = createConditionSchema(schema.element)
          if (others.safeParse(body[key]).success === false) {
            return errorMessage("invalid condition")
          }
          return z
            .object({listAnyElement: z.any(body[key])})
            .safeParse(body) as SF<T>
        }
      }

      if (key === "and" || key === "or") {
        if (!Array.isArray(body[key])) {
          return errorMessage("invalid condition")
        }
        const others = createConditionSchema(schema)
        for (const item of body[key]) {
          if (others.safeParse(item).success === false) {
            return errorMessage("invalid condition")
          }
        }
        return z
          .object({[key]: z.any({[key]: body[key]})})
          .safeParse(body) as SF<T>
      }

      if (schema instanceof z.ZodObject) {
        const valueKeys = zodKeys(schema)
        if (!valueKeys.includes(key)) {
          return errorMessage("Invalid condition")
        }

        const subSchema = createConditionSchema(schema.shape[key])
        if (subSchema.safeParse(body[key]).success === false) {
          return errorMessage("invalid condition")
        }
        return z.object({[key]: z.any(body[key])}).safeParse(body) as SF<T>
      }
      return errorMessage("Invalid condition")
    }
  }
}

const zodKeys = <T extends z.ZodTypeAny>(schema: T): string[] => {
  if (schema === null || schema === undefined) return []
  if (schema instanceof z.ZodNullable || schema instanceof z.ZodOptional)
    return zodKeys(schema.unwrap())
  if (schema instanceof z.ZodArray) return []
  if (schema instanceof z.ZodObject) {
    return Object.keys(schema.shape)
  }
  return []
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
