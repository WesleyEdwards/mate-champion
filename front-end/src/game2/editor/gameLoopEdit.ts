import { displayCanvas, getCanvasContext } from "../../Game/Drawing/uiHelpers";
import { FullLevelInfo, SetUI } from "../../Game/models";
import { abortController } from "./eventListeners";
import { GameEdit } from "./GameEdit";

export function gameLoopEdit(params: {
  level: FullLevelInfo;
  setLevel: (level: Partial<FullLevelInfo>) => void;
}) {
  const { level, setLevel } = params;
  const { canvas, context } = getCanvasContext();

  const game = new GameEdit(level, setLevel, canvas);

  function gameLoop(timeStamp: number) {
    window.mateSettings.collisionBoxesVisible = true;
    if (window.stopLoop === true) {
      window.stopLoop = false;
      return;
    }
    game.step(timeStamp);
    game.render(context);

    requestAnimationFrame(gameLoop);
  }

  function startGame() {
    displayCanvas(true, canvas);
    requestAnimationFrame(gameLoop);
  }

  startGame();
}
