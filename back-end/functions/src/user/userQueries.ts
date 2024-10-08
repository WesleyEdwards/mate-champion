import bcrypt from "bcrypt"
import {JWTBody, ReqBuilder} from "../auth/authTypes"
import jwt from "jsonwebtoken"
import {
  checkPartialValidation,
  checkValidation,
  isParseError
} from "../request_body"
import {User} from "../types"
import {queryContainsKey} from "../DbClient"

function createUserToken(user: User) {
  return jwt.sign(
    {
      userId: user._id,
      userType: user.userType
    } satisfies JWTBody,
    process.env.ENCRYPTION_KEY!,
    {}
  )
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

export const createUser: ReqBuilder =
  (client) =>
  async ({body}, res) => {
    const passwordHash = await bcrypt.hash(body.password, 10)
    const userBody = checkValidation("user", {...body, passwordHash})
    if (isParseError(userBody)) return res.status(400).json(userBody)

    const emailExists = userBody.email
      ? await client.user.findOne({
          email: userBody.email
        })
      : false

    if (emailExists) {
      return res.status(400).json({error: "Email already exists"})
    }
    const user = await client.user.insertOne(userBody)
    if (!user) return res.status(500).json({error: "Error creating user"})

    const token = createUserToken({...userBody, userType: "User"})

    const scoreBody = checkValidation("score", {
      ...body,
      userId: userBody._id,
      score: userBody.highScore
    })

    if (isParseError(scoreBody)) return res.status(400).json(userBody)
    await client.score.insertOne(scoreBody)

    return res.json({
      user: sendUserBody(user, {userId: user._id, userType: user.userType}),
      token
    })
  }

export const getUser: ReqBuilder =
  (client) =>
  async ({params, jwtBody}, res) => {
    const user = await client.user.findOne({_id: params.id})
    if (!user) return res.status(404).json("Not found")
    return res.json(sendUserBody(user, jwtBody))
  }

export const getSelf: ReqBuilder =
  (client) =>
  async ({jwtBody}, res) => {
    const user = await client.user.findOne({
      _id: jwtBody?.userId || ""
    })
    if (!user) return res.status(404).json("Not found")
    return res.json(sendUserBody(user, jwtBody))
  }

export const loginUser: ReqBuilder =
  (client) =>
  async ({body}, res) => {
    const loginBody = {
      email: body.email,
      password: body.password
    }

    if (!loginBody.email) {
      res.status(404).json({message: "Invalid credentials"})
      return
    }
    const userWithEmail = await client.user.findOne({email: loginBody.email})
    const userWithName = await client.user.findOne({name: loginBody.email})
    const user = userWithEmail ?? userWithName

    if (!user) {
      res.status(404).json({message: "Invalid credentials"})
      return
    }

    const isValid = await bcrypt.compare(loginBody.password, user.passwordHash)
    if (!isValid) {
      return res.status(404).json({message: "Invalid credentials"})
    }

    return res.json({
      user: sendUserBody(user, {userId: user._id, userType: user.userType}),
      token: createUserToken(user)
    })
  }

export const queryUser: ReqBuilder =
  (client) =>
  async ({body, jwtBody}, res) => {
    // Users should not be able to query by userType. If they were able to,
    // they could easily identify who the admins are.
    if (queryContainsKey(body, "userType") && jwtBody?.userType !== "Admin") {
      return res.status(401).json("Unauthorized")
    }
    const users = await client.user.findMany(body)
    return res.json(users?.map((u) => sendUserBody(u, jwtBody)))
  }

export const modifyUser: ReqBuilder =
  (client) =>
  async ({params, body, jwtBody}, res) => {
    if (jwtBody?.userType !== "Admin") {
      if (jwtBody?.userId !== params.id || body.userType) {
        return res.status(401).json("Unauthorized")
      }
    }
    const user = await client.user.findOne({_id: params.id})
    if (!user) return res.status(404).json("Not found")
    const userPartial = checkPartialValidation("user", {
      ...body,
      _id: params.id,
      updatedAt: new Date().toISOString()
    })
    if (isParseError(userPartial)) return res.status(400).json(userPartial)

    const updatedUser = await client.user.updateOne(params.id, userPartial)
    if (!updatedUser) return res.status(500).json("Error updating user")
    return res.json(sendUserBody(updatedUser, jwtBody))
  }

export const deleteUser: ReqBuilder =
  (client) =>
  async ({params, jwtBody}, res) => {
    if (jwtBody?.userType !== "Admin") {
      if (jwtBody?.userId !== params.id) {
        return res.status(401).json("Unauthorized")
      }
    }
    const scores = await client.score.findMany({userId: params.id})
    await Promise.all(scores.map((score) => client.score.deleteOne(score._id)))
    const user = await client.user.deleteOne(params.id)
    return res.json(user)
  }
