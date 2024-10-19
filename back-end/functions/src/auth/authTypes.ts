import {NextFunction, Request, Response} from "express"
import {DbClient} from "../DbClient"
import {UserType} from "../types"

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

export type ReqBuilder<Body = {}> = (client: DbClient) => AuthReqHandler<Body>
