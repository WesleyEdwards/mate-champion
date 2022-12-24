import { MAX_CANVAS_WIDTH, MAX_CANVAS_HEIGHT } from "./constants";
import {
  handleSubmitName,
  fetchPlayerScores,
  isHighScore,
} from "./FirebaseHelpers";
import { GameState } from "./GameState";

export function setupGame(): HTMLCanvasElement {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;

  canvas.width = MAX_CANVAS_WIDTH;
  return canvas;
}

export function handleStartPlaying(
  canvas: HTMLCanvasElement,
  instructions: HTMLElement
) {
  canvas.width = MAX_CANVAS_WIDTH;
  canvas.height = MAX_CANVAS_HEIGHT;
  instructions.innerHTML = "";
}

export function handleLose(
  canvas: HTMLCanvasElement,
  instructions: HTMLElement,
  score: number,
  enablePlay: () => void
) {
  canvas.height = 0;

  isHighScore(score).then((highScore) => {
    if (highScore) {
      instructions.innerHTML = `<h2>Game Over!</h2><p>You got a high score!<br />To receive credit, Enter your name:<div id="submit-box"></p><input type="text" id="name-input" /><button type="submit" id="submit-score">Submit</button></div>`;
      const name = document.getElementById("name-input") as HTMLInputElement;
      const submit = document.getElementById(
        "submit-score"
      ) as HTMLButtonElement;

      if (submit) {
        submit.addEventListener("click", () =>
          handleSubmitName(name.value, score).then((res) => {
            displayScores(instructions, enablePlay);
          })
        );
      }
    } else {
      displayScores(instructions, enablePlay);
    }
  });
}

export function addEventListeners(gameState: GameState) {
  window.addEventListener("keydown", ({ code }) => {
    if (code === "ArrowUp") gameState.keys.up = true;
    if (code === "ArrowRight") gameState.keys.right = true;
    if (code === "ArrowLeft") gameState.keys.left = true;
    if (code === "Space") gameState.keys.space = true;
  });

  window.addEventListener("keyup", ({ code }) => {
    if (code === "ArrowUp") gameState.keys.up = false;
    if (code === "ArrowRight") gameState.keys.right = false;
    if (code === "ArrowLeft") gameState.keys.left = false;
    if (code === "Space") gameState.keys.space = false;
  });
}

async function generateScoresHTML(): Promise<string> {
  return fetchPlayerScores().then((scores) => {
    return `<h2>High Scores:</h2><p>1 - ${scores[0].name} (${scores[0].score})</p><p>2 - ${scores[1].name} (${scores[1].score})</p><p>3 - ${scores[2].name} (${scores[2].score})</p><p>4 - ${scores[3].name} (${scores[3].score})</p><p>5 - ${scores[4].name} (${scores[4].score})</p>`;
  });
}

function displayScores(instructions: HTMLElement, enablePlay: () => void) {
  enablePlay();
  generateScoresHTML().then((html) => {
    instructions.innerHTML = html;
  });
}
