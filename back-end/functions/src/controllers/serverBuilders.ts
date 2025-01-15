import {MServerCtx} from "./appClients"
import {} from "simply-served"
import {EndpointBuilderType} from "simply-served"
import {SafeParsable, buildQuery} from "simply-served"
import {JWTBody} from "../types"

export type MCAuth = {jwtBody?: JWTBody}

export function buildMCQuery<T>(params: {
  validator?: SafeParsable<T>
  fun: EndpointBuilderType<MServerCtx, T>
}) {
  return buildQuery<MServerCtx, T>(params)
}
