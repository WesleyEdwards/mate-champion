import {z} from "zod"
import jwt from "jsonwebtoken"
import {v4 as uuidv4} from "uuid"
import {User} from "./user_controller"
import {authCodeSchema} from "./auth_controller"
import {checkValidSchema, isParseError} from "simply-served"
import {MServerCtx} from "../controllers/appClients"
import {buildQuery} from "simply-served"
import {createSchema} from "../helpers"
import {JWTBody} from "../types"

function createUserToken(user: User) {
  const body: JWTBody = {
    userId: user._id,
    userType: user.userType
  }
  return jwt.sign(body, process.env.ENCRYPTION_KEY!, {})
}

const sendUserBody = (user: User, self: JWTBody | undefined) => {
  if (!self) return null
  if (self.userType === "Admin" || user._id === self.userId) {
    const {passwordHash, ...userWithoutPassword} = user
    return userWithoutPassword
  }
  const {passwordHash, userType: _, ...userWithoutPassword} = user
  return userWithoutPassword
}

const createAccountSchema = createSchema((z) =>
  z.object({
    email: z.string().email({message: "Invalid email"}),
    name: z.string().optional(),
    highScore: z.number().optional()
  })
)

export const createAccount = buildQuery<
  MServerCtx,
  z.infer<typeof createAccountSchema>
>({
  validator: createAccountSchema,
  authOptions: {skipAuth: true},
  fun: async ({db, email, req, res}) => {
    const {body} = req
    const user = await db.user.findOne({email: {Equal: body.email}})

    if (!user.success) {
      const newUser: User = {
        name: body.name ?? body.email,
        email: body.email,
        passwordHash: undefined,
        highScore: body.highScore ?? 0,
        userType: "User",
        _id: uuidv4()
      }
      await db.user.insertOne(newUser)
    }

    const authCode = checkValidSchema(
      {code: randomCode(), email: body.email},
      authCodeSchema
    )
    if (isParseError(authCode)) {
      return res.status(400).json(authCode)
    }

    db.authCode.insertOne(authCode)

    await email.send({
      html: `Your verification code is <b>${authCode.code}</b>`,
      subject: "Mate Champion Verification",
      to: body.email
    })
    return res.status(200).json({identifier: authCode._id})
  }
})

export const sendAuthCode = buildQuery<MServerCtx, {email: string}>({
  validator: createSchema((z) =>
    z.object({
      email: z.string().email({message: "Invalid email"})
    })
  ),
  authOptions: {skipAuth: true},
  fun: async ({db, email, req, res}) => {
    const {body} = req
    const user = await db.user.findOne({email: {Equal: body.email}})

    if (!user.success) {
      return res.status(400).json({message: "No user found"})
    }

    const authCode = checkValidSchema(
      {code: randomCode(), email: body.email},
      authCodeSchema
    )
    if (isParseError(authCode)) {
      return res.status(400).json(authCode)
    }

    db.authCode.insertOne(authCode)

    await email.send({
      html: `Your verification code is <b>${authCode.code}</b>`,
      subject: "Mate Champion Verification",
      to: body.email
    })
    return res.status(200).json({identifier: authCode._id})
  }
})

export const submitAuthCode = buildQuery<
  MServerCtx,
  {email: string; code: string}
>({
  validator: createSchema((z) =>
    z.object({email: z.string(), code: z.string()})
  ),
  authOptions: {skipAuth: true},
  fun: async ({db, req, res}) => {
    const {body} = req
    const code = await db.authCode.findOne({
      And: [{email: {Equal: body.email}}, {code: {Equal: body.code}}]
    })

    if (!code.success) {
      return res.status(400).json("Invalid code")
    }

    const user = await db.user.findOne({email: {Equal: body.email}})

    if (!user.success) {
      return res.status(400).json("unable to find user")
    }

    await db.authCode.deleteOne(code.data._id)

    return res.json({
      user: sendUserBody(user.data, {
        userId: user.data._id,
        userType: user.data.userType
      }),
      token: createUserToken(user.data)
    })
  }
})

export const getSelf = buildQuery<MServerCtx, User>({
  authOptions: {
    auth: () => ({Always: true})
  },
  fun: async ({res, db, auth}) => {
    const user = await db.user.findOne({
      _id: {Equal: auth.userId}
    })
    if (!user.success) return res.status(404).json("Not found")
    return res.json(sendUserBody(user.data, auth))
  }
})

function randomCode() {
  let result = ""
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  let counter = 0
  while (counter < 6) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
    counter += 1
  }
  return result
}

// export const loginWithPassword = buildMCQuery({
//   validator: createSchema((z) =>
//     z.object({email: z.string(), password: z.string()})
//   ),
//   fun: async ({req, res, db}) => {
//     const {body} = req

//     const findUser = await db.user.findOne({
//       email: {Equal: body.email}
//     })

//     if (!findUser.success) {
//       return res.status(404).json({message: "Invalid credentials"})
//     }
//     const {data: user} = findUser

//     if (!user.passwordHash) {
//       return res.status(404).json({message: "No password for this user."})
//     }

//     const isValidPassword = await bcrypt.compare(
//       body.password,
//       user.passwordHash
//     )
//     if (!isValidPassword) {
//       return res.status(404).json({message: "Invalid credentials"})
//     }

//     return res.json({
//       user: sendUserBody(user, {userId: user._id, userType: user.userType}),
//       token: createUserToken(user)
//     })
//   }
// })
