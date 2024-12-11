import {
  createBasicMCEndpoints,
  mcController
} from "../controllers/serverBuilders"
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

export const authController = mcController("auth", [
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
