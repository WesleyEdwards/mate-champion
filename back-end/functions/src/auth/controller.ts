import express, {Express, Response} from "express"

import jwt from "jsonwebtoken"
import {AuthReqHandler, JWTBody, RequestWithJWTBody} from "./authTypes"
import {Clients} from "../appClients"

export const authenticationMiddleware: AuthReqHandler<any> = async (
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

export type EndpointBuilderType<Body> = (
  info: {
    req: RequestWithJWTBody<Body>
    res: Response
  } & Clients
) => Promise<Response<any, Record<string, any>>>

export type Route<Body = any> = {
  path: string
  method: "post" | "put" | "get" | "delete"
  endpointBuilder: EndpointBuilderType<Body>
  skipAuth?: boolean
}

export const createRoute = <Z>(x: Route<Z>): Route<Z> => x

export const controller =
  (name: string, routes: Route<any>[]) => (app: Express, client: Clients) => {
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
        route.endpointBuilder({...client, req, res})
      )
    })
    app.use(`/${name}`, router)
  }
