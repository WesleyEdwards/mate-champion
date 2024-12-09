import {Condition, evalCondition} from "../src/simpleServer/condition"
import {Animal, AnimalType, dog_test} from "./mocks/conditions"

// Test Condition system, specifically the typing and 'evalCondition' function
function testCondition<T>(condition: Condition<T>, inputs: [T, boolean][]) {
  inputs.forEach(([input, expected]) => {
    expect(evalCondition(input, condition)).toBe(expected)
  })
}

describe("Never Condition", () => {
  test("should always return false", () => {
    testCondition<any>({never: true}, [
      ["test", false],
      ["", false],
      [3, false],
      [true, false],
      [null, false]
    ])
  })
})
describe("Always Condition", () => {
  test("should always return true", () => {
    testCondition<any>({always: true}, [
      ["test", true],
      ["", true],
      [3, true],
      [true, true],
      [null, true]
    ])
  })
})

describe("Equal Condition", () => {
  test("should result in true or false", () => {
    testCondition({equal: "test"}, [
      ["test", true],
      ["not", false]
    ])
    testCondition({equal: ""}, [["", true]])
    testCondition<any>({equal: 3}, [
      [3, true],
      [12, false],
      ["3", false]
    ])
    testCondition({equal: true}, [
      [true, true],
      [false, false]
    ])
    testCondition({equal: null}, [
      [null, true],
      [undefined, false]
    ])
  })
})

test("Inside Condition", () => {
  testCondition({inside: ["test", "one"]}, [
    ["test", true],
    ["other", false]
  ])
  testCondition({inside: [1, 2, 3, 3]}, [
    [3, true],
    [1, true],
    [4, false]
  ])
  testCondition({inside: [false, true]}, [
    [true, true],
    [false, true],
    [null, false]
  ])
  testCondition({inside: [null, "", 4]}, [
    [null, true],
    [5, false]
  ])
})

test("Or Condition", () => {
  expect(evalCondition("test", {or: [{always: true}, {never: true}]})).toBe(
    true
  )
  expect(evalCondition("test", {or: [{never: true}, {never: true}]})).toBe(
    false
  )
  expect(evalCondition("test", {or: [{equal: "test"}]})).toBe(true)
  expect(evalCondition("test", {or: [{or: [{equal: "test"}]}]})).toBe(true)
  expect(evalCondition("test", {or: []})).toBe(false)
})
test("And Condition", () => {
  expect(evalCondition("test", {and: [{always: true}, {always: true}]})).toBe(
    true
  )
  expect(evalCondition("test", {and: [{always: true}, {never: true}]})).toBe(
    false
  )
  expect(evalCondition("test", {and: [{never: true}, {never: true}]})).toBe(
    false
  )
  expect(evalCondition("test", {and: [{equal: "test"}]})).toBe(true)
  expect(evalCondition("test", {and: [{and: [{equal: "test"}]}]})).toBe(true)
  expect(evalCondition("test", {and: []})).toBe(true)
})

describe("Edge Cases", () => {
  test("should return false for an empty condition object", () => {
    expect(evalCondition("test", {} as any)).toBe(false)
  })

  test("should return false for unsupported types", () => {
    expect(evalCondition(Symbol("test"), {equal: Symbol("test")} as any)).toBe(
      false
    )
  })

  test("should handle non-existent object keys gracefully", () => {
    expect(evalCondition({a: 1}, {b: {equal: 1}} as any)).toBe(false)
  })
})

describe("Object Key Conditions", () => {
  test("should evaluate nested conditions", () => {
    const condition: Condition<Animal> = {
      parents: {listAnyElement: {name: {equal: "Bella"}}}
    }
    expect(evalCondition(dog_test, condition)).toBe(true)
  })

  test("should handle missing nested keys", () => {
    const condition: Condition<Animal> = {
      parents: {listAnyElement: {name: {equal: "NotFound"}}}
    }
    expect(evalCondition(dog_test, condition)).toBe(false)
  })

  test("should handle empty array in conditions", () => {
    const condition: Condition<Animal> = {
      parents: {listAnyElement: {name: {inside: []}}}
    }
    expect(evalCondition(dog_test, condition)).toBe(false)
  })

  test("various key tests", () => {
    const trueConditions: Condition<Animal>[] = [
      {_id: {equal: "1234"}},
      {age: {equal: 4}},
      {type: {inside: [AnimalType.Mammal]}},
      {parents: {listAnyElement: {name: {equal: "Bella"}}}},
      {
        parents: {
          listAnyElement: {
            and: [{gender: {equal: "Male"}}, {_id: {inside: ["123-father"]}}]
          }
        }
      }
    ]

    for (const condition of trueConditions) {
      expect(evalCondition(dog_test, condition)).toBe(true)
    }
  })
})
