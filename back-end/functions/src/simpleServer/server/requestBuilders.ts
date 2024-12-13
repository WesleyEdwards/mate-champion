import {Route, SClient} from "./controller"
import {DbQueries, HasId} from "../DbClient"
import {Condition} from "../condition/condition"
import {buildQuery} from "./buildQuery"
import {
  createConditionSchema,
  partialValidator
} from "../condition/conditionSchema"
import {ZodType} from "zod"

export type BuilderParams<T extends HasId, C extends SClient> = {
  validator: ZodType<T, any, any>
  skipAuth?: {
    get?: boolean
    query?: boolean
    create?: boolean
    modify?: boolean
    del?: boolean
  }
  endpoint: (clients: C["db"]) => DbQueries<T>
  permissions: {
    read: (auth: C) => Condition<T>
    delete: (auth: C) => Condition<T>
    create: (auth: C) => Condition<T>
    modify: (auth: C) => Condition<T>
  }
  actions?: {
    prepareResponse?: (items: T) => T
    // Create
    interceptCreate?: (item: T, clients: C) => Promise<T>
    postCreate?: (item: T, clients: C) => Promise<unknown>
    // Modify
    interceptModify?: (
      item: T,
      mod: Partial<T>,
      clients: C
    ) => Promise<Partial<T>>
    postModify?: (item: T, clients: C) => Promise<unknown>
    // Delete
    interceptDelete?: (item: T, clients: C) => Promise<T>
    postDelete?: (item: T, clients: C) => Promise<unknown>
  }
}

export const createBasicEndpoints = <T extends HasId, C extends SClient>(
  builderInfo: BuilderParams<T, C>
): Route<any, C>[] => [
  {
    path: "/:id",
    method: "get",
    skipAuth: builderInfo.skipAuth?.get,
    endpointBuilder: getBuilder(builderInfo)
  },
  {
    path: "/query",
    method: "post",
    skipAuth: builderInfo.skipAuth?.query,
    endpointBuilder: queryBuilder(builderInfo)
  },
  {
    path: "/insert",
    method: "post",
    skipAuth: builderInfo.skipAuth?.create,
    endpointBuilder: createBuilder(builderInfo)
  },
  {
    path: "/:id",
    method: "put",
    skipAuth: builderInfo.skipAuth?.modify,
    endpointBuilder: modifyBuilder(builderInfo)
  },
  {
    path: "/:id",
    method: "delete",
    skipAuth: builderInfo.skipAuth?.del,
    endpointBuilder: deleteBuilder(builderInfo)
  }
]

const getBuilder = <T extends HasId, C extends SClient>(
  info: BuilderParams<T, C>
) =>
  buildQuery({
    fun: async ({req, res, ...rest}) => {
      const client = rest as C
      const {params} = req
      const {id} = params
      if (!id || typeof id !== "string") {
        return res.status(400).json("Id required")
      }

      const item = await info.endpoint(client.db).findOne({
        And: [{_id: {Equal: id}}, info.permissions.read(client)]
      })

      if (!item.success) {
        return res.status(404).json(item)
      }

      return res.json(info.actions?.prepareResponse?.(item.data) ?? item)
    }
  })

const queryBuilder = <T extends HasId, C extends SClient>(
  info: BuilderParams<T, C>
) =>
  buildQuery({
    validator: createConditionSchema(info.validator),
    fun: async ({req, res, ...rest}) => {
      console.log("Querying")
      const client = rest as C
      console.log("client", client)
      const query = info.permissions.read(client) ?? {Always: true}

      const fullQuery = {And: [req.body, query]}
      console.log("fullQuery", fullQuery)

      const items = await info.endpoint(client.db).findMany(fullQuery)
      return res.json(
        info.actions?.prepareResponse
          ? items.map(info.actions.prepareResponse)
          : items
      )
    }
  })

const createBuilder = <T extends HasId, C extends SClient>(
  info: BuilderParams<T, C>
) =>
  buildQuery({
    validator: info.validator,
    fun: async ({req, res, ...rest}) => {
      const client = rest as C
      const {body} = req

      const canCreate = info.permissions.create(client) ?? true

      if (!canCreate) {
        return res.status(401).json({error: "Cannot create"})
      }

      const processed = info.actions?.interceptCreate
        ? await info.actions.interceptCreate(body, client)
        : body

      const created = await info.endpoint(client.db).insertOne(processed)

      if (!created.success) return res.status(500).json(created)
      await info.actions?.postCreate?.(created.data, client)

      return res.json(
        info.actions?.prepareResponse?.(created.data) ?? created.data
      )
    }
  })

const modifyBuilder = <T extends HasId, C extends SClient>(
  info: BuilderParams<T, C>
) =>
  buildQuery({
    validator: partialValidator(info.validator),
    fun: async ({req, res, ...rest}) => {
      const client = rest as C
      const {body, params} = req
      const id = params.id

      const item = await info.endpoint(client.db).findOne({
        And: [{_id: {Equal: id}}, info.permissions.modify(client)]
      })
      if (!item.success) {
        return res.status(404).json({error: "Item not found"})
      }

      const intercepted =
        (await info.actions?.interceptModify?.(item.data, body, client)) ?? body

      const updated = await info.endpoint(client.db).updateOne(id, intercepted)
      if (!updated.success) return res.status(400).json(body)

      await info.actions?.postModify?.(updated.data, client)

      return res.json(
        info.actions?.prepareResponse?.(updated.data) ?? updated.data
      )
    }
  })

const deleteBuilder = <T extends HasId, C extends SClient>(
  info: BuilderParams<T, C>
) =>
  buildQuery({
    fun: async ({req, res, ...rest}) => {
      const client = rest as C

      console.log("Deleting ", req.params.id)
      if (!req.params.id) {
        return res.status(400).json({error: "Provide a valid id"})
      }
      const item = await info.endpoint(client.db).findOne({
        And: [{_id: {Equal: req.params.id}}, info.permissions.delete(client)]
      })
      if (!item.success) {
        return res.status(404).json({error: "Not found"})
      }
      await info.actions?.interceptDelete?.(item.data, client)

      const deleted = await info.endpoint(client.db).deleteOne(req.params.id)

      await info.actions?.postDelete?.(deleted, client)
      return res.json(deleted._id)
    }
  })
