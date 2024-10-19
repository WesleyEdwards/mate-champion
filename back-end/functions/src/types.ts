import {v4 as uuidv4} from "uuid"
import {z} from "zod"

export const baseObjectSchema = z.object({
  _id: z.string().uuid().default(uuidv4)
})

export const userTypeSchema = z.enum(["User", "Admin"])

export const userSchema = z
  .object({
    name: z.string({required_error: "Name is required"}),
    email: z
      .string() //{required_error: "Email is required"}
      .email({message: "Invalid email"})
      .optional(),
    passwordHash: z.string(),
    highScore: z.number().default(0),
    userType: userTypeSchema.default("User")
  })
  .merge(baseObjectSchema)

export const scoreSchema = z
  .object({
    userId: z.string({required_error: "User Id required"}),
    score: z.number({required_error: "Score required"})
  })
  .merge(baseObjectSchema)

export const coordinates = z.object({
  x: z.number(),
  y: z.number()
})

export const coors = z.array(z.number()).length(2)

export const levelSchema = z
  .object({
    owner: z.string(),
    public: z.boolean().default(false),
    name: z.string(),
    description: z.string().nullable().default(null),
    creatorName: z.string().default("")
  })
  .merge(baseObjectSchema)

// this will have the same _id as the associated level
export const levelMapSchema = z
  .object({
    champInitPos: coors.default([400, 400]),
    packages: coors.array().default([]),
    endPosition: z.number().default(4500),
    opponents: z
      .object({
        grog: z
          .object({
            position: coors,
            moveSpeed: z.number(),
            jumpOften: z.boolean().optional().default(false)
          })
          .array()
      })
      .default({grog: []}),
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
  .merge(baseObjectSchema)

export type UserType = z.infer<typeof userTypeSchema>
export type User = z.infer<typeof userSchema>
export type Score = z.infer<typeof scoreSchema>
export type LevelInfo = {
  owner: string
  public: boolean
  name: string
  description: string | null
  creatorName: string
  _id: string
}
export type LevelMap = z.infer<typeof levelMapSchema>

type Schemas =
  | typeof userSchema
  | typeof scoreSchema
  | typeof levelSchema
  | typeof levelMapSchema

export type SchemaType = "score" | "user" | "level" | "levelMap"

export const schemaMap: Record<SchemaType, Schemas> = {
  user: userSchema,
  score: scoreSchema,
  level: levelSchema,
  levelMap: levelMapSchema
}

export type DbObject<T extends SchemaType> = T extends "score"
  ? Score
  : T extends "user"
  ? User
  : T extends "level"
  ? LevelInfo
  : T extends "levelMap"
  ? LevelMap
  : never
