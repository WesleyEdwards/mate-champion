import {baseObjectSchema, BuilderParams, HasId} from "simply-served"
import {ZodRawShape, z, ZodObject} from "zod"
import {Clients} from "./controllers/appClients"

export const createDbObject = <T extends ZodRawShape>(
  fun: (zod: typeof z) => ZodObject<T>
) => fun(z).merge(baseObjectSchema)

export const createSchema = <T extends ZodRawShape>(
  fun: (zod: typeof z) => ZodObject<T>
) => fun(z).merge(baseObjectSchema)

export const permsIfNotAdmin = <T extends HasId>(
  params: BuilderParams<Clients, T>["permissions"]
) => ({
  read: ifNotAdmin<T>(params.create),
  delete: ifNotAdmin<T>(params.delete),
  create: ifNotAdmin<T>(params.create),
  modify: ifNotAdmin<T>(params.modify)
})

export function ifNotAdmin<T extends HasId>(
  fun: BuilderParams<Clients, T>["permissions"]["create"]
): BuilderParams<Clients, T>["permissions"]["create"] {
  return (c) => {
    if (c.auth?.userType === "Admin") return {Always: true}
    return fun(c)
  }
}
