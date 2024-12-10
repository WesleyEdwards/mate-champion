import {JWTBody} from "../auth/authTypes"
import {Route, SClient} from "./controller"
import {DbQueries, HasId} from "./DbClient"
import {isValid} from "./request_body"
import {
  Condition,
  createConditionSchema,
  Validator
} from "./condition/condition"
import {buildQuery} from "./buildQuery"

const idCondition = <T extends HasId>(id: string): Condition<T> =>
  ({_id: {Equal: id}} as Condition<T>)

const getBuilder = <T extends HasId, C extends SClient>(
  info: Shared<T, C>
): Route<any, C> => ({
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
        And: [idCondition(id), info.perms.read(jwtBody)]
      })

      if (!isValid<T>(item)) return res.status(404).json(item)

      return res.json(info.preRes(item))
    }
  })
})

const queryBuilder = <T extends HasId, C extends SClient>(
  info: Shared<T, C>
): Route<any, C> => ({
  path: "/query",
  method: "post",
  skipAuth: info.skipAuth,
  endpointBuilder: buildQuery({
    validator: createConditionSchema<T>(info.validator),
    fun: async ({req, res, db}) => {
      const query = info.perms.read(req.jwtBody) ?? {Always: true}
      const fullQuery: Condition<T> = {
        And: [req.body as unknown as Condition<T>, query]
      }
      const items = await info.endpoint(db).findMany(fullQuery)
      return res.json(items.map(info.preRes))
    }
  })
})

type CreateInfo<T extends HasId, C extends SClient> = {
  preProcess?: (item: T, clients: C) => Promise<T>
  postCreate?: (item: T, clients: C) => Promise<unknown>
}

const createBuilder = <T extends HasId, C extends SClient>(
  info: Shared<T, C> & CreateInfo<T, C>
): Route<any, C> => ({
  path: "/insert",
  method: "post",
  endpointBuilder: buildQuery({
    validator: info.validator,
    fun: async ({req, res, ...rest}) => {
      const client = rest as unknown as C
      const {jwtBody, body} = req

      const canCreate = info.perms.create(jwtBody) ?? true

      if (!canCreate) {
        return res.status(401).json({error: "Cannot create"})
      }

      const processed = info.preProcess
        ? await info.preProcess(body, client)
        : body

      const created = await info.endpoint(client.db).insertOne(processed)

      if (!isValid<T>(created)) return res.status(500).json(created)
      await info.postCreate?.(created, client)

      return res.json(info.preRes(created))
    }
  })
})

export const modifyBuilder = <T extends HasId, C extends SClient>(
  info: Shared<T, C>
): Route<any, C> => ({
  path: "/:id",
  method: "put",
  skipAuth: info.skipAuth,
  endpointBuilder: buildQuery({
    validator: info.validator,
    fun: async ({req, res, db}) => {
      const {body, params, jwtBody} = req
      const id = params.id

      const item = await info.endpoint(db).findOne({
        And: [info.perms.modify(jwtBody), idCondition(id)]
      })

      if (!isValid(item)) return res.status(404).json("Not found")
      const updated = await info.endpoint(db).updateOne(id, body)
      if (!isValid<T>(updated)) return res.status(400).json(body)
      return res.json(info.preRes(updated))
    }
  })
})

type DeleteInfo<T extends HasId, C extends SClient> = {
  postDelete?: (item: T, clients: C) => Promise<unknown>
}

export const deleteBuilder = <T extends HasId, C extends SClient>(
  info: Shared<T, C> & DeleteInfo<T, C>
): Route<any, C> => ({
  path: "/:id",
  method: "delete",
  skipAuth: info.skipAuth,
  endpointBuilder: buildQuery({
    fun: async ({req, res, ...rest}) => {
      const client = rest as unknown as C
      const deleted = await info
        .endpoint(client.db)
        .deleteOne(req.params.id, info.perms.delete(req.jwtBody))
      await info.postDelete?.(deleted, client)
      return res.json(deleted._id)
    }
  })
})

type Skippable = {skipAuth?: boolean}
export type EndpointsBuilder<T extends HasId, C extends SClient> = {
  get: Skippable
  query: Skippable
  create: Skippable & CreateInfo<T, C>
  modify: Skippable
  del: Skippable & DeleteInfo<T, C>
}

export type PermsForAction<T> = (jwt: JWTBody | undefined) => Condition<T>

type Perms<T> = {
  read: PermsForAction<T>
  delete: PermsForAction<T>
  create: PermsForAction<T>
  modify: PermsForAction<T>
}

type Shared<T extends HasId, C extends SClient> = {
  validator: Validator<T>
  skipAuth?: boolean
  endpoint: (clients: C) => DbQueries<T>
  preRes: (items: T) => T
  perms: Perms<T>
}

export type BuilderParams<T extends HasId, C extends SClient> = {
  endpoint: (db: C["db"]) => DbQueries<T>
  validator: Validator<T>
  builder: EndpointsBuilder<T, C>
  mask?: (keyof T)[]
  perms: Perms<T>
}

export const createBasicEndpoints = <T extends HasId, C extends SClient>(
  params: BuilderParams<T, C>
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

  return [
    getBuilder<T, C>({...shared, ...get}),
    createBuilder<T, C>({...shared, ...create}),
    queryBuilder<T, C>({...shared, ...query}),
    modifyBuilder<T, C>({...shared, ...modify}),
    deleteBuilder<T, C>({...shared, ...del})
  ]
}
