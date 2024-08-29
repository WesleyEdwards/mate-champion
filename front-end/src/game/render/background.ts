import {MAX_CANVAS_HEIGHT, MAX_CANVAS_WIDTH} from "../loopShared/constants"
import {Textures} from "../../gameAssets/textures"
import {Camera} from "../entities/entityTypes"

export const renderBg = (cam: Camera, cxt: CanvasRenderingContext2D) => {
  const spacesToRight = Math.floor(cam.position[0] / MAX_CANVAS_WIDTH)
  const spacesUp = Math.floor(cam.position[1] / MAX_CANVAS_HEIGHT)

  const canvasDimensions = [MAX_CANVAS_WIDTH, MAX_CANVAS_HEIGHT]

  cxt.save()

  const pos = [
    canvasDimensions[0] * spacesToRight,
    canvasDimensions[1] * spacesUp
  ]

  for (let i = 0; i < 2; i++) {
    cxt.drawImage(
      Textures().background.clouds,
      pos[0],
      pos[1],
      canvasDimensions[0],
      canvasDimensions[1]
    )

    for (let j = 1; j < 4; j++) {
      const dy = canvasDimensions[1] * j
      cxt.drawImage(
        Textures().background.cloudsTop,
        pos[0],
        pos[1] - dy,
        canvasDimensions[0],
        canvasDimensions[1]
      )
    }

    cxt.translate(canvasDimensions[0], 0)
  }

  cxt.restore()
}

export const displayNextLevel = (
  cxt: CanvasRenderingContext2D,
  message: string
) => {
  cxt.clearRect(0, 0, MAX_CANVAS_WIDTH, MAX_CANVAS_HEIGHT)
  cxt.font = "60px Courier"
  cxt.fillStyle = "green"
  cxt.fillText(message, MAX_CANVAS_WIDTH / 3 + 40, MAX_CANVAS_HEIGHT / 2)
}
