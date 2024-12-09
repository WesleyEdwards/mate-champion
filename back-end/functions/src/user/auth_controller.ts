import {controller} from "../controllers/controller"
import {ifNotAdmin} from "../levelInfo/level_controller"
import {createBasicEndpoints} from "../simpleServer/requestBuilders"
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

const authEndpoints = createBasicEndpoints<AuthCode>({
  validator: authCodeSchema,
  endpoint: (db) => db.authCode,
  perms: {
    read: ifNotAdmin<AuthCode>((jwtBody) => ({
      _id: {equal: jwtBody?.userId ?? ""}
    })),
    delete: ifNotAdmin<AuthCode>((jwtBody) => ({
      _id: {equal: jwtBody?.userId ?? ""}
    })),
    create: ifNotAdmin<AuthCode>(() => ({never: true})),
    modify: ifNotAdmin<AuthCode>((jwtBody) => ({
      _id: {equal: jwtBody?.userId ?? ""}
    }))
  },
  builder: {create: {}, del: {}, get: {}, modify: {}, query: {}}
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
