import {maskKeysBasedOnPerms, modelRestEndpoints} from "simply-served"
import {Infer, userTypeSchema} from "../types"
import {createDbObject, permsIfNotAdmin} from "../helpers"
import {MServerCtx} from "../controllers/appClients"

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

export const usersController = modelRestEndpoints<MServerCtx, User>({
  validator: userSchema,
  collection: (db) => db.user,
  permissions: permsIfNotAdmin<User>({
    read: {
      modelAuth: (auth) => ({_id: {Equal: auth.userId}})
    },
    delete: {
      modelAuth: (auth) => ({_id: {Equal: auth.userId}})
    },
    create: {userAuth: {Never: true}},
    modify: {
      modelAuth: (auth) => ({_id: {Equal: auth.userId}})
    }
  }),
  actions: {
    prepareResponse: maskKeysBasedOnPerms((user, {auth}) => {
      if (!auth) return {passwordHash: true}
      const canViewAccess =
        auth.userType === "Admin" || user._id === auth.userId
      if (canViewAccess) {
        return {passwordHash: true}
      }
      return {passwordHash: true, userType: true}
    })
  }
})
