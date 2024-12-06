import {User} from "../../src/user/user_controller"

export const mockUserList: User[] = [
  {
    _id: "a309745a-db86-44f0-97dc-352ef9f62257",
    email: "wesley@test.com",
    highScore: 100,
    name: "Wesley",
    userType: "User",
    passwordHash: ""
  },
  {
    _id: "53df935f-b9b0-42a2-acf8-bd1ef0ddcddd",
    email: "wesley+admin@test.com",
    highScore: 100,
    name: "Wesley",
    userType: "Admin",
    passwordHash: ""
  }
]
