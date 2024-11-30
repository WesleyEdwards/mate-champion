import {controller} from "../auth/controller"
import {ifNotAdmin} from "../levelInfo/level_controller"
import {createBasicEndpoints} from "../requestBuilders"
import {createDbObject, Infer, userTypeSchema} from "../types"

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

const userBaseEndpoints = createBasicEndpoints<User>({
  validator: userSchema,
  endpoint: (db) => db.user,
  mask: ["passwordHash"],
  perms: {
    read: () => ({always: true}),
    delete: ifNotAdmin<User>((jwtBody) => ({
      _id: {equal: jwtBody?.userId ?? ""}
    })),
    create: ifNotAdmin<User>(() => ({never: true})),
    modify: ifNotAdmin<User>((jwtBody) => ({
      _id: {equal: jwtBody?.userId ?? ""}
    }))
  },
  builder: {create: {}, del: {}, get: {}, modify: {}, query: {}}
})

export const usersController = controller("user", userBaseEndpoints)
