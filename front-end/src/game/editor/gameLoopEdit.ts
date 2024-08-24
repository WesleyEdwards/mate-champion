import { getCanvasContext, displayCanvas } from "../loopShared/loopHelpers";
import { FullLevelInfo, SetUI } from "../loopShared/models";
import { GameEdit } from "./GameEdit";

export function gameLoopEdit(params: {
  level: FullLevelInfo;
  setIsDirty: () => void;
  modifyLevel: (level: Partial<FullLevelInfo>) => void;
}) {
  const { level, modifyLevel, setIsDirty } = params;
  const { canvas, context } = getCanvasContext();

  const game = new GameEdit(level, setIsDirty, modifyLevel, canvas);

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
