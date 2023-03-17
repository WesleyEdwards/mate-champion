import {
  displayCanvas,
  displayNextLevel,
  getCanvasContext,
} from "./Drawing/uiHelpers";
import { GameState } from "./GameState/GameState";
import { SetUI } from "./models";

export function doEverything(setUI: SetUI) {
  let gameState: GameState | undefined;

  const { canvas, context } = getCanvasContext();

  function gameLoop(timeStamp: number) {
    if (!gameState) return;
    gameState.stats.updateTime(timeStamp);

    if (gameState.isLost()) {
      return handleWin();
    }

    gameState.updateEverything(); // Update

    if (gameState.showNextLevel) {
      displayNextLevel(context, gameState.level);
    } else {
      gameState.drawEverything(context); // Render
    }

    requestAnimationFrame(gameLoop);
  }

  function handleWin() {
    displayCanvas(false, canvas);
    const score = gameState?.getScore();
    gameState = undefined;
    setUI.setShowHighScoreDiv(score);
  }

  function startGame() {
    displayCanvas(true, canvas);
    gameState = new GameState(setUI);
    requestAnimationFrame(gameLoop);
  }

  startGame();
}
