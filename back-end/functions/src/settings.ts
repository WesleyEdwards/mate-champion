import dotenv from "dotenv"

dotenv.config({path: `.env.${process.env.NODE_ENV || "production"}`})

console.log("NODE_ENV is", process.env.NODE_ENV)

export type Settings = {
  mongoUri: string
  emailProvider: string
  emailApiKey: string
  emailSecretKey: string
}

export const settings: Settings = {
  mongoUri: process.env.MONGO_URI!,
  emailProvider: process.env.EMAIL_PROVIDER!,
  emailApiKey: process.env.MAILJET_API_KEY!,
  emailSecretKey: process.env.MAILJET_SECRET!
}
