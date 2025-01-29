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
  read: ifNotAdmin<T>(params.create),
  delete: ifNotAdmin<T>(params.delete),
  create: ifNotAdmin<T>(params.create),
  modify: ifNotAdmin<T>(params.modify)
})

export function ifNotAdmin<T extends HasId>(
  permissionOptions: ModelPermOption<MServerCtx, T>
): ModelPermOption<MServerCtx, T> {
  return {
    skipAuth: undefined,
    modelAuth: (auth) =>
      auth.userType === "Admin"
        ? {Always: true}
        : permissionOptions.modelAuth?.(auth) ?? {Never: true},
    userAuth: permissionOptions.userAuth
      ? {Or: [permissionOptions.userAuth, {userType: {Equal: "Admin"}}]}
      : {userType: {Equal: "Admin"}}
  }
}
