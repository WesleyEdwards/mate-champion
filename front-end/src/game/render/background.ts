import {MAX_CANVAS_HEIGHT, MAX_CANVAS_WIDTH} from "../loopShared/constants"
import {Textures} from "../../gameAssets/textures"
import {Camera, Coors} from "../entities/entityTypes"

export const renderBg = (
  cam: {position: Coors},
  cxt: CanvasRenderingContext2D
) => {
  const spacesToRight = Math.floor(cam.position[0] / MAX_CANVAS_WIDTH)
  const spacesUp = Math.floor(cam.position[1] / MAX_CANVAS_HEIGHT)

  const canvasDimensions = [MAX_CANVAS_WIDTH, MAX_CANVAS_HEIGHT]

  cxt.save()

  const camPosition = [
    canvasDimensions[0] * spacesToRight,
    canvasDimensions[1] * spacesUp
  ]

  for (let i = 0; i < 2; i++) {
    cxt.drawImage(
      Textures().background.clouds,
      camPosition[0],
      camPosition[1],
      canvasDimensions[0],
      canvasDimensions[1]
    )

    for (let j = 1; j < 4; j++) {
      const dy = canvasDimensions[1] * j
      cxt.drawImage(
        Textures().background.cloudsTop,
        camPosition[0],
        camPosition[1] - dy,
        canvasDimensions[0],
        canvasDimensions[1]
      )
    }

    cxt.translate(canvasDimensions[0], 0)
  }

  cxt.restore()
}

export const displayKeyControls = (cxt: CanvasRenderingContext2D) => {
  const imgWidth = MAX_CANVAS_WIDTH * 0.5

  const instructions1 = Textures().background.instructions1
  const instructions2 = Textures().background.instructions2

  // Instructions for moving
  cxt.drawImage(
    instructions1,
    0,
    0,
    imgWidth,
    (imgWidth * instructions1.height) / instructions1.width
  )

  // Instructions for shooting and slashing
  cxt.drawImage(
    instructions2,
    2000,
    0,
    imgWidth,
    (imgWidth * instructions2.height) / instructions2.width
  )
}

export const displayNextLevel = (
  cxt: CanvasRenderingContext2D,
  message: string
) => {
  cxt.clearRect(0, 0, MAX_CANVAS_WIDTH, MAX_CANVAS_HEIGHT)

  cxt.font = "60px Courier"
  cxt.fillStyle = "green"
  cxt.textAlign = "center"
  cxt.textBaseline = "middle"

  cxt.fillText(message, MAX_CANVAS_WIDTH / 2, MAX_CANVAS_HEIGHT / 2)
}