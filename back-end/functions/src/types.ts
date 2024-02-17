import {v4 as uuidv4} from "uuid"
import {z} from "zod"

const baseObjectSchema = z.object({
  _id: z.string().default(uuidv4),
  createdAt: z.string().default(new Date().toISOString()),
  updatedAt: z.string().default(new Date().toISOString())
})

const userSchema = z
  .object({
    name: z.string({required_error: "Name is required"}),
    email: z
      .string() //{required_error: "Email is required"}
      .email({message: "Invalid email"})
      .optional(),
    passwordHash: z.string(),
    highScore: z.number().default(0),
    userType: z.enum(["User", "Editor", "Admin"]).default("User")
  })
  .merge(baseObjectSchema)

const scoreSchema = z
  .object({
    userId: z.string({required_error: "User Id required"}),
    score: z.number({required_error: "Score required"})
  })
  .merge(baseObjectSchema)

const coordinates = z.object({
  x: z.number(),
  y: z.number()
})

const levelSchema = z
  .object({
    owner: z.string(),
    public: z.boolean().default(false),
    name: z.string(),
    creatorName: z.string().default(""),
    packages: coordinates.array().default([]),
    opponents: z
      .object({
        grog: z
          .object({
            initPos: coordinates,
            moveSpeed: z.number(),
            jumpOften: z.boolean().optional().default(false)
          })
          .array()
      })
      .default({grog: []}),
    platforms: z
      .object({
        x: z.number(),
        y: z.number(),
        width: z.number(),
        height: z.number(),
        color: z.string()
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

export type User = z.infer<typeof userSchema>
export type Score = z.infer<typeof scoreSchema>
export type LevelInfo = z.infer<typeof levelSchema>

type Schemas = typeof userSchema | typeof scoreSchema | typeof levelSchema

export type SchemaType = "score" | "user" | "level"

export const schemaMap: Record<SchemaType, Schemas> = {
  user: userSchema,
  score: scoreSchema,
  level: levelSchema
}

export type DbObject<T extends SchemaType> = T extends "score"
  ? Score
  : T extends "user"
  ? User
  : T extends "level"
  ? LevelInfo
  : never
