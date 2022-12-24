import {
  handleStartPlaying,
  setupGame,
  addEventListeners,
} from "./DomFunctions";
import { GameState } from "./GameState";
import { SetUI } from "./models";

export function doEverything(setUI: SetUI) {
  const canvas = setupGame();
  const context = canvas.getContext("2d") as CanvasRenderingContext2D;

  let requestId: number | undefined = undefined;

  const gameState = new GameState(setUI);

  const enterGameLoop = () => {
    handleStartPlaying(canvas);
    gameState.enterGame();
    loop();
  };

  enterGameLoop();

  function loop() {
    requestId = undefined;

    if (gameState.winState === "lose") {
      canvas.height = 0;

      const score = gameState.getScore();
      setUI.setShowHighScores(score);

      stop();
      return;
    }

    gameState.updateEverything();
    gameState.calcInteractions();
    gameState.drawEverything(context);

    start();
  }

  function start() {
    if (!requestId) {
      requestId = window.requestAnimationFrame(loop);
    }
  }

  function stop() {
    if (requestId) {
      window.cancelAnimationFrame(requestId);
      requestId = undefined;
    }
  }

  addEventListeners(gameState);
}
