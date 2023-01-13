import { MAX_CANVAS_HEIGHT, MAX_CANVAS_WIDTH } from "./constants";
import { GameState } from "./GameState/GameState";
import { SetUI } from "./models";

export function doEverything(setUI: SetUI) {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  canvas.width = MAX_CANVAS_WIDTH;

  const context = canvas.getContext("2d") as CanvasRenderingContext2D;

  let requestId: number | undefined = undefined;

  const gameState = new GameState(setUI);

  function enterGameLoop(first?: boolean) {
    gameState.reset(first);
    gameState.enterGame();
    gameState.setGameState("playing");
    canvas.height = MAX_CANVAS_HEIGHT;
    loop();
  };

  enterGameLoop(true);

  function loop() {
    requestId = undefined;

    if (gameState.isLost()) {
      canvas.height = 0;
      const score = gameState.getScore();
      setUI.setShowHighScoreDiv(score);
      stop();
      return;
    }

    if (gameState.isNextLevel()) {
      context.clearRect(0, 0, MAX_CANVAS_WIDTH, MAX_CANVAS_HEIGHT);
      context.font = "60px Courier";
      context.fillText(
        `Level ${gameState.getLevel()}`,
        MAX_CANVAS_WIDTH / 3,
        MAX_CANVAS_HEIGHT / 2
      );
      stop();
      handleNextLevel();
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

  function handleNextLevel() {
    setTimeout(() => {
      enterGameLoop();
      start();
    }, 2000);
  }
}
