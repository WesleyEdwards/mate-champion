import express, {Express, Response, Request} from "express"

export type SClient = {
  db: any
  auth?: any
}

export type EndpointBuilderType<Body, C extends SClient> = (
  info: {
    req: Request<any, any, Body>
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
  basePath: string,
  routes: Route<any, C>[]
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
          return res.status(403).json({error: "Unauthorized"})
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
