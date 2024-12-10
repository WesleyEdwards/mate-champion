import {Clients} from "../simpleServer/appClients"
import {buildQuery} from "../simpleServer/buildQuery"
import {HasId} from "../simpleServer/DbClient"
import {SafeParsable} from "../simpleServer/request_body"
import {
  BuilderParams,
  createBasicEndpoints
} from "../simpleServer/requestBuilders"
import {EndpointBuilderType} from "./controller"

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
