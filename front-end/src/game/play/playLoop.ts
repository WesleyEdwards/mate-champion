import { FullLevelInfo, SetUI } from "../loopShared/models";
import { abortController } from "../editor/eventListeners";
import { getCanvasContext, displayCanvas } from "../loopShared/loopHelpers";
import { GamePlay } from "./GamePlay";

export function playLoop(params: { setUI: SetUI; levels: FullLevelInfo[] }) {
  const { setUI, levels } = params;
  const { canvas, context } = getCanvasContext();

  if (levels.length === 0) return;

  const game = new GamePlay(levels, setUI);

  function gameLoop(timeStamp: number) {
    window.mateSettings.collisionBoxesVisible = true;
    if (window.stopLoop === true) {
      console.log("stop")
      window.stopLoop = false;
      return;
    }

    if (game.state.currStateOfGame === "lose") {
      return handleLose(game.state.stats.score.curr);
    }

    game.step(timeStamp);
    game.render(context);

    requestAnimationFrame(gameLoop);
  }

  function handleLose(score: number) {
    abortController.abort();
    setUI.handleLose(score);
    displayCanvas(false, canvas);
  }

  function startGame() {
    displayCanvas(true, canvas);
    requestAnimationFrame(gameLoop);
  }

  startGame();
}
