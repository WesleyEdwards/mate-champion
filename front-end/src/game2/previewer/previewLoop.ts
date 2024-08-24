import { displayCanvas, getCanvasContext } from "../../Game/Drawing/uiHelpers";
import { FullLevelInfo } from "../../Game/models";
import { GamePreviewer } from "./GamePreviewer";

export function enterGameLoopPreview(level: FullLevelInfo) {
  const { canvas, context } = getCanvasContext();

  const game = new GamePreviewer(level);

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
