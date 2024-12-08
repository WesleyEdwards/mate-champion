import {NextFunction, Request, Response} from "express"
import {UserType} from "../types"
import {Clients} from "../appClients"
import {ZodType} from "zod"
import {checkValidSchema, isValid, SafeParsable} from "../request_body"
import {EndpointBuilderType} from "../controllers/controller"

export type JWTBody = {
  userId: string
  userType: UserType
}

export type RequestWithJWTBody<Body> = Request<any, any, Body> & {
  jwtBody?: JWTBody
}

export type AuthReqHandler<Body> = (
  req: RequestWithJWTBody<Body>,
  res: Response,
  next: NextFunction
) => void

export type ReqBuilder<Body = {}> = (clients: Clients) => AuthReqHandler<Body>

export type Validator<T> = ZodType<T, any, any>

export const buildQuery = <T>(params: {
  validator?: SafeParsable<T>
  fun: EndpointBuilderType<T>
}) => {
  const intermediate: EndpointBuilderType<T> = async (info) => {
    if (params.validator) {
      const valid = checkValidSchema(info.req.body, params.validator)
      if (!isValid(valid)) {
        return info.res.status(400).json({error: valid})
      }
    }

    return params.fun(info)
  }

  return intermediate
}
