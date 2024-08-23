import { displayCanvas, getCanvasContext } from "../Game/Drawing/uiHelpers";
import { FullLevelInfo, SetUI } from "../Game/models";
import { abortController } from "./editor/eventListeners";
import { GameState } from "./GameState";

export function enterGameLoop(params: {
  setUI: SetUI;
  levels: FullLevelInfo[];
}) {
  const { setUI, levels } = params;
  const { canvas, context } = getCanvasContext();

  if (levels.length === 0) return;

  const game = new GameState(levels, setUI);

  function gameLoop(timeStamp: number) {
    window.mateSettings.collisionBoxesVisible = true;
    if (window.stopLoop === true) {
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
