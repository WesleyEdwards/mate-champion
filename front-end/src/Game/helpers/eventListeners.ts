import {
  abortController,
  resetAbortController,
} from "../../game2/editor/eventListeners";
import { Keys } from "../models";

const initialKeyStatus: Keys = {
  up: false,
  right: false,
  left: false,
  down: false,
  jump: false,
  shoot: false,
  shank: false,
  toJump: 0,
  toShoot: 0,
  toShank: 0,
  mostRecentX: "right",
};

export function addEventListeners(togglePause: () => void): Keys {
  resetAbortController();
  const keys = { ...initialKeyStatus };
  window.addEventListener(
    "keydown",
    (e) => {
      switch (e.code) {
        case "KeyW":
          keys.up = true;
          break;
        case "ArrowUp":
          keys.up = true;
          break;
        case "KeyD":
          keys.right = true;
          break;
        case "ArrowRight":
          keys.right = true;
          break;
        case "KeyA":
          keys.left = true;
          break;
        case "ArrowLeft":
          keys.left = true;
          break;
        case "KeyS":
          keys.down = true;
          break;
        case "ArrowDown":
          keys.down = true;
          break;
        case "Space":
          keys.jump = true;
          keys.toJump = 1;
          break;
        case "KeyJ":
          keys.shoot = true;
          keys.toShoot = 1;
          break;
        case "KeyK":
          keys.shank = true;
          keys.toShank = 1;
          break;
      }
    },
    { signal: abortController.signal }
  );

  window.addEventListener(
    "keyup",
    ({ code }) => {
      switch (code) {
        case "KeyW":
          keys.up = false;
          break;
        case "ArrowUp":
          keys.up = false;
          break;
        case "KeyD":
          keys.right = false;
          break;
        case "ArrowRight":
          keys.right = false;
          break;
        case "KeyA":
          keys.left = false;
          break;
        case "ArrowLeft":
          keys.left = false;
          break;
        case "KeyS":
          keys.down = false;
          break;
        case "ArrowDown":
          keys.down = false;
          break;
        case "Space":
          keys.jump = false;
          break;
        case "KeyJ":
          keys.shoot = false;
          break;
        case "KeyK":
          keys.shank = false;
          break;
        case "Escape":
          togglePause();
          break;
      }
    },
    { signal: abortController.signal }
  );
  return keys;
}
