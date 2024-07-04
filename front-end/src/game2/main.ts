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
  console.log("Starting game loop");
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
