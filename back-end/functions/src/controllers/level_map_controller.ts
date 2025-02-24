import {MServerCtx} from "../appClients"
import {
  baseObjectSchema,
  buildQuery,
  Condition,
  NotFoundError,
  Route
} from "simply-served"
import {createSchema} from "../helpers"
import {LevelInfo} from "./level_controller"
import {z} from "zod"
import {coors, Infer} from "../types"

export type LevelMap = Infer<typeof levelMapSchema>
export const levelMapSchema = z
  .object({
    champInitPos: coors.default([400, 400]),
    packages: coors.array().default([]),
    endPosition: z.number().default(4500),
    groog: z
      .object({
        position: coors,
        moveSpeed: z.number().gte(0).default(0.3),
        facingRight: z.boolean().default(true),
        timeBetweenJump: z.object({
          time: z.number().default(2000),
          type: z.enum(["None", "Time", "Random"]).default("Time")
        }),
        timeBetweenTurn: z.object({
          time: z.number().default(3000),
          type: z.enum(["None", "Time", "Random"]).default("Time")
        })
      })
      .array()
      .default([]),
    platformColor: z.string().default("springgreen"),
    platforms: z
      .object({
        dimensions: coors,
        position: coors,
        color: z.string().nullable().default(null)
      })
      .array()
      .default([]),
    floors: z
      .object({
        x: z.number(),
        width: z.number()
      })
      .array()
      .default([])
  })
  .merge(baseObjectSchema)

export const levelMapController: Route<MServerCtx>[] = [
  buildQuery<MServerCtx>({path: "/:id", method: "get"})
    .withAuth({type: "authenticated"})
    .build(async ({req, res, db, auth}) => {
      const {params} = req
      if (!params.id || typeof params.id !== "string") {
        return res.status(400).json("Bad request")
      }
      const level = await db.level.findOne({_id: {Equal: params.id}})
      if (
        level.owner !== auth.userId &&
        auth.userType !== "Admin" &&
        !level.public
      ) {
        return res.status(404).json("Cant access")
      }
      const levelMap = await db.levelMap.findOne({_id: {Equal: params.id}})
      return res.json(levelMap)
    }),
  buildQuery<MServerCtx>({path: "/:id", method: "put"})
    .withAuth({type: "authenticated"})
    .withBody({validator: levelMapSchema.partial()})
    .build(async ({req, res, db, auth}) => {
      const {params, body} = req
      const condition: Condition<LevelInfo> =
        auth.userType === "Admin"
          ? {_id: {Equal: params.id}}
          : {And: [{_id: {Equal: params.id}}, {owner: {Equal: auth.userId}}]}
      const level = await db.level.findOne(condition)
      if (!level) {
        throw new NotFoundError("Level not found")
      }
      const updatedLevel = await db.levelMap.updateOne(params.id, body)

      return res.json(updatedLevel)
    }),
  buildQuery<MServerCtx>({path: "/generate", method: "post"})
    .withAuth({type: "authenticated"})
    .withBody({
      validator: createSchema((z) =>
        z.object({
          levels: z.array(z.string())
        })
      )
    })
    .build(async ({req, res, db}) => {
      const levelIds = req.body.levels
      const levels = await db.levelMap.findMany({
        condition: {_id: {Inside: levelIds}}
      })

      return res.json(
        levels.sort((a, b) => levelIds.indexOf(a._id) - levelIds.indexOf(b._id))
      )
    }),
  buildQuery<MServerCtx>({path: "/", method: "post"})
    .withAuth({type: "authenticated"})
    .withBody({
      validator: z.object({levels: z.array(z.string())})
    })
    .build(async ({req, res, db, auth}) => {
      auth
      return res.json({})
    })
]
