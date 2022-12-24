import React, { useState } from "react";
import "./App.css";
import { doEverything } from "./Game/Main";

export interface SetUI {
  setLevel: (level: number) => void;
  setLives: (lives: number) => void;
  setScore: (score: number) => void;
  setDisabledPlay: (disabled: boolean) => void;
}

function App() {
  const [disablePlay, setDisabledPlay] = useState(false);
  const [level, setLevel] = useState<number>();
  const [lives, setLives] = useState<number>();
  const [score, setScore] = useState(0);

  const handleClick = () => {
    setDisabledPlay(true);

    doEverything({
      setLevel,
      setLives,
      setScore,
      setDisabledPlay,
    });
  };

  return (
    <>
      <div className="container" id="main-div">
        <h1 id="title-text">Mate Champion</h1>
        <div id="instructions">
          <p>
            The objective of this game is to survive the wrath of all who seek
            to
            <br />
            destroy the good reputation of mate. Try to make it as far as
            <br />
            you can without getting caught.
          </p>
          <ul>
            <li>
              <td>◂</td>
              left
            </li>
            <li>
              <td>▸</td>
              right
            </li>
            <li>
              <td>▴</td>
              up
            </li>
            <li>(space) shank</li>
          </ul>
        </div>
        <div>
          <canvas id="canvas"></canvas>
          <div id="stats-div">
            <p className="stats" id="level-stats">
              {level && `level: ${level}`}
            </p>
            <p className="stats" id="lives-stats">
              {lives && `lives: ${lives}`}
            </p>
            <p className="stats" id="score-stats">
              Score: {score}
            </p>
          </div>
        </div>
        <button id="play-game" disabled={disablePlay} onClick={handleClick}>
          Play Game
        </button>
      </div>
    </>
  );
}

export default App;
