import bcrypt from "bcrypt"
import {JWTBody, ReqBuilder} from "../auth/authTypes"
import jwt from "jsonwebtoken"
import {checkValidation, isParseError} from "../request_body"

function createUserToken(jwtBody: JWTBody) {
  return jwt.sign(jwtBody, process.env.ENCRYPTION_KEY!, {})
}

const sendUserBody = (user: any) => {
  const {passwordHash, ...userWithoutPassword} = user
  return userWithoutPassword
}

export const createUser: ReqBuilder =
  (client) =>
  async ({body, jwtBody}, res) => {
    const passwordHash = await bcrypt.hash(body.password, 10)
    const userBody = checkValidation("user", {...body, passwordHash})
    if (isParseError(userBody)) return res.status(400).json(userBody)

    const emailExists = await client.user.findOne({
      email: userBody.email
    })
    if (emailExists) {
      return res.status(400).json({error: "Email already exists"})
    }
    const user = await client.user.insertOne(userBody)
    if (!user) return res.status(500).json({error: "Error creating user"})

    const token = createUserToken({userId: userBody._id})

    const highScore = body.highScore || 0
    const scoreBody = checkValidation("score", {
      ...body,
      userId: userBody._id,
      score: highScore
    })

    if (isParseError(scoreBody)) return res.status(400).json(userBody)
    await client.score.insertOne(scoreBody)

    return res.json({user: sendUserBody(user), token})
  }

export const getUser: ReqBuilder =
  (client) =>
  async ({params, jwtBody}, res) => {
    if (jwtBody?.userId !== params.id) {
      return res.status(401).json("Unauthorized")
    }
    const user = await client.user.findOne({_id: params.id})
    if (!user) return res.status(404)
    return res.json(sendUserBody(user))
  }

export const getSelf: ReqBuilder =
  (client) =>
  async ({jwtBody}, res) => {
    console.log(jwtBody)
    console.log(jwtBody?.userId)
    const user = await client.user.findOne({
      _id: jwtBody?.userId || ""
    })
    if (!user) return res.status(404)
    return res.json(sendUserBody(user))
  }

export const loginUser: ReqBuilder =
  (client) =>
  async ({body}, res) => {
    // if (!("email" in body) || !(typeof body.email === "string")) {
    //   return res.status(400).json({error: "Email is required"})
    // }
    // if (!("password" in body) || !(typeof body.password === "string")) {
    //   return res.status(400).json({error: "Password is required"})
    // }
    const loginBody = {
      email: body.email,
      password: body.password
    }

    const user = await client.user.findOne({email: loginBody.email})
    if (!user) {
      res.status(404).json({message: "Invalid email or password"})
      return
    }

    const isValid = await bcrypt.compare(loginBody.password, user.passwordHash)
    if (!isValid) {
      return res.status(404).json({message: "Invalid email or password"})
    }

    return res.json({
      user: sendUserBody(user),
      token: createUserToken({userId: user._id})
    })
  }

export const queryUser: ReqBuilder =
  (client) =>
  async ({body, jwtBody}, res) => {
    // const condition = jwtBody?.admin ? body : {...body, _id: jwtBody?.userId}
    const users = await client.user.findMany(body)
    return res.json(users?.map(sendUserBody))
  }
