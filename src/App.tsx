import React, { useState } from "react";
import "./App.css";
import { HighScores } from "./components/HighScores";
import { Instructions } from "./components/Instructions";
import { StatsDiv } from "./components/StatsDiv";
import { enterGameLoop } from "./Game/Main";
import { H1 } from "./components/MHComponents.tsx/Components";

function App() {
  const [playing, setPlaying] = useState(false);

  const [showInstructions, setShowInstructions] = useState(true);
  const [showHighScores, setShowHighScores] = useState<number>();

  const [level, setLevel] = useState<number>();
  const [lives, setLives] = useState<number>();
  const [score, setScore] = useState<number>();
  const [ammo, setAmmo] = useState<number>();

  const darkColors = {
    black: "#000000",
    darkGrey: "#212121",
    grey: "#212121",
  } as const;

  const handleClick = () => {
    setPlaying(true);
    setShowHighScores(undefined);
    setShowInstructions(false);
    enterGameLoop({
      setLevel,
      setLives,
      setScore,
      setAmmo,
      setPlaying,
      setShowInstructions,
      setShowHighScoreDiv,
    });
  };

  const onEnablePlay = () => {
    setShowInstructions(false);
    setPlaying(false);
  };

  const setShowHighScoreDiv = (score: number | undefined) => {
    setPlaying(true);
    setShowHighScores(score);
  };

  return (
    <>
      <div
        style={{
          backgroundColor: darkColors.black,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div
          style={{
            backgroundColor: playing ? undefined : darkColors.darkGrey,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingBlock: "1rem",
            paddingInline: "16rem",
            borderRadius: "1rem",
          }}
        >
          <H1 style={{ margin: "1rem" }}>Mate Champion</H1>

          {showInstructions && <Instructions />}
          {showHighScores !== undefined && (
            <HighScores score={showHighScores} enablePlay={onEnablePlay} />
          )}
          <div>
            <canvas
              style={{
                height: playing ? undefined : "0px",
              }}
              id="canvas"
            ></canvas>
            <StatsDiv
              level={level}
              lives={lives}
              score={score}
              ammo={ammo}
              disablePlay={playing}
              handleClick={handleClick}
              BtnText={showInstructions ? "Play Game" : "Play Again"}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
