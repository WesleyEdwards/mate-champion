import {v4 as uuidv4} from "uuid"
import {z, ZodObject, ZodRawShape, ZodType} from "zod"

const baseObjectSchema = z.object({
  _id: z.string().uuid().default(uuidv4)
})

export const createDbObject = <T extends ZodRawShape>(
  fun: (zod: typeof z) => ZodObject<T>
) => fun(z).merge(baseObjectSchema)

export const createSchema = <T extends ZodRawShape>(
  fun: (zod: typeof z) => ZodObject<T>
) => fun(z)

export type Infer<T extends ZodType> = z.infer<T>

export const userTypeSchema = z.enum(["User", "Admin"])
export const coordinates = z.object({x: z.number(), y: z.number()})

export const coors = z.array(z.number()).length(2)

// this will have the same _id as the associated level
export const levelMapSchema = createDbObject((z) =>
  z.object({
    champInitPos: coors.default([400, 400]),
    packages: coors.array().default([]),
    endPosition: z.number().default(4500),
    groog: z
      .object({
        position: coors,
        moveSpeed: z.number(),
        timeBetweenJump: z.number().optional().default(2000),
        timeBetweenTurn: z.number().optional().default(3000)
      })
      .array()
      .default([]),
    platformColor: z.string().default("springgreen"),
    platforms: z
      .object({
        dimensions: coors,
        position: coors,
        color: z.string().nullable().default(null)
      })
      .array()
      .default([]),
    floors: z
      .object({
        x: z.number(),
        width: z.number(),
        color: z.string()
      })
      .array()
      .default([])
  })
)

export type UserType = z.infer<typeof userTypeSchema>
export type LevelMap = z.infer<typeof levelMapSchema>
