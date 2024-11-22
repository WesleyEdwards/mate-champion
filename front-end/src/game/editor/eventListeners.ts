import {UserInput} from "./editHelpers"

export function addDevEventListeners(
  userInput: UserInput,
  canvas: HTMLCanvasElement
) {
  resetAbortController()

  const params = {signal: abortController.signal}

  canvas.addEventListener(
    "mousedown",
    (e) => {
      e.preventDefault()
      userInput["mouseDown"].curr = true
      userInput["mousePutDown"].curr = [e.offsetX, e.offsetY]
      userInput["mousePos"].curr = [e.offsetX, e.offsetY]
    },
    params
  )
  canvas.addEventListener(
    "mousemove",
    (e) => {
      userInput["mousePos"].curr = [e.offsetX, e.offsetY]
    },
    params
  )

  canvas.addEventListener(
    "mouseleave",
    () => {
      userInput["mousePos"].curr = null
      userInput["ctrl"].curr = false
    },
    params
  )

  window.addEventListener(
    "mouseup",
    (e) => {
      userInput["mouseDown"].curr = false
      userInput["mouseUp"].curr = [e.offsetX, e.offsetY]
    },
    params
  )

  window.addEventListener(
    "keydown",
    (e) => {
      if (e.code === "KeyD" && e.ctrlKey) {
        e.preventDefault()
        userInput["copy"] = true
      }
      if (e.code === "Delete") userInput["delete"].curr = true
      if (e.ctrlKey) userInput["ctrl"].curr = true
      if (e.shiftKey) userInput["shift"].curr = true
    },
    params
  )
  window.addEventListener(
    "keypress",
    (e) => {
      if (e.code === "KeyZ" && e.ctrlKey && !e.shiftKey) {
        e.preventDefault()
        userInput["undo"] = true
      }
      if (e.code === "KeyZ" && e.ctrlKey && e.shiftKey) {
        e.preventDefault()
        userInput["redo"] = true
      }
    },
    params
  )

  window.addEventListener(
    "keyup",
    (e) => {
      if (e.code === "Delete") userInput["delete"].curr = false
      if (e.ctrlKey === false) userInput["ctrl"].curr = false
      if (e.shiftKey === false) userInput["shift"].curr = false
    },
    params
  )
}

export const resetAbortController = () => {
  abortController = new AbortController()
}
export let abortController: AbortController = new AbortController()
export let abortGame = () => {
  window.stopLoop = true
  abortController.abort()
}
