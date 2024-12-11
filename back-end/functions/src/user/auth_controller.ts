import {createBasicMCEndpoints} from "../controllers/serverBuilders"
import {controller} from "../simpleServer/controller"
import {ifNotAdmin} from "../levelInfo/level_controller"
import {createDbObject} from "../simpleServer/validation"
import {Infer} from "../types"
import {
  getSelf,
  loginWithPassword,
  sendAuthCode,
  submitAuthCode
} from "./userQueries"

export type AuthCode = Infer<typeof authCodeSchema>

export const authCodeSchema = createDbObject((z) =>
  z.object({code: z.string(), email: z.string()})
)

const authEndpoints = createBasicMCEndpoints<AuthCode>({
  validator: authCodeSchema,
  endpoint: (db) => db.authCode,
  perms: {
    read: ifNotAdmin<AuthCode>((jwtBody) => ({
      _id: {Equal: jwtBody?.userId ?? ""}
    })),
    delete: ifNotAdmin<AuthCode>((jwtBody) => ({
      _id: {Equal: jwtBody?.userId ?? ""}
    })),
    create: ifNotAdmin<AuthCode>(() => ({Never: true})),
    modify: ifNotAdmin<AuthCode>((jwtBody) => ({
      _id: {Equal: jwtBody?.userId ?? ""}
    }))
  }
})

export const authController = controller("auth", [
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
])
