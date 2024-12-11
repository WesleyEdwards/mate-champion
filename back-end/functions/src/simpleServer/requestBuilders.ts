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
  info: BuilderParams<T, C>
): Route<any, C> => ({
  path: "/:id",
  method: "get",
  skipAuth: info.skipAuth?.get,
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

      if ("error" in item) {
        return res.status(404).json(item)
      }

      return res.json(info.preRes?.(item) ?? item)
    }
  })
})

const queryBuilder = <T extends HasId, C extends SClient>(
  info: BuilderParams<T, C>
): Route<any, C> => ({
  path: "/query",
  method: "post",
  skipAuth: info.skipAuth?.query,
  endpointBuilder: buildQuery({
    validator: createConditionSchema<T>(info.validator),
    fun: async ({req, res, db}) => {
      const query = info.perms.read(req.jwtBody) ?? {Always: true}
      const fullQuery: Condition<T> = {
        And: [req.body as unknown as Condition<T>, query]
      }
      const items = await info.endpoint(db).findMany(fullQuery)
      return res.json(info.preRes ? items.map(info.preRes) : items)
    }
  })
})

const createBuilder = <T extends HasId, C extends SClient>(
  info: BuilderParams<T, C>
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

      const processed = info.actions?.preCreate
        ? await info.actions.preCreate(body, client)
        : body

      const created = await info.endpoint(client.db).insertOne(processed)

      if (!isValid<T>(created)) return res.status(500).json(created)
      await info.actions?.postCreate?.(created, client)

      return res.json(info.preRes?.(created) ?? created)
    }
  })
})

export const modifyBuilder = <T extends HasId, C extends SClient>(
  info: BuilderParams<T, C>
): Route<any, C> => ({
  path: "/:id",
  method: "put",
  skipAuth: info.skipAuth?.modify,
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
      return res.json(info.preRes?.(updated) ?? updated)
    }
  })
})

export const deleteBuilder = <T extends HasId, C extends SClient>(
  info: BuilderParams<T, C>
): Route<any, C> => ({
  path: "/:id",
  method: "delete",
  skipAuth: info.skipAuth?.del,
  endpointBuilder: buildQuery({
    fun: async ({req, res, ...rest}) => {
      const client = rest as unknown as C
      const deleted = await info
        .endpoint(client.db)
        .deleteOne(req.params.id, info.perms.delete(req.jwtBody))
      await info.actions?.postDelete?.(deleted, client)
      return res.json(deleted._id)
    }
  })
})

export type BuilderParams<T extends HasId, C extends SClient> = {
  preRes?: (items: T) => T
  validator: Validator<T>
  skipAuth?: {
    get?: boolean
    query?: boolean
    create?: boolean
    modify?: boolean
    del?: boolean
  }
  endpoint: (clients: C["db"]) => DbQueries<T>
  perms: {
    read: (jwt: JWTBody | undefined) => Condition<T>
    delete: (jwt: JWTBody | undefined) => Condition<T>
    create: (jwt: JWTBody | undefined) => Condition<T>
    modify: (jwt: JWTBody | undefined) => Condition<T>
  }
  actions?: {
    preCreate?: (item: T, clients: C) => Promise<T>
    postCreate?: (item: T, clients: C) => Promise<unknown>
    postDelete?: (item: T, clients: C) => Promise<unknown>
  }
}

export const createBasicEndpoints = <T extends HasId, C extends SClient>(
  params: BuilderParams<T, C>
) => {
  return [
    getBuilder(params),
    createBuilder(params),
    queryBuilder(params),
    modifyBuilder(params),
    deleteBuilder(params)
  ]
}

export const maskKeys = <T extends {}>(maskKeys: (keyof T)[]) => {
  const prepareRes = (item: T) => {
    for (const key of maskKeys) {
      delete item[key]
    }
    return item
  }
  return prepareRes
}
