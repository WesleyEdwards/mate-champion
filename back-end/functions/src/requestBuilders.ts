import {JWTBody, AuthReqHandler} from "./auth/authTypes"
import {Route} from "./auth/controller"
import {BasicEndpoints, HasId, Condition} from "./DbClient"
import {isParseError, isValid} from "./request_body"
import {LevelInfo} from "./types"

type Skippable = {skipAuth?: boolean}
// If perms are not supplied, it defaults to just being authenticated.
type GetterInfo<T extends HasId> = Skippable & {
  perms?: (jwt: JWTBody | undefined) => Condition<T>
  preResponseFilter?: (items: T) => T
}

const idCondition = <T extends HasId>(id: string): Condition<T> => {
  return {_id: {equal: id}} as Condition<T>
}
const getBuilder = <T extends HasId>(
  info: GetterInfo<T>,
  endpoint: BasicEndpoints<T>
): Route => ({
  path: "/:id",
  method: "get",
  skipAuth: info.skipAuth,
  endpointBuilder: (async (req, res) => {
    const {params, jwtBody} = req
    const {id} = params

    if (!id || typeof id !== "string") {
      return res.status(400).json("Bad request")
    }

    const condition = info.perms?.(jwtBody) ?? {always: true}
    const item = await endpoint.findOne({
      and: [idCondition(id), condition]
    })

    if (isParseError(item)) return res.status(404).json(item)

    return res.json(item)
  }) satisfies AuthReqHandler
})

type CreateInfo<T extends HasId> = Skippable & {
  perms?: (jwt: JWTBody | undefined) => boolean
  validate: (
    body: unknown,
    jwtBody: JWTBody | undefined
  ) => Promise<T | {error: any}>
  postCreate?: (item: T) => Promise<unknown>
  preResponseFilter?: (items: T) => T
}

const createBuilder = <T extends HasId>(
  info: CreateInfo<T>,
  endpoint: BasicEndpoints<T>
): Route => ({
  path: "/insert",
  method: "post",
  endpointBuilder: (async (req, res) => {
    const {jwtBody} = req
    console.log("Trying to post", req.body)
    const levelBody = await info.validate(req.body, jwtBody)
    if (isParseError(levelBody)) return res.status(400).json(levelBody)

    const item = levelBody as T

    const canCreate = info.perms?.(jwtBody) ?? true

    if (!canCreate) {
      return res.status(401).json({error: "Cannot create"})
    }

    const level = await endpoint.insertOne(item)

    if (!isValid<LevelInfo>(level)) return res.status(500).json(level)

    await info.postCreate?.(level)

    return res.json(level)
  }) satisfies AuthReqHandler
})

type QueryInfo<T extends HasId> = Skippable & {
  perms?: (s: JWTBody | undefined) => Condition<T>
  preResponseFilter?: (items: T[]) => T[]
}

const queryBuilder = <T extends HasId>(
  info: QueryInfo<T>,
  endpoint: BasicEndpoints<T>
): Route => ({
  path: "/query",
  method: "post",
  skipAuth: info.skipAuth,
  endpointBuilder: (async (req, res) => {
    const query = info.perms?.(req.jwtBody) ?? {}

    const fullQuery: Condition<T> = {and: [req.body, query]}

    const items = await endpoint.findMany(fullQuery)
    return res.json(items)
  }) satisfies AuthReqHandler
})

type ModifyInfo<T extends HasId> = Skippable & {
  perms?: (s: JWTBody | undefined) => Condition<T>
  validate: (
    body: any,
    jwtBody: JWTBody | undefined
  ) => Partial<T> | {error: any}
  preResponseFilter?: (items: T) => T
}

export const modifyBuilder = <T extends HasId>(
  info: ModifyInfo<T>,
  endpoint: BasicEndpoints<T>
): Route => ({
  path: "/:id",
  method: "put",
  skipAuth: info.skipAuth,
  endpointBuilder: (async (req, res) => {
    const {body, params, jwtBody} = req
    const id = params.id

    const condition = info.perms?.(jwtBody) ?? {always: true}

    const level = await endpoint.findOne({and: [condition, idCondition(id)]})

    if (!isValid(level)) return res.status(404).json("Not found")

    const levelPartial = info.validate(body, jwtBody)

    if (!isValid<T>(levelPartial)) return res.status(400).json(levelPartial)

    // if (id !== levelPartial._id) {
    //   return res.status(400).json({error: "Id must match"})
    // }

    console.log("LEVEL PARTIAL IS", levelPartial)

    const updatedLevel = await endpoint.updateOne(id, levelPartial)

    return res.json(updatedLevel)
  }) satisfies AuthReqHandler
})

type DeleteInfo<T extends HasId> = Skippable & {
  perms: (s: JWTBody | undefined) => Condition<T>
  postDelete?: (item: T) => Promise<unknown>
}

export const deleteBuilder = <T extends HasId>(
  info: DeleteInfo<T>,
  endpoint: BasicEndpoints<T>
): Route => ({
  path: "/:id",
  method: "delete",
  skipAuth: info.skipAuth,
  endpointBuilder: (async (req, res) => {
    const condition = info.perms(req.jwtBody)

    const deleted = await endpoint.deleteOne(req.params.id, condition)
    await info.postDelete?.(deleted)
    return res.json(deleted._id)
  }) satisfies AuthReqHandler
})

export type BuildEndpoints1<T extends HasId> = {
  endpoint: BasicEndpoints<T>
  get: GetterInfo<T> | null
  query: QueryInfo<T> | null
  create: CreateInfo<T> | null
  modify: ModifyInfo<T> | null
  del: DeleteInfo<T> | null
}

export const createBasicEndpoints = <T extends HasId>(
  builder: BuildEndpoints1<T>
) => {
  const {endpoint, get, create, query, modify, del} = builder

  const list = [
    get ? getBuilder(get, endpoint) : null,
    create ? createBuilder(create, endpoint) : null,
    query ? queryBuilder(query, endpoint) : null,
    modify ? modifyBuilder(modify, endpoint) : null,
    del ? deleteBuilder(del, endpoint) : null
  ]
  return list.filter((r) => r !== null)
}
