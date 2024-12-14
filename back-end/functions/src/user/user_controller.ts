import {z} from "zod"
import {createBasicMCEndpoints} from "../controllers/serverBuilders"
import {ifNotAdmin} from "../levelInfo/level_controller"
import {maskKeys} from "../simpleServer/server/mask"
import {baseObjectSchema} from "../simpleServer/validation"
import {Infer, userTypeSchema} from "../types"

export type User = Infer<typeof userSchema>

const userSchema = z
  .object({
    name: z.string({required_error: "Name is required"}),
    email: z.string().email({message: "Invalid email"}),
    passwordHash: z.string().optional(),
    highScore: z.number().default(0),
    userType: userTypeSchema.default("User")
  })
  .merge(baseObjectSchema)

export const usersController = createBasicMCEndpoints({
  validator: userSchema,
  endpoint: (db) => db.user,
  permissions: {
    read: () => ({Always: true}),
    delete: ifNotAdmin<User>(({auth}) => ({
      _id: {Equal: auth?.userId ?? ""}
    })),
    create: ifNotAdmin<User>(() => ({Never: true})),
    modify: ifNotAdmin<User>(({auth}) => ({
      _id: {Equal: auth?.userId ?? ""}
    }))
  },
  actions: {
    prepareResponse: maskKeys(["passwordHash"])
  }
})
