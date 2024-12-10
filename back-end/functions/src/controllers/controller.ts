import express, {Express, Response, Request, NextFunction} from "express"

import jwt from "jsonwebtoken"
import {JWTBody} from "../auth/authTypes"
import {Clients} from "../simpleServer/appClients"
import {ZodType} from "zod"

export type RequestWithJWTBody<Body, C extends SClient> = Request<
  any,
  any,
  Body
> & {
  jwtBody?: JWTBody
} & C

export type AuthReqHandler<Body, C extends SClient> = (
  req: RequestWithJWTBody<Body, C>,
  res: Response,
  next: NextFunction
) => void

export type ReqBuilder<Body, C extends SClient> = (
  clients: Clients
) => AuthReqHandler<Body, C>

export type Validator<T> = ZodType<T, any, any>

export type SClient = {
  db: any
}

export type EndpointBuilderType<Body, C extends SClient> = (
  info: {
    req: RequestWithJWTBody<Body, C>
    res: Response
  } & C
) => Promise<Response<any, Record<string, any>>>

export type Route<Body, C extends SClient> = {
  path: string
  method: "post" | "put" | "get" | "delete"
  endpointBuilder: EndpointBuilderType<Body, C>
  skipAuth?: boolean
}

export function controller<C extends SClient>(
  name: string,
  routes: Route<any, C>[]
) {
  return (app: Express, client: C) => {
    const router = express.Router()
    routes.forEach((route) => {
      if (!route.skipAuth) {
        router.use(route.path, (req, res, next) => {
          if (req.method.toLowerCase() === route.method) {
            authenticationMiddleware(req, res, next)
          } else {
            next()
          }
        })
      }
      router[route.method](route.path, (req, res) =>
        route.endpointBuilder({...client, req: req, res} as any)
      )
    })
    app.use(`/${name}`, router)
  }
}

export const authenticationMiddleware: AuthReqHandler<any, any> = async (
  req,
  res,
  next
) => {
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
