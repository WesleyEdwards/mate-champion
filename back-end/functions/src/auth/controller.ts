import express, {RequestHandler, Express} from "express"
import {DbClient} from "../DbClient"

import jwt from "jsonwebtoken"
import {AuthReqHandler, JWTBody} from "./authTypes"

export const authenticationMiddleware: AuthReqHandler = async (
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

export type Route = {
  path: string
  method: "post" | "put" | "get" | "delete"
  endpointBuilder: RequestHandler
  skipAuth?: boolean
}

export const controller =
  (name: string, routes: (client: DbClient) => Route[]) =>
  (app: Express, client: DbClient) => {
    const router = express.Router()
    routes(client).forEach((route) => {
      if (!route.skipAuth) {
        router.use(route.path, (req, res, next) => {
          if (req.method.toLowerCase() === route.method) {
            authenticationMiddleware(req, res, next)
          } else {
            next()
          }
        })
      }
      router[route.method](route.path, route.endpointBuilder)
    })
    app.use(`/${name}`, router)
  }
