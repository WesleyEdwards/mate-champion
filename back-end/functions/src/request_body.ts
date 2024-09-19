import {z, ZodIssue, ZodObject, ZodRawShape} from "zod"
import {
  DbObject,
  SchemaType,
  levelMapSchema,
  levelSchema,
  schemaMap
} from "./types"
import { ImportLevelsBody } from "./levelInfo/levelQueries"

type ParseError = {error: Partial<ZodIssue>}

export function checkValidation<T extends SchemaType>(
  schemaName: T,
  body: any
): DbObject<T> | ParseError {
  const result = schemaMap[schemaName].safeParse(body)

  return result.success
    ? (result.data as DbObject<T>)
    : {error: result.error.issues.at(0) ?? {message: "Unknown error"}}
}

export function checkValidSchema<T extends ZodRawShape>(
  body: any,
  schema: ZodObject<T>
): T | ParseError {
  const result = schema.safeParse(body)
  if (result.success) return result.data as unknown as  T
  return {error: result.error.issues.at(0) ?? {message: "Unknown error"}}
}

export function isParseError(body: any): body is ParseError {
  return "error" in body
}

export function checkPartialValidation<T extends SchemaType>(
  schemaName: T,
  body: any
): Partial<DbObject<T>> | ParseError {
  const result = schemaMap[schemaName].partial().safeParse(body)

  return result.success
    ? (result.data as Partial<DbObject<T>>)
    : {error: result.error.issues.at(0) ?? {message: "Unknown error"}}
}

export const isValidImport = (body: any): ImportLevelsBody | ParseError => {
  const schema = z.object({
    levels: z.array(levelSchema),
    maps: z.array(levelMapSchema)
  })
  return checkValidSchema(body, schema) as ImportLevelsBody | ParseError
}
