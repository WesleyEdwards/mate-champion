import { MAX_CANVAS_HEIGHT, MAX_CANVAS_WIDTH } from "./constants";
import { GameState } from "./GameState/GameState";
import { GameStatsManager } from "./GameState/GameStatsManager";
import { SetUI } from "./models";

export function doEverything(setUI: SetUI) {
  let gameState: GameState | undefined;
  const stats: GameStatsManager = new GameStatsManager();
  let prevTime = 0;
  let initial = true;

  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  canvas.width = MAX_CANVAS_WIDTH;

  const context = canvas.getContext("2d") as CanvasRenderingContext2D;

  function update(elapsedTime: number) {
    if (!gameState) return;
    stats.addElapsedTime(elapsedTime);

    if (stats.showNextLevel) return;

    if (gameState.isLost()) {
      return handleWin();
    }

    gameState?.updateEverything(elapsedTime);
    gameState?.calcInteractions(() => stats.nextLevel());
  }

  function render() {
    if (!gameState) return;
    if (stats.showNextLevel) {
      displayNextLevel();
      return;
    }
    gameState?.drawEverything(context);
  }

  function gameLoop(timeStamp: number) {
    const elapsedTime = initial ? 0 : timeStamp - prevTime;
    initial = false;

    prevTime = timeStamp;

    update(elapsedTime);
    render();

    requestAnimationFrame(gameLoop);
  }

  function handleWin() {
    canvas.height = 0;
    const score = gameState?.getScore();
    gameState = undefined;
    setUI.setShowHighScoreDiv(score);
  }

  function startGame(first?: boolean) {
    canvas.height = MAX_CANVAS_HEIGHT;
    initial = true;
    gameState = new GameState(setUI);
    gameState.reset(first);
    gameState.enterGame();
    gameState.setGameState("playing");
    requestAnimationFrame(gameLoop);
  }

  function displayNextLevel() {
    context.clearRect(0, 0, MAX_CANVAS_WIDTH, MAX_CANVAS_HEIGHT);
    context.font = "60px Courier";
    context.fillStyle = "green";
    context.fillText(
      `Level ${gameState?.getLevel()}`,
      MAX_CANVAS_WIDTH / 3,
      MAX_CANVAS_HEIGHT / 2
    );
  }

  startGame(true);
}
