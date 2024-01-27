import bcrypt from "bcrypt"
import {JWTBody, ReqBuilder} from "../auth/authTypes"
import jwt from "jsonwebtoken"
import {
  checkPartialValidation,
  checkValidation,
  isParseError
} from "../request_body"

function createUserToken(jwtBody: JWTBody) {
  return jwt.sign(jwtBody, process.env.ENCRYPTION_KEY!, {})
}

const sendUserBody = (user: any, withAdmin?: boolean) => {
  if (withAdmin) {
    const {passwordHash, ...userWithoutPassword} = user
    return userWithoutPassword
  }
  const {passwordHash, admin, ...userWithoutPassword} = user
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

    const token = createUserToken({userId: userBody._id, admin: false})

    const scoreBody = checkValidation("score", {
      ...body,
      userId: userBody._id,
      score: userBody.highScore
    })

    if (isParseError(scoreBody)) return res.status(400).json(userBody)
    await client.score.insertOne(scoreBody)

    return res.json({user: sendUserBody(user), token})
  }

export const getUser: ReqBuilder =
  (client) =>
  async ({params, jwtBody}, res) => {
    if (!jwtBody?.admin && jwtBody?.userId !== params.id) {
      return res.status(401).json("Unauthorized")
    }
    const user = await client.user.findOne({_id: params.id})
    if (!user) return res.status(404)
    return res.json(sendUserBody(user, jwtBody?.admin))
  }

export const getSelf: ReqBuilder =
  (client) =>
  async ({jwtBody}, res) => {
    const user = await client.user.findOne({
      _id: jwtBody?.userId || ""
    })
    if (!user) return res.status(404)
    return res.json(sendUserBody(user, jwtBody?.admin))
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
      user: sendUserBody(user, user.admin),
      token: createUserToken({userId: user._id, admin: user.admin})
    })
  }

export const queryUser: ReqBuilder =
  (client) =>
  async ({body, jwtBody}, res) => {
    const users = await client.user.findMany(body)
    return res.json(users?.map((u) => sendUserBody(u, jwtBody?.admin)))
  }

export const modifyUser: ReqBuilder =
  (client) =>
  async ({params, body, jwtBody}, res) => {
    if (!jwtBody?.admin) {
      if (jwtBody?.userId !== params.id) {
        return res.status(401).json("Unauthorized")
      }
      if (body.admin) {
        return res.status(401).json("Unauthorized")
      }
    }
    const user = await client.user.findOne({_id: params.id})
    if (!user) return res.status(404)
    const userPartial = checkPartialValidation("user", {
      ...body,
      _id: params.id,
      updatedAt: new Date().toISOString()
    })
    if (isParseError(userPartial)) return res.status(400).json(userPartial)

    const updatedUser = await client.user.updateOne(params.id, userPartial)
    return res.json(sendUserBody(updatedUser, jwtBody?.admin))
  }

export const deleteUser: ReqBuilder =
  (client) =>
  async ({params, jwtBody}, res) => {
    if (!jwtBody?.admin) {
      if (jwtBody?.userId !== params.id) {
        return res.status(401).json("Unauthorized")
      }
    }
    const scores = await client.score.findMany({userId: params.id})
    await Promise.all(scores.map((score) => client.score.deleteOne(score._id)))
    const user = await client.user.deleteOne(params.id)
    return res.json(user)
  }
