import React, { useEffect, useState } from "react";
import "./App.css";
import { HighScores } from "./components/HighScores";
import { Instructions } from "./components/Instructions";
import { StatsDiv } from "./components/StatsDiv";
import { enterGameLoop } from "./Game/Main";
import { H1 } from "./components/MHComponents.tsx/Components";
import { Controls } from "./components/Controls";
import { PlayStats, emptyStats } from "./Game/constants";

type Screen = "game" | "home" | "highScores" | "newHighScore";

function App() {
  const [screen, setScreen] = useState<Screen>("home");

  const [stats, setStats] = useState<PlayStats>({ ...emptyStats });

  const modifyStats = (newStats: Partial<PlayStats>) => {
    setStats((prev) => ({ ...prev, ...newStats }));
  };

  const playing = screen === "game";

  const handleClickPlay = () => {
    console.log("handleClickPlay");
    setScreen("game");
    enterGameLoop({
      modifyStats,
      handleLose: () => {
        console.log("handleLose");
        setScreen("highScores");
      },
    });
  };

  useEffect(() => {
    console.log("screen", screen);
  }, [screen]);

  return (
    <>
      <div id="root-div">
        <div
          id={"game-div"}
          style={{
            backgroundColor: playing ? "#000000" : "#212121",
          }}
        >
          <h1 className="green-text" style={{ margin: "1rem" }}>
            Mate Champion
          </h1>

          {screen === "home" && (
            <>
              <Instructions />
              <Controls />
              <button className="btn" onClick={() => handleClickPlay()}>
                Play Game
              </button>
            </>
          )}

          {screen === "highScores" && (
            <HighScores
              score={stats.score}
              play={() => handleClickPlay()}
              mainMenu={() => setScreen("home")}
            />
          )}

          <div>
            <canvas
              style={{
                height: playing ? undefined : "0px",
              }}
              id="canvas"
            ></canvas>

            {playing && <StatsDiv stats={stats} />}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
