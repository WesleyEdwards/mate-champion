import {JWTBody, Validator, buildQuery} from "./auth/authTypes"
import {Route} from "./controllers/controller"
import {DbQueries, HasId} from "./DbClient"
import {isValid} from "./request_body"
import {Condition, createCondition} from "./condition"
import {Clients, DbClient} from "./appClients"

const idCondition = <T extends HasId>(id: string): Condition<T> =>
  ({_id: {equal: id}} as Condition<T>)

const getBuilder = <T extends HasId>(info: Shared<T>): Route => ({
  path: "/:id",
  method: "get",
  skipAuth: info.skipAuth,
  endpointBuilder: buildQuery({
    fun: async ({req, res, db}) => {
      const {params, jwtBody} = req
      const {id} = params
      if (!id || typeof id !== "string") {
        return res.status(400).json("Bad request")
      }

      const item = await info.endpoint(db).findOne({
        and: [idCondition(id), info.perms.read(jwtBody)]
      })

      if (!isValid<T>(item)) return res.status(404).json(item)

      return res.json(info.preRes(item))
    }
  })
})

const queryBuilder = <T extends HasId>(info: Shared<T>): Route => ({
  path: "/query",
  method: "post",
  skipAuth: info.skipAuth,
  endpointBuilder: buildQuery({
    validator: createCondition(info.validator),
    fun: async ({req, res, db}) => {
      const query = info.perms.read(req.jwtBody) ?? {always: true}
      const fullQuery: Condition<T> = {and: [req.body as any, query]}
      const items = await info.endpoint(db).findMany(fullQuery)
      return res.json(items.map(info.preRes))
    }
  })
})

type CreateInfo<T extends HasId> = {
  preProcess?: (item: T, clients: Clients) => Promise<T>
  postCreate?: (item: T, clients: Clients) => Promise<unknown>
}

const createBuilder = <T extends HasId>(
  info: Shared<T> & CreateInfo<T>
): Route => ({
  path: "/insert",
  method: "post",
  endpointBuilder: buildQuery({
    validator: info.validator,
    fun: async ({req, res, ...clients}) => {
      const {jwtBody, body} = req

      const canCreate = info.perms.read(jwtBody) ?? true

      if (!canCreate) {
        return res.status(401).json({error: "Cannot create"})
      }

      const processed = info.preProcess
        ? await info.preProcess(body, clients)
        : body

      const created = await info.endpoint(clients.db).insertOne(processed)

      if (!isValid<T>(created)) return res.status(500).json(created)
      await info.postCreate?.(created, clients)

      return res.json(info.preRes(created))
    }
  })
})

export const modifyBuilder = <T extends HasId>(info: Shared<T>): Route => ({
  path: "/:id",
  method: "put",
  skipAuth: info.skipAuth,
  endpointBuilder: buildQuery({
    validator: info.validator,
    fun: async ({req, res, db}) => {
      const {body, params, jwtBody} = req
      const id = params.id

      const item = await info.endpoint(db).findOne({
        and: [info.perms.read(jwtBody), idCondition(id)]
      })

      if (!isValid(item)) return res.status(404).json("Not found")
      const updated = await info.endpoint(db).updateOne(id, body)
      if (!isValid<T>(updated)) return res.status(400).json(body)
      return res.json(info.preRes(updated))
    }
  })
})

type DeleteInfo<T extends HasId> = {
  postDelete?: (item: T, clients: Clients) => Promise<unknown>
}

export const deleteBuilder = <T extends HasId>(
  info: Shared<T> & DeleteInfo<T>
): Route => ({
  path: "/:id",
  method: "delete",
  skipAuth: info.skipAuth,
  endpointBuilder: buildQuery({
    fun: async ({req, res, ...clients}) => {
      const deleted = await info
        .endpoint(clients.db)
        .deleteOne(req.params.id, info.perms.delete(req.jwtBody))
      await info.postDelete?.(deleted, clients)
      return res.json(deleted._id)
    }
  })
})

type Skippable = {skipAuth?: boolean}
export type BuildEndpoints1<T extends HasId> = {
  get: Skippable | null
  query: Skippable | null
  create: (Skippable & CreateInfo<T>) | null
  modify: Skippable | null
  del: (Skippable & DeleteInfo<T>) | null
}

export type PermsForAction<T> = (jwt: JWTBody | undefined) => Condition<T>

type Perms<T> = {
  read: PermsForAction<T>
  delete: PermsForAction<T>
  create: PermsForAction<T>
  modify: PermsForAction<T>
}

type Shared<T extends HasId> = {
  validator: Validator<T>
  skipAuth?: boolean
  endpoint: (db: DbClient) => DbQueries<T>
  preRes: (items: T) => T
  perms: Perms<T>
}

type BuilderParams<T extends HasId> = {
  endpoint: (db: DbClient) => DbQueries<T>
  validator: Validator<T>
  builder: BuildEndpoints1<T>
  mask?: (keyof T)[]
  perms: Perms<T>
}

export const createBasicEndpoints = <T extends HasId>(
  params: BuilderParams<T>
) => {
  const {builder, mask, perms, validator, endpoint} = params
  const {create, modify, del, get, query} = builder

  const prepareRes = (item: T) => {
    if (!mask) return item
    for (const key of mask) {
      delete item[key]
    }
    return item
  }
  const shared = {
    endpoint,
    perms,
    preRes: prepareRes,
    validator
  }

  const list = [
    get ? getBuilder({...shared, ...get}) : null,
    create ? createBuilder({...shared, ...create}) : null,
    query ? queryBuilder({...shared, ...query}) : null,
    modify ? modifyBuilder({...shared, ...modify}) : null,
    del ? deleteBuilder({...shared, ...del}) : null
  ]
  return list.filter((r) => r !== null)
}
