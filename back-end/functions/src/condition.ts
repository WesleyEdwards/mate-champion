import {z, ZodType, ZodTypeDef} from "zod"

export declare type Condition<T> =
  | {equal: T}
  | {inside: T[]}
  | {or: Array<Condition<T>>}
  | {and: Array<Condition<T>>}
  | {always: true}
  | {never: true}
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
