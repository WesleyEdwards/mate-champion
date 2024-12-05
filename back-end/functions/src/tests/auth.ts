import request from "supertest"
import {LocalTests} from "./test"
import {authorizedToken} from "./mocks/authCodes"

export const authTests: LocalTests = (mockApp) => {
  const path = "auth"

  describe("Submit Auth code", () => {
    it("Successful submission", async () => {
      const response = await request(mockApp)
        .post(`/${path}/submitAuthCode`)
        .send({
          code: "TESTCO",
          email: "wesley@test.com"
        })
      expect(response.status).toBe(200)
      expect(response.body.user).toMatchObject({
        _id: "a309745a-db86-44f0-97dc-352ef9f62257",
        email: "wesley@test.com",
        highScore: 100,
        name: "Wesley",
        userType: "User"
      })
      expect(response.body.token).toBeTruthy()
    })
    it("Get self", async () => {
      const response = await request(mockApp)
        .get(`/${path}/self`)
        .set("Authorization", `bearer ${authorizedToken}`)
      console.log(response.body)
      expect(response.status).toBe(200)
      expect(response.body).toMatchObject({
        _id: "a309745a-db86-44f0-97dc-352ef9f62257",
        email: "wesley@test.com",
        highScore: 100,
        name: "Wesley",
        userType: "User"
      })
    })
  })
}
