import {NextFunction, Request, Response} from "express"
import {UserType} from "../types"
import {Clients} from "../simpleServer/appClients"
import {ZodType} from "zod"

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
