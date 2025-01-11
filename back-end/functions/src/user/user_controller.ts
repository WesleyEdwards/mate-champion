import {maskKeys, modelRestEndpoints} from "simply-served"
import {Infer, userTypeSchema} from "../types"
import {createDbObject, permsIfNotAdmin} from "../helpers"

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

export const usersController = modelRestEndpoints({
  validator: userSchema,
  collection: (db) => db.user,
  permissions: permsIfNotAdmin<User>({
    read: () => ({Always: true}),
    delete: ({auth}) => ({
      _id: {Equal: auth?.userId ?? ""}
    }),
    create: () => ({Never: true}),
    modify: ({auth}) => ({
      _id: {Equal: auth?.userId ?? ""}
    })
  }),
  actions: {
    prepareResponse: maskKeys(["passwordHash"])
  }
})
