import { GameMode } from "../hooks/useAuth";
import { displayCanvas, getCanvasContext } from "./Drawing/uiHelpers";
import { GameState } from "./GameState/GameState";
import { LevelInfo, SetUI } from "./models";

export function enterGameLoop(params: {
  setUI: SetUI;
  levels: LevelInfo[];
  setLevel?: (level: Partial<LevelInfo>) => void;
  gameMode: GameMode;
}) {
  const { setUI, levels, setLevel, gameMode } = params;
  const { canvas, context } = getCanvasContext();
  const gameState: GameState = new GameState(
    setUI,
    canvas,
    context,
    levels,
    gameMode,
    setLevel
  );

  function gameLoop(timeStamp: number) {
    if (window.stopLoop === true) {
      gameState.removeSetUi();
      window.stopLoop = false;
      return;
    }
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
