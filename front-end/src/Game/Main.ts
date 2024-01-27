import { displayCanvas, getCanvasContext } from "./Drawing/uiHelpers";
import { GameState } from "./GameState/GameState";
import { SetUI } from "./models";

export function enterGameLoop(setUI: SetUI) {
  const { canvas, context } = getCanvasContext();
  const gameState: GameState = new GameState(setUI, canvas, context);

  function gameLoop(timeStamp: number) {
    if (gameState.currStateOfGame === "lose") {
      return handleLose(gameState.score);
    }
    gameState.update(timeStamp);
    gameState.render();

    requestAnimationFrame(gameLoop);
  }

  function handleLose(score: number) {
    setUI.handleLose(score);
    displayCanvas(false, canvas);
  }

  function startGame() {
    displayCanvas(true, canvas);
    requestAnimationFrame(gameLoop);
  }

  startGame();
}
