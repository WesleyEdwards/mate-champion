import {z} from "zod"
import {baseObjectSchema} from "simply-served"
import {Infer} from "../types"
import {
  createAccount,
  getSelf,
  sendAuthCode,
  submitAuthCode
} from "./userQueries"
import {MServerCtx} from "../controllers/appClients"
import {Route} from "simply-served"

export type AuthCode = Infer<typeof authCodeSchema>

export const authCodeSchema = z
  .object({code: z.string(), email: z.string()})
  .merge(baseObjectSchema)

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
  }
]
