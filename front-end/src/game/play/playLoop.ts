import {LevelMap} from "../../api/types"
import {abortController} from "../editor/eventListeners"
import {getCanvasContext, displayCanvas} from "../loopShared/loopHelpers"
import {PlayStats} from "../state/models"
import {GamePlay} from "./GamePlay"

export type PlayLoopParams = {
  setUI: {
    modifyStats: (stats: Partial<PlayStats>) => void
    handleLose: (score: number) => void
  }
  levels: LevelMap[]
}
export function playLoop(params: PlayLoopParams) {
  const {setUI, levels} = params
  const {canvas, context} = getCanvasContext()

  if (levels.length === 0) return

  const game = new GamePlay(params)

  function gameLoop(timeStamp: number) {
    if (window.stopLoop === true) {
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
    window.stopLoop = false
    displayCanvas(true, canvas)

    requestAnimationFrame(gameLoop)
  }

  startGame()
}
