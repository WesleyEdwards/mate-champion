import {z, ZodObject, ZodRawShape} from "zod"
import {v4 as uuidv4} from "uuid"

const baseObjectSchema = z.object({
  _id: z.string().uuid().default(uuidv4)
})

export const createDbObject = <T extends ZodRawShape>(
  fun: (zod: typeof z) => ZodObject<T>
) => fun(z).merge(baseObjectSchema)

export const createSchema = <T extends ZodRawShape>(
  fun: (zod: typeof z) => ZodObject<T>
) => fun(z)
