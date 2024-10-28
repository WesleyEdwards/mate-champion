import {arraysAreSame} from "../../components/GameEdit/CourseBuilderSettings"
import {Coors} from "../entities/entityTypes"
import {getCanvasContext, displayCanvas} from "../loopShared/loopHelpers"
import {LevelMap} from "../loopShared/models"
import {GameEdit} from "./GameEdit"

export function gameLoopEdit(params: {
  level: LevelMap
  modifyLevel: (level: Partial<LevelMap>) => void
}) {
  const {level, modifyLevel} = params
  const {canvas, context} = getCanvasContext()

  const game = new GameEdit(level, modifyLevel, canvas)

  function gameLoop(timeStamp: number) {
    // window.debounceLog("game loop edit")
    if (window.stopLoop === true) {
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
    window.stopLoop = false
    displayCanvas(true, canvas)
    requestAnimationFrame(gameLoop)
  }

  startGame()
}
