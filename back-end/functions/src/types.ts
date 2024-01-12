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
    admin: z.boolean().default(false)
  })
  .merge(baseObjectSchema)

const scoreSchema = z
  .object({
    userId: z.string({required_error: "User Id required"}),
    score: z.number({required_error: "Score required"})
  })
  .merge(baseObjectSchema)

export type User = z.infer<typeof userSchema>
export type Score = z.infer<typeof scoreSchema>

type Schemas = typeof userSchema | typeof scoreSchema

export type SchemaType = "score" | "user"

export const schemaMap: Record<SchemaType, Schemas> = {
  user: userSchema,
  score: scoreSchema
}

export type DbObject<T extends SchemaType> = T extends "score"
  ? Score
  : T extends "user"
  ? User
  : never
