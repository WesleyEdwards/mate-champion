import { displayCanvas, getCanvasContext } from "../../Game/Drawing/uiHelpers";
import { FullLevelInfo, SetUI } from "../../Game/models";
import { abortController } from "./eventListeners";
import { GameEdit } from "./GameEdit";

export function gameLoopEdit(params: {
  level: FullLevelInfo;
  setIsDirty: () => void;
  setLevel: (level: Partial<FullLevelInfo>) => void;
}) {
  const { level, setLevel, setIsDirty } = params;
  const { canvas, context } = getCanvasContext();

  const game = new GameEdit(level, setIsDirty, setLevel, canvas);

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
