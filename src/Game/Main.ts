import { displayCanvas, getCanvasContext } from "./Drawing/uiHelpers";
import { GameState } from "./GameState/GameState";
import { SetUI } from "./models";

export function enterGameLoop(setUI: SetUI) {
  const { canvas, context } = getCanvasContext();
  let gameState: GameState = new GameState(setUI, context);

  function gameLoop(timeStamp: number) {
    if (gameState.isWinState("lose")) {
      return handleLose();
    }

    gameState.update(timeStamp);
    gameState.render(context);

    requestAnimationFrame(gameLoop);
  }

  function handleLose() {
    displayCanvas(false, canvas);
  }

  function startGame() {
    displayCanvas(true, canvas);
    requestAnimationFrame(gameLoop);
  }

  startGame();
}
