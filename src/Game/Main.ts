import { SetUI } from "../App";
import {
  handleStartPlaying,
  setupGame,
  handleLose,
  addEventListeners,
} from "./DomFunctions";
import { GameState } from "./GameState";

export function doEverything(setUI: SetUI) {
  const canvas = setupGame();
  const context = canvas.getContext("2d") as CanvasRenderingContext2D;

  let requestId: number | undefined = undefined;
  const instructions = document.getElementById("instructions") as HTMLElement;
  const gameState = new GameState(setUI);

  const enterGameLoop = () => {
    handleStartPlaying(canvas, instructions);
    gameState.enterGame();
    loop();
  };

  enterGameLoop();

  function loop() {
    requestId = undefined;

    if (gameState.winState === "lose") {
      handleLose(canvas, instructions, gameState.getScore(), () =>
        setUI.setDisabledPlay(false)
      );
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
