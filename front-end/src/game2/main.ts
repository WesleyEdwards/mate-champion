import { displayCanvas, getCanvasContext } from "../Game/Drawing/uiHelpers";
import { FullLevelInfo, SetUI } from "../Game/models";
import { GameMode } from "../hooks/useAuth";
import { abortController } from "./editor/eventListeners";
import { initGameState } from "./helpers";
import { Game } from "./State1";
// import { renderGs } from "./render/gameState";
// import { updateGs } from "./state/gameState";

export function enterGameLoop1(params: {
  setUI: SetUI;
  levels: FullLevelInfo[];
  gameMode: Exclude<GameMode, "edit">;
}) {
  const { setUI, levels, gameMode } = params;
  const { canvas, context } = getCanvasContext();
  // const gameState: GameState = new GameState(
  //   setUI,
  //   canvas,
  //   context,
  //   levels,
  //   gameMode,
  // );
  if (levels.length === 0) {
    return;
  }

  let game = new Game(levels, setUI);

  function gameLoop(timeStamp: number) {
    window.mateSettings.collisionBoxesVisible = true;
    if (window.stopLoop === true) {
      // gameState.removeSetUi();

      window.stopLoop = false;
      return;
    }
    if (game.state.currStateOfGame === "lose") {
      return handleLose(game.state.stats.score.curr);
    }

    game.step(timeStamp);
    game.render(context);

    requestAnimationFrame(gameLoop);
  }

  function handleLose(score: number) {
    abortController.abort();
    setUI.handleLose(score);
    displayCanvas(false, canvas);
  }

  function startGame() {
    displayCanvas(true, canvas);

    requestAnimationFrame(gameLoop);
  }

  startGame();
}

// let fps = 20;
// let fpsInterval = 1000 / fps;
// let then = Date.now();
// let startTime = then;
// let frameCount = 0;

// let now = Date.now();
// let elapsed = now - then;
// if (elapsed > fpsInterval) {
// then = now - (elapsed % fpsInterval);
// let sinceStart = now - startTime;
// let currentFps =
// Math.round((1000 / (sinceStart / ++frameCount)) * 100) / 100;
