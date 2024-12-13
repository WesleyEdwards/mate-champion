import {Clients} from "./appClients"
import {HasId} from "../simpleServer/DbClient"
import {
  BuilderParams,
  createBasicEndpoints
} from "../simpleServer/server/requestBuilders"
import {EndpointBuilderType} from "../simpleServer/server/controller"
import {buildQuery} from "../simpleServer/server/buildQuery"
import {JWTBody} from "../auth/middleware"
import {controller, Route} from "../simpleServer/server/controller"
import {SafeParsable} from "../simpleServer/validation"

export type MCAuth = {jwtBody?: JWTBody}

export function buildMCQuery<T>(params: {
  validator?: SafeParsable<T>
  fun: EndpointBuilderType<T, Clients>
}) {
  return buildQuery<T, Clients>(params)
}
export function createBasicMCEndpoints<T extends HasId>(
  params: BuilderParams<T, Clients>
) {
  return createBasicEndpoints<T, Clients>(params)
}

export const mcController = (path: string, routes: Route<any, Clients>[]) => {
  return controller(path, routes)
}
