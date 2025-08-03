import {EmailClient} from "../appClients"
import {Client, SendEmailV3_1, LibraryResponse} from "node-mailjet"
import {settings} from "../settings"

export const emailClient = (): EmailClient => {
  if (settings.emailProvider === "mailjet") {
    return mailjetClient()
  }
  return localEmail()
}

const mailjet = new Client({
  apiKey: settings.emailApiKey,
  apiSecret: settings.emailSecretKey
})

const mailjetClient = (): EmailClient => {
  return {
    send: async (params) => {
      const result: LibraryResponse<SendEmailV3_1.Response> = await mailjet
        .post("send", {version: "v3.1"})
        .request({
          Messages: [
            {
              From: {
                Email: "noreply@wesleyedwards.xyz"
              },
              To: [
                {
                  Email: params.to
                }
              ],
              Subject: params.subject,
              HTMLPart: params.html,
              TextPart: ""
            }
          ]
        })

      result.body.Messages[0]
    }
  }
}

const localEmail = (): EmailClient => {
  return {
    send: async (params) => {
      try {
        console.info(
          `
          ------------------------------
          Sending email to ${params.to}
          ${params.subject}
          ${params.html}
          ------------------------------

          `
        )
      } catch (error: any) {
        console.error(error)
        if (error.response) {
          console.error(error.response.body)
        }
      }
    }
  }
}
