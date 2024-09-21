import {JWTBody, AuthReqHandler} from "./auth/authTypes"
import {Route} from "./auth/controller"
import {BasicEndpoints, HasId, Condition, DbClient} from "./DbClient"
import {isParseError, isValid} from "./request_body"
import {LevelInfo} from "./types"

// If perms are not supplied, it defaults to just being authenticated.
type GetterInfo<T extends HasId> = {
  endpoint: BasicEndpoints<T>
  perms?: (s: JWTBody | undefined) => Condition<T>
}

export const getBuilder = <T extends HasId>(info: GetterInfo<T>): Route => ({
  path: "/:id",
  method: "get",
  endpointBuilder: (async (req, res) => {
    const {params, jwtBody} = req
    if (!params.id || typeof params.id !== "string") {
      return res.status(400).json("Bad request")
    }

    const condition = info.perms?.(jwtBody) ?? {}
    const item = await info.endpoint.findOne({
      and: [idEquals(params.id), condition]
    })

    if (isParseError(item)) return res.status(404).json(item)

    return res.json(item)
  }) satisfies AuthReqHandler
})

type CreatorInfo<T extends HasId> = {
  endpoint: BasicEndpoints<T>
  perms?: (s: JWTBody | undefined, thing: T) => boolean
  validate: (body: unknown) => Promise<T | {error: any}>
  postCreate?: (item: T) => Promise<unknown>
}

export const createBuilder = <T extends HasId>(
  info: CreatorInfo<T>
): Route => ({
  path: "/insert",
  method: "post",
  endpointBuilder: (async (req, res) => {
    const levelBody = await info.validate(req.body)
    if (isParseError(levelBody)) return res.status(400).json(levelBody)

    const item = levelBody as T
    const jwtBody = req.jwtBody

    const canCreate = info.perms?.(jwtBody, item) ?? true

    if (!canCreate) {
      return res.status(401).json({error: "Cannot create"})
    }

    const level = await info.endpoint.insertOne(item)

    if (!isValid<LevelInfo>(level)) return res.status(500).json(level)

    await info.postCreate?.(level)

    return res.json(level)
  }) satisfies AuthReqHandler
})

type QueryInfo<T extends HasId> = {
  endpoint: BasicEndpoints<T>
  perms?: (s: JWTBody | undefined) => Condition<T>
}

export const queryBuilder = <T extends HasId>(info: QueryInfo<T>): Route => ({
  path: "/query",
  method: "post",
  endpointBuilder: (async (req, res) => {
    const query = info.perms?.(req.jwtBody) ?? {}

    const fullQuery: Condition<T> = {and: [req.body, query]}

    const items = await info.endpoint.findMany(fullQuery)
    return res.json(items)
  }) satisfies AuthReqHandler
})

type UpdateInfo<T extends HasId> = {
  endpoint: BasicEndpoints<T>
  perms?: (s: JWTBody | undefined) => Condition<T>
  validate: (body: any) => Partial<T> | {error: any}
}

export const modifyBuilder = <T extends HasId>(info: UpdateInfo<T>): Route => ({
  path: "/:id",
  method: "put",
  endpointBuilder: (async (req, res) => {
    const {body, params, jwtBody} = req
    const id = params.id

    const condition = info.perms?.(jwtBody) ?? {}

    const level = await info.endpoint.findOne({and: [condition, idEquals(id)]})

    if (!isValid(level)) return res.status(404).json("Not found")

    const levelPartial = info.validate(body)

    if (!isValid<T>(levelPartial)) return res.status(400).json(levelPartial)

    const updatedLevel = await info.endpoint.updateOne(params.id, levelPartial)

    return res.json(updatedLevel)
  }) satisfies AuthReqHandler
})

type DeleteInfo<T extends HasId> = {
  endpoint: BasicEndpoints<T>
  perms: (s: JWTBody | undefined) => Condition<T>
  postDelete?: (item: T) => Promise<unknown>
}

export const deleteBuilder = <T extends HasId>(info: DeleteInfo<T>): Route => ({
  path: "/:id",
  method: "delete",
  endpointBuilder: (async (req, res) => {
    const condition = info.perms(req.jwtBody)

    const deleted = await info.endpoint.deleteOne(req.params.id, condition)
    await info.postDelete?.(deleted)
    return res.json(deleted._id)
  }) satisfies AuthReqHandler
})

const idEquals = <T extends HasId>(id: string): Condition<T> =>
  ({
    _id: id
  } as Condition<T>)

export type BuildEndpoints<T extends HasId> = (db: DbClient) => {
  get: ReturnType<typeof getBuilder<T>>
  query: ReturnType<typeof queryBuilder<T>>
  create: ReturnType<typeof createBuilder<T>>
  modify: ReturnType<typeof modifyBuilder<T>>
  delete: ReturnType<typeof deleteBuilder<T>>
}
export type BuildEndpoints1<T extends HasId> = (db: DbClient) => {
  endpoint: BasicEndpoints<T>
  get: ReturnType<typeof getBuilder<T>>
  query: ReturnType<typeof queryBuilder<T>>
  create: ReturnType<typeof createBuilder<T>>
  modify: ReturnType<typeof modifyBuilder<T>>
  delete: ReturnType<typeof deleteBuilder<T>>
}

export const createBasicEndpoints = <T extends HasId>(
  fun: BuildEndpoints1<T>
) => ({})
