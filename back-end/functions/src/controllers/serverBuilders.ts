import {Clients} from "./appClients"
import {} from "simply-served"
import {EndpointBuilderType} from "simply-served"
import {buildQuery} from "simply-served"
import {JWTBody} from "../auth/middleware"
import {SafeParsable} from "simply-served"

export type MCAuth = {jwtBody?: JWTBody}

export function buildMCQuery<T>(params: {
  validator?: SafeParsable<T>
  fun: EndpointBuilderType<Clients, T>
}) {
  return buildQuery<Clients, T>(params)
}
