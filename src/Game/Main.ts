import { MAX_CANVAS_HEIGHT, MAX_CANVAS_WIDTH } from "./constants";
import { GameState } from "./GameState/GameState";
import { SetUI } from "./models";

export function doEverything(setUI: SetUI) {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  canvas.width = MAX_CANVAS_WIDTH;

  const context = canvas.getContext("2d") as CanvasRenderingContext2D;

  let requestId: number | undefined = undefined;

  const gameState = new GameState(setUI);

  const enterGameLoop = () => {
    gameState.enterGame();
    canvas.height = MAX_CANVAS_HEIGHT;
    loop();
  };

  enterGameLoop();

  function loop() {
    requestId = undefined;

    if (gameState.isLost()) {
      canvas.height = 0;

      const score = gameState.getScore();
      setUI.setShowHighScoreDiv(score);

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
}
