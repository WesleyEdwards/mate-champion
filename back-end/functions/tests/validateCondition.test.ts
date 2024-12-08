import {z} from "zod"
import {Condition, createConditionSchema} from "../src/condition"
import {Animal, animalSchema, AnimalType} from "./mocks/conditions"

describe("assures the correct schema is created from `createConditionSchema`", () => {
  const stringSchema = createConditionSchema(z.string())
  const stringSchemaParse = (b: any) => stringSchema.safeParse(b)

  const successAndMatchObj = (b: any) =>
    expect(stringSchemaParse(b)).toMatchObject({
      success: true,
      data: b
    })

  const unSuccessful = (b: any) =>
    expect(stringSchemaParse(b).success).toBe(false)

  test("Invalid input", () => {
    unSuccessful("")
    unSuccessful(4)
    unSuccessful(null)
    unSuccessful([])
    unSuccessful(() => {})
  })

  test("Always & Never", () => {
    successAndMatchObj({always: true})
    successAndMatchObj({never: true})

    unSuccessful({always: false})
    unSuccessful({never: false})
    unSuccessful({always: {}})
    unSuccessful({never: 3})
  })

  test("Equal", () => {
    successAndMatchObj({equal: ""})
    successAndMatchObj({equal: "asdf"})

    unSuccessful({equal: 3})
    unSuccessful({equal: null})
    unSuccessful({equal: undefined})
  })

  test("Inside", () => {
    successAndMatchObj({inside: []})
    successAndMatchObj({inside: [""]})
    successAndMatchObj({inside: ["asdf", "", "foo"]})

    unSuccessful({inside: ["asdf", "", 34]})
    unSuccessful({inside: [3]})
    unSuccessful({inside: [null]})
    unSuccessful({inside: [undefined]})
    unSuccessful({inside: {key: "undefined"}})
  })

  const validStringConditions = [
    {always: true},
    {never: true},
    {equal: ""},
    {equal: "asdf"},
    {inside: []},
    {inside: ["asdf", "", "foo"]}
  ]
  const invalidStringConditions = [
    {always: false},
    {never: false},
    "",
    [3],
    {},
    {inside: ["asdf", "", 34]},
    [undefined],
    {key: "undefined"},
    {equal: {key: "undefined"}}
  ]

  test("ListAnyElement", () => {
    for (const valid of [...validStringConditions, invalidStringConditions]) {
      unSuccessful({listAnyElement: valid})
    }
  })

  test("Or", () => {
    for (const valid of validStringConditions) {
      successAndMatchObj({or: [valid]})
    }
    for (const invalid of invalidStringConditions) {
      unSuccessful({or: [invalid]})
    }
    successAndMatchObj({or: validStringConditions})
    successAndMatchObj({or: [{or: validStringConditions}]})
    successAndMatchObj({or: [{or: [{or: validStringConditions}]}]})
    successAndMatchObj({or: [{or: [{or: [{always: true}]}]}]})
  })
  test("And", () => {
    for (const valid of validStringConditions) {
      successAndMatchObj({and: [valid]})
    }
    for (const invalid of invalidStringConditions) {
      unSuccessful({and: [invalid]})
    }
    successAndMatchObj({and: validStringConditions})
    successAndMatchObj({and: [{and: validStringConditions}]})
    successAndMatchObj({and: [{and: [{and: validStringConditions}]}]})
    successAndMatchObj({and: [{and: [{and: [{always: true}]}]}]})
  })
})

describe("assures the correct schema is created from `createConditionSchema` with objects", () => {
  const animalParseSchema = (b: any) =>
    createConditionSchema(animalSchema).safeParse(b)

  const successAndMatchObj = (b: any) =>
    expect(animalParseSchema(b)).toMatchObject({
      success: true,
      data: b
    })

  const unSuccessful = (b: any) =>
    expect(animalParseSchema(b).success).toBe(false)

  test("Invalid input", () => {
    const validAnimalConditions: Condition<Animal>[] = [
      {always: true},
      {_id: {equal: "1234"}},
      {age: {equal: 4}},
      {type: {inside: [AnimalType.Mammal]}},
      {parents: {listAnyElement: {gender: {equal: "Male"}}}},
      {parents: {listAnyElement: {always: true}}},
      {parents: {listAnyElement: {name: {equal: "Bella"}}}},
      {
        parents: {
          listAnyElement: {
            and: [{gender: {equal: "Male"}}, {_id: {inside: ["123-father"]}}]
          }
        }
      }
    ]
    for (const c of validAnimalConditions) {
      successAndMatchObj(c)
    }
    const invalidAnimalConditions = [
      {always: false},
      {_id: {inside: "1234"}},
      {ageIncorrect: {equal: 4}},
      {type: {inside: [3]}},
      {parents: {listAnyElement: {gender: {equal: 3}}}},
      {parents: {age: {always: true}}},
      {parents: {listAnyElement: {nameIncorrect: {equal: "Bella"}}}},
      {
        parents: {
          listAnyElement: {
            and: [
              {gender: {equal: "Male"}},
              {_id: {inside: ["123-father"]}},
              {never: false}
            ]
          }
        }
      }
    ]
    for (const c of invalidAnimalConditions) {
      unSuccessful(c)
    }
  })
})
