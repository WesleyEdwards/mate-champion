import {GameStateEditProps} from "./editHelpers"
import {GameEdit} from "./GameEdit"

export function addDevEventListeners(
  contentCreator: GameStateEditProps,
  canvas: HTMLCanvasElement
) {
  resetAbortController()

  function set<K extends keyof GameStateEditProps["keys"]>(
    key: K,
    value: GameStateEditProps["keys"][K]["curr"]
  ) {
    contentCreator.keys[key].curr = value
  }

  canvas.addEventListener(
    "mousedown",
    (e: MouseEvent) => {
      e.preventDefault()
      set("mouseDown", true)
      set("mousePos", [e.offsetX, e.offsetY])
    },
    {signal: abortController.signal}
  )
  canvas.addEventListener(
    "mousemove",
    (e) => {
      set("mousePos", [e.offsetX, e.offsetY])
    },
    {signal: abortController.signal}
  )

  canvas.addEventListener(
    "mouseleave",
    () => {
      set("mousePos", null)
    },
    {signal: abortController.signal}
  )

  window.addEventListener(
    "mouseup",
    (e) => {
      set("mouseDown", false)
      set("mouseUp", [e.offsetX, e.offsetY])
    },
    {signal: abortController.signal}
  )

  window.addEventListener(
    "keydown",
    (e) => {
      if (e.code === "KeyD" && e.ctrlKey) {
        e.preventDefault()
        set("copy", true)
      }
      if (e.code === "Delete") set("delete", true)
      if (e.ctrlKey) set("ctrl", true)
      if (e.shiftKey) set("shift", true)
    },
    {signal: abortController.signal}
  )

  window.addEventListener(
    "keyup",
    (e) => {
      if (e.code === "Delete") set("delete", false)
      if (e.ctrlKey === false) set("ctrl", false)
      if (e.shiftKey === false) set("shift", false)
    },
    {signal: abortController.signal}
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
