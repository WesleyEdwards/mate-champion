import {AuthCode} from "../../src/controllers/auth_controller"

export const mockAuthCodes: AuthCode[] = [
  {
    _id: "41f3d0df-d098-4f80-b776-4501db0ad8ce",
    code: "TESTCO",
    email: "wesley@test.com"
  }
]

export const authorizedToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhMzA5NzQ1YS1kYjg2LTQ0ZjAtOTdkYy0zNTJlZjlmNjIyNTciLCJ1c2VyVHlwZSI6IlVzZXIiLCJpYXQiOjE3MzMzNzQwMjB9.SpsNZMorWFlxVOSmcuvhepFmYfMuUsiRKiict0-jZDc"
