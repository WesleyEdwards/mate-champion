import {ZodIssue, ZodObject, ZodType} from "zod"

export type ParseError = {error: Partial<ZodIssue>}

export function checkValidSchema<T>(
  body: any,
  schema: ZodType<T> | ZodObject<any, any, any, T>
): T | ParseError {
  const result = schema.safeParse(body)
  if (result.success) return result.data as unknown as T
  return {error: result.error.issues.at(0) ?? {message: "Unknown error"}}
}

export function isParseError<T extends object>(
  body: T | {error: any}
): body is ParseError {
  return "error" in body
}

export function checkPartialValidation<T>(
  body: any,
  schema: ZodObject<any, any, any, T>
): Partial<T> | ParseError {
  const result = schema.partial().safeParse(body)

  return result.success
    ? (result.data as Partial<T>)
    : {error: result.error.issues.at(0) ?? {message: "Unknown error"}}
}

export function isValid<T>(body: any): body is T {
  return !("error" in body)
}
