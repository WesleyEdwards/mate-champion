import express, {Express, Response, Request} from "express"

export type SInfo = {
  db: any
  auth?: any
}

export type EndpointBuilderType<C extends SInfo, Body> = (
  info: {
    req: Request<any, any, Body>
    res: Response
  } & C
) => Promise<Response<any, Record<string, any>>>

export type Route<C extends SInfo, Body = any> = {
  path: string
  method: "post" | "put" | "get" | "delete"
  endpointBuilder: EndpointBuilderType<C, Body>
  skipAuth?: boolean
}

export function controller<C extends SInfo>(
  basePath: string,
  routes: Route<C>[]
) {
  return (
    app: Express,
    client: (req: Request, skipAuth?: boolean) => C | null
  ) => {
    const router = express.Router()
    routes.forEach((route) => {
      router.use(route.path, (req, res, next) => {
        const sameMethod = req.method.toLowerCase() === route.method
        if (!sameMethod) {
          return next()
        }
        const c = client(req, route.skipAuth)
        if (c === null) {
          return res.status(401).json({message: "Unauthorized"})
        } else {
          next()
        }
        return null
      })
      router[route.method](route.path, (req, res, next) => {
        const c = client(req, route.skipAuth)
        if (c === null) {
          return next()
        }
        return route.endpointBuilder({req, res, ...c})
      })
    })
    app.use(`/${basePath}`, router)
  }
}
