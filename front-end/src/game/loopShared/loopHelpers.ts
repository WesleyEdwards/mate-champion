import {MAX_CANVAS_HEIGHT, MAX_CANVAS_WIDTH} from "./constants"

export function getCanvasContext(): {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
} {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement
  const context = canvas.getContext("2d") as CanvasRenderingContext2D

  context.imageSmoothingEnabled = false
  context.imageSmoothingQuality = "high"

  return {canvas, context}
}

export function displayCanvas(show: boolean, canvas: HTMLCanvasElement) {
  if (show) {
    canvas.width = MAX_CANVAS_WIDTH
    canvas.height = MAX_CANVAS_HEIGHT
  } else {
    canvas.width = 0
    canvas.height = 0
  }
}
