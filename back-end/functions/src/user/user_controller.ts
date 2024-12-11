import {createBasicMCEndpoints} from "../controllers/serverBuilders"
import {controller} from "../simpleServer/controller"
import {ifNotAdmin} from "../levelInfo/level_controller"
import {createDbObject} from "../simpleServer/validation"
import {Infer, userTypeSchema} from "../types"
import {maskKeys} from "../simpleServer/requestBuilders"

export type User = Infer<typeof userSchema>

const userSchema = createDbObject((z) =>
  z.object({
    name: z.string({required_error: "Name is required"}),
    email: z.string().email({message: "Invalid email"}),
    passwordHash: z.string().optional(),
    highScore: z.number().default(0),
    userType: userTypeSchema.default("User")
  })
)

const userBaseEndpoints = createBasicMCEndpoints<User>({
  validator: userSchema,
  endpoint: (db) => db.user,
  preRes: maskKeys(["passwordHash"]),
  perms: {
    read: () => ({Always: true}),
    delete: ifNotAdmin<User>((jwtBody) => ({
      _id: {Equal: jwtBody?.userId ?? ""}
    })),
    create: ifNotAdmin<User>(() => ({Never: true})),
    modify: ifNotAdmin<User>((jwtBody) => ({
      _id: {Equal: jwtBody?.userId ?? ""}
    }))
  }
})

export const usersController = controller("user", userBaseEndpoints)
