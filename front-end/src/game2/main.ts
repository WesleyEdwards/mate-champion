import { displayCanvas, getCanvasContext } from "../Game/Drawing/uiHelpers";
import { FullLevelInfo, SetUI } from "../Game/models";
import { GameMode } from "../hooks/useAuth";
import { GameState1, initGameState } from "./State1";
import { renderGs } from "./render/gameState";
import { updateGs } from "./state/gameState";

export function enterGameLoop1(params: {
  setUI: SetUI;
  levels: FullLevelInfo[];
  setLevel?: (level: Partial<FullLevelInfo>) => void;
  gameMode: GameMode;
}) {
  const { setUI, levels, setLevel, gameMode } = params;
  const { canvas, context } = getCanvasContext();
  // const gameState: GameState = new GameState(
  //   setUI,
  //   canvas,
  //   context,
  //   levels,
  //   gameMode,
  //   setLevel
  // );
  if (levels.length === 0) {
    return;
  }

  const gameState: GameState1 = initGameState({ firstLevel: levels[0] });

  function gameLoop(timeStamp: number) {
    // TODO
    window.mateSettings.collisionBoxesVisible = true;
    if (window.stopLoop === true) {
      // gameState.removeSetUi();

      window.stopLoop = false;
      return;
    }
    if (gameState.currStateOfGame === "lose") {
      return handleLose(gameState.stats.score);
    }

    updateGs(gameState, timeStamp, window.pause, levels);
    renderGs(gameState, context, window.pause);

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
