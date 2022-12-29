import React, { useState } from "react";
import "./App.css";
import { HighScores } from "./components/HighScores";
import { Instructions } from "./components/Instructions";
import { MHButton } from "./components/MHComponents.tsx/MHButton";
import { StatsDiv } from "./components/StatsDiv";
import { doEverything } from "./Game/Main";
import { H1 } from "./components/MHComponents.tsx/Components";

function App() {
  const [disablePlay, setDisabledPlay] = useState(false);

  const [showInstructions, setShowInstructions] = useState(true);
  const [showHighScores, setShowHighScores] = useState<number>();

  const [level, setLevel] = useState<number>();
  const [lives, setLives] = useState<number>();
  const [score, setScore] = useState<number>();
  const [ammo, setAmmo] = useState<number>(0);

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
      <div
        style={{
          backgroundColor: "#000000",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <H1
          style={{
            margin: "1rem",
          }}
        >
          Mate Champion
        </H1>
        {showInstructions && <Instructions />}
        {showHighScores !== undefined && (
          <HighScores score={showHighScores} enablePlay={onEnablePlay} />
        )}
        <div>
          <canvas id="canvas"></canvas>
          <StatsDiv
            level={level}
            lives={lives}
            score={score}
            ammo={ammo}
            disablePlay={disablePlay}
            handleClick={handleClick}
            BtnText={showInstructions ? "Play Game" : "Play Again"}
          />
        </div>
      </div>
    </>
  );
}

export default App;
