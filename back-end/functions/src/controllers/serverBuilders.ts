import {Clients} from "./appClients"
import {HasId} from "../simpleServer/DbClient"
import {
  BuilderParams,
  createBasicEndpoints
} from "../simpleServer/server/requestBuilders"
import {EndpointBuilderType} from "../simpleServer/server/controller"
import {buildQuery} from "../simpleServer/server/buildQuery"
import {JWTBody} from "../auth/authTypes"
import jwt from "jsonwebtoken"
import {
  AuthReqHandler,
  controller,
  Route
} from "../simpleServer/server/controller"
import {SafeParsable} from "../simpleServer/validation"

export type MCAuth = {jwtBody?: JWTBody}

export function buildMCQuery<T>(params: {
  validator?: SafeParsable<T>
  fun: EndpointBuilderType<T, Clients, MCAuth>
}) {
  return buildQuery<T, Clients>(params)
}
export function createBasicMCEndpoints<T extends HasId>(
  params: BuilderParams<T, Clients, MCAuth>
) {
  return createBasicEndpoints<T, Clients, MCAuth>(params)
}

export const authenticationMiddleware: AuthReqHandler<
  any,
  Clients,
  MCAuth
> = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]
  try {
    const jwtBody = jwt.verify(
      token || "",
      process.env.ENCRYPTION_KEY!
    ) as JWTBody
    req.jwtBody = jwtBody
    next()
  } catch (error) {
    res.status(401).json({message: "Unauthorized"})
  }
  return null
}

export const mcController = (
  path: string,
  routes: Route<any, Clients, {jwtBody?: JWTBody}>[]
) => {
  return controller(path, routes, authenticationMiddleware)
}
