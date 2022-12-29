import React, { useState } from "react";
import "./App.css";
import { HighScores } from "./Game/components/HighScores";
import { Instructions } from "./Game/components/Instructions";
import StatsDiv from "./Game/components/StatsDiv";
import { doEverything } from "./Game/Main";

function App() {
  const [disablePlay, setDisabledPlay] = useState(false);

  const [showInstructions, setShowInstructions] = useState(true);
  const [showHighScores, setShowHighScores] = useState<number>();

  const [level, setLevel] = useState<number>();
  const [lives, setLives] = useState<number>();
  const [score, setScore] = useState<number>();

  const handleClick = () => {
    setDisabledPlay(true);
    setShowHighScores(undefined);
    setShowInstructions(false);
    doEverything({
      setLevel,
      setLives,
      setScore,
      setDisabledPlay,
      setShowInstructions,
      setShowHighScoreDiv,
    });
  };

  const onEnablePlay = () => {
    setShowInstructions(false);
    setDisabledPlay(false);
  };

  const setShowHighScoreDiv = (score: number | undefined) => {
    setDisabledPlay(true);
    setShowHighScores(score);
  };

  return (
    <>
      <div className="container" id="main-div">
        <h1
          style={{
            fontSize: "2rem",
            margin: "1rem",
          }}
          id="title-text"
          className="green-text"
        >
          Mate Champion
        </h1>
        {showInstructions && <Instructions />}
        {showHighScores !== undefined && (
          <HighScores score={showHighScores} enablePlay={onEnablePlay} />
        )}
        <div>
          <canvas id="canvas"></canvas>
          <StatsDiv level={level} lives={lives} score={score} />
        </div>
        <button
          id="play-game"
          style={{ padding: "1rem 2rem" }}
          className="btn"
          disabled={disablePlay}
          onClick={handleClick}
        >
          {showInstructions ? "Play Game" : "Play Again"}
        </button>
      </div>
    </>
  );
}

export default App;
