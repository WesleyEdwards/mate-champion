import {arraysAreSame} from "../../components/GameEdit/CourseBuilderSettings"
import {getCanvasContext, displayCanvas} from "../loopShared/loopHelpers"
import {FullLevelInfo, SetUI} from "../loopShared/models"
import {GameEdit} from "./GameEdit"

export function gameLoopEdit(params: {
  level: FullLevelInfo
  setIsDirty: () => void
  modifyLevel: (level: Partial<FullLevelInfo>) => void
}) {
  const {level, modifyLevel, setIsDirty} = params
  const {canvas, context} = getCanvasContext()

  const game = new GameEdit(level, setIsDirty, modifyLevel, canvas)

  function gameLoop(timeStamp: number) {
    if (window.stopLoop === true) {
      console.log("stop")
      window.stopLoop = false
      return
    }

    game.step(timeStamp)
    game.render(context)

    const diff = arraysAreSame(game.currentlySelected, window.editingEntities)

    if (!diff) {
      window.editingEntities = [...game.currentlySelected]
    }

    requestAnimationFrame(gameLoop)
  }

  function startGame() {
    displayCanvas(true, canvas)
    requestAnimationFrame(gameLoop)
  }

  startGame()
}
