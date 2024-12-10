export type User = {
  _id: string
  name: string
  email?: string | undefined
  highScore: number
  userType: "User" | "Editor" | "Admin"
}

export type LoginBody = {
  email: string
  code: string
}
export type LoginResponse = {
  user: User
  token: string
}

export type Score = {
  _id: string
  userId: string
  score: number
}

export type HasId = {
  _id: string
}

export type Condition<T> =
  | {equal: T}
  | {assign: T}
  | {inside: T[]}
  | {or: Array<Condition<T>>}
  | {and: Array<Condition<T>>}
  | {always: true}
  | (T extends object ? {[P in keyof T]?: Condition<T[P]>} : never)

export type TopScore = {
  name: string
  score: number
}
