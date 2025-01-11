import {z} from "zod"
import {baseObjectSchema, modelRestEndpoints} from "simply-served"
import {Infer} from "../types"
import {
  createAccount,
  getSelf,
  loginWithPassword,
  sendAuthCode,
  submitAuthCode
} from "./userQueries"
import {MServerCtx} from "../controllers/appClients"
import {Route} from "simply-served"
import {permsIfNotAdmin} from "../helpers"

export type AuthCode = Infer<typeof authCodeSchema>

export const authCodeSchema = z
  .object({code: z.string(), email: z.string()})
  .merge(baseObjectSchema)

const authEndpoints = modelRestEndpoints({
  validator: authCodeSchema,
  collection: (db) => db.authCode,
  permissions: permsIfNotAdmin<AuthCode>({
    read: ({auth}) => ({_id: {Equal: auth?.userId ?? ""}}),
    delete: ({auth}) => ({_id: {Equal: auth?.userId ?? ""}}),
    create: () => ({Never: true}),
    modify: ({auth}) => ({_id: {Equal: auth?.userId ?? ""}})
  })
})

export const authController: Route<MServerCtx>[] = [
  {path: "/self", method: "get", endpointBuilder: getSelf},
  {
    path: "/login",
    method: "post",
    endpointBuilder: loginWithPassword,
    skipAuth: true
  },
  {
    path: "/create",
    method: "post",
    endpointBuilder: createAccount,
    skipAuth: true
  },
  {
    path: "/sendAuthCode",
    method: "post",
    endpointBuilder: sendAuthCode,
    skipAuth: true
  },
  {
    path: "/submitAuthCode",
    method: "post",
    endpointBuilder: submitAuthCode,
    skipAuth: true
  },
  ...authEndpoints
]
