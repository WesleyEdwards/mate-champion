export type User = {
  _id: string
  createdAt: string
  updatedAt: string
  name: string
  email?: string | undefined
  highScore: number
  userType: "User" | "Editor" | "Admin"
}

export type LoginBody = {
  email: string
  password: string
}

export type Score = {
  _id: string
  userId: string
  score: number
}

export type HasId = {
  _id: string
}

export type Condition<T extends HasId> = {
  [P in keyof T]?: T[P][] | T[P]
}

export type TopScore = {
  name: string
  score: number
}
