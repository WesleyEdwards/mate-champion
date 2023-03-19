import { displayCanvas, getCanvasContext } from "./Drawing/uiHelpers";
import { GameState } from "./GameState/GameState";
import { SetUI } from "./models";

export function doEverything(setUI: SetUI) {
  const { canvas, context } = getCanvasContext();
  let gameState: GameState = new GameState(setUI, context);

  function gameLoop(timeStamp: number) {
    if (gameState.isWinState("lose")) {
      return handleWin();
    }
    gameState.updateTime(timeStamp);

    gameState.update();
    gameState.drawEverything(context);

    requestAnimationFrame(gameLoop);
  }

  function handleWin() {
    displayCanvas(false, canvas);
  }

  function startGame() {
    displayCanvas(true, canvas);
    gameState = new GameState(setUI, context);
    requestAnimationFrame(gameLoop);
  }

  startGame();
}
