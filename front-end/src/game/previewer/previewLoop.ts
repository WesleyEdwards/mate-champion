import {LevelMap} from "../../api/types"
import {getCanvasContext, displayCanvas} from "../loopShared/loopHelpers"
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
    window.stopLoop = false
    displayCanvas(true, canvas)
    requestAnimationFrame(gameLoop)
  }

  startGame()
}
