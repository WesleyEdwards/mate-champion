import {z} from "zod"
import {createBasicMCEndpoints} from "../controllers/serverBuilders"
import {ifNotAdmin} from "../levelInfo/level_controller"
import {baseObjectSchema} from "../simpleServer/validation"
import {Infer} from "../types"
import {
  getSelf,
  loginWithPassword,
  sendAuthCode,
  submitAuthCode
} from "./userQueries"
import {Clients} from "../controllers/appClients"
import {Route} from "../simpleServer/server/controller"

export type AuthCode = Infer<typeof authCodeSchema>

export const authCodeSchema = z
  .object({code: z.string(), email: z.string()})
  .merge(baseObjectSchema)

const authEndpoints = createBasicMCEndpoints({
  validator: authCodeSchema,
  endpoint: (db) => db.authCode,
  permissions: {
    read: ifNotAdmin<AuthCode>((auth) => ({
      _id: {Equal: auth.jwtBody?.userId ?? ""}
    })),
    delete: ifNotAdmin<AuthCode>((auth) => ({
      _id: {Equal: auth.jwtBody?.userId ?? ""}
    })),
    create: ifNotAdmin<AuthCode>(() => ({Never: true})),
    modify: ifNotAdmin<AuthCode>((auth) => ({
      _id: {Equal: auth.jwtBody?.userId ?? ""}
    }))
  }
})

export const authController: Route<Clients>[] = [
  {path: "/self", method: "get", endpointBuilder: getSelf},
  {
    path: "/login",
    method: "post",
    endpointBuilder: loginWithPassword,
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
