import {z, ZodType} from "zod"

export type Infer<T extends ZodType> = z.infer<T>

export const userTypeSchema = z.enum(["User", "Admin"])
export const coordinates = z.object({x: z.number(), y: z.number()})

export const coors = z.array(z.number()).length(2)

export type UserType = z.infer<typeof userTypeSchema>
