import {
  baseObjectSchema,
  BuilderParams,
  HasId,
  ModelPermOption
} from "simply-served"
import {ZodRawShape, z, ZodObject} from "zod"
import {MServerCtx} from "./controllers/appClients"

export const createDbObject = <T extends ZodRawShape>(
  fun: (zod: typeof z) => ZodObject<T>
) => fun(z).merge(baseObjectSchema)

export const createSchema = <T extends ZodRawShape>(
  fun: (zod: typeof z) => ZodObject<T>
) => fun(z).merge(baseObjectSchema)

/**
 * Modifies a `ModelPermOption` object so that admins always have permission over everything,
 */
export const permsIfNotAdmin = <T extends HasId>(params: {
  [K in keyof BuilderParams<MServerCtx, T>["permissions"]]: ModelPermOption<
    MServerCtx,
    T
  >
}) => ({
  read: ifNotAdmin<T>(params.read),
  delete: ifNotAdmin<T>(params.delete),
  create: ifNotAdmin<T>(params.create),
  modify: ifNotAdmin<T>(params.modify)
})

export function ifNotAdmin<T extends HasId>(
  permissionOptions: ModelPermOption<MServerCtx, T>
): ModelPermOption<MServerCtx, T> {
  if (permissionOptions.type === "modelAuth") {
    return {
      type: "modelAuth",
      check: (a) =>
        a.userType === "Admin" ? {Always: true} : permissionOptions.check(a)
    }
  }
  if (permissionOptions.type === "notAllowed") {
    return {
      type: "modelAuth",
      check: (a) => (a.userType === "Admin" ? {Always: true} : {Never: true})
    }
  }
  return permissionOptions
}
