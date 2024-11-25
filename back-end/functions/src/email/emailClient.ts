import {MailDataRequired, MailService} from "@sendgrid/mail"

const sgMail: MailService = require("@sendgrid/mail")

import {EmailClient} from "../appClients"

const msg: MailDataRequired = {
  from: "westheedwards@gmail.com",
  html: ""
}

export const emailClient = (key: string): EmailClient => {
  sgMail.setApiKey(key)

  return {
    send: async (params) => {
      console.log("Sending email")
      try {
        const res = await sgMail.send({...msg, ...params})

        console.log("Send email", res[0].toString())
      } catch (error: any) {
        console.error(error)

        if (error.response) {
          console.error(error.response.body)
        }
      }
    }
  }
}
