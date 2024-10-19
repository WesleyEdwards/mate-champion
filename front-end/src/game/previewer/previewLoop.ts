import {getCanvasContext, displayCanvas} from "../loopShared/loopHelpers"
import {LevelMap} from "../loopShared/models"
import {GamePreviewer} from "./GamePreviewer"

export function enterGameLoopPreview(level: LevelMap) {
  const {canvas, context} = getCanvasContext()

  const game = new GamePreviewer(level)

  function gameLoop(timeStamp: number) {
    window.debounceLog("game loop preview")
    if (window.stopLoop === true) {
      window.stopLoop = false
      return
    }

    game.step(timeStamp)
    game.render(context)

    requestAnimationFrame(gameLoop)
  }

  function startGame() {
    displayCanvas(true, canvas)
    requestAnimationFrame(gameLoop)
  }

  startGame()
}
