import {z} from "zod"
import {baseObjectSchema, modelRestEndpoints} from "simply-served"
import {Infer} from "../types"
import {
  createAccount,
  getSelf,
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

const authEndpoints = modelRestEndpoints<MServerCtx, AuthCode>({
  validator: authCodeSchema,
  collection: (db) => db.authCode,
  permissions: permsIfNotAdmin<AuthCode>({
    read: {userAuth: ({Never: true})},
    delete: {userAuth: ({Never: true})},
    create: {userAuth: ({Never: true})},
    modify: {userAuth: ({Never: true})}
  })
})

export const authController: Route<MServerCtx>[] = [
  {path: "/self", method: "get", endpointBuilder: getSelf},
  {
    path: "/create",
    method: "post",
    endpointBuilder: createAccount
  },
  {
    path: "/sendAuthCode",
    method: "post",
    endpointBuilder: sendAuthCode
  },
  {
    path: "/submitAuthCode",
    method: "post",
    endpointBuilder: submitAuthCode
  },
  ...authEndpoints
]
