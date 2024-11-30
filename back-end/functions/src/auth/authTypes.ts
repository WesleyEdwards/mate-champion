import {NextFunction, Request, Response} from "express"
import {UserType} from "../types"
import {Clients} from "../appClients"
import {ZodType} from "zod"
import {checkValidSchema} from "../request_body"
import {EndpointBuilderType} from "./controller"

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

// Updated buildQuery
export const buildQuery = <T>(params: {
  validator?: Validator<T>
  fun: EndpointBuilderType<T>
}) => {
  const intermediate: EndpointBuilderType<T> = async (info) => {
    if (params.validator) {
      const isValid = checkValidSchema(info.req.body, params.validator)
      if (!isValid) {
        return info.res.status(400).json({error: "Invalid body"})
      }
      // Call the provided function
      return params.fun(info)
    } else {
      // Skip validation and call the provided function directly
      return params.fun(info)
    }
  }

  return intermediate
}
