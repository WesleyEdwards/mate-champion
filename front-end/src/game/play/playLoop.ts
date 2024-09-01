import {LevelMap, PlayStats} from "../loopShared/models"
import {abortController} from "../editor/eventListeners"
import {getCanvasContext, displayCanvas} from "../loopShared/loopHelpers"
import {GamePlay} from "./GamePlay"

export type PlayLoopParams = {
  setUI: {
    modifyStats: (stats: Partial<PlayStats>) => void
    handleLose: (score: number) => void
    handlePause: (pause: boolean) => void
  }
  levels: LevelMap[]
}
export function playLoop(params: PlayLoopParams) {
  const {setUI, levels} = params
  const {canvas, context} = getCanvasContext()

  if (levels.length === 0) return

  const game = new GamePlay(params)

  function gameLoop(timeStamp: number) {
    window.mateSettings.collisionBoxesVisible = true
    if (window.stopLoop === true) {
      console.log("stop")
      window.stopLoop = false
      return
    }

    if (game.state.currStateOfGame === "lose") {
      return handleLose(game.state.stats.score.curr)
    }

    game.step(timeStamp)
    game.render(context)

    requestAnimationFrame(gameLoop)
  }

  function handleLose(score: number) {
    abortController.abort()
    setUI.handleLose(score)
    displayCanvas(false, canvas)
  }

  function startGame() {
    displayCanvas(true, canvas)
    requestAnimationFrame(gameLoop)
  }

  startGame()
}
