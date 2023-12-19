import {NextFunction, Request, Response} from "express"
import {DbClient} from "../DbClient"

export type JWTBody = {
  userId: string
}

type RequestWithJWTBody = Request & {
  jwtBody?: JWTBody
}

export type AuthReqHandler = {
  (req: RequestWithJWTBody, res: Response, next: NextFunction): void
}

export type ReqBuilder = (client: DbClient) => AuthReqHandler
