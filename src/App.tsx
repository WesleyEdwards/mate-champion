import React, { useState } from "react";
import "./App.css";
import { HighScores } from "./components/HighScores";
import { Instructions } from "./components/Instructions";
import { StatsDiv } from "./components/StatsDiv";
import { enterGameLoop } from "./Game/Main";
import { Controls } from "./components/Controls";
import { PlayStats, emptyStats } from "./Game/constants";
import { useScoreData } from "./hooks/useScoreInfo";

type Screen = "game" | "home" | "highScores" | "newHighScore" | "controls";

function App() {
  const [screen, setScreen] = useState<Screen>("home");

  const [stats, setStats] = useState<PlayStats>({ ...emptyStats });
  const { scores, playerScore } = useScoreData();

  const modifyStats = (newStats: Partial<PlayStats>) => {
    setStats((prev) => ({ ...prev, ...newStats }));
  };

  const handleLose = () => setScreen("highScores");

  const playing = screen === "game";

  const handleClickPlay = () => {
    setStats({ ...emptyStats });
    setScreen("game");
    enterGameLoop({ modifyStats, handleLose });
  };

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
              <div className="horizontal-flex">
                <button className="btn" onClick={() => setScreen("highScores")}>
                  High Scores
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => handleClickPlay()}
                >
                  Play Game
                </button>
                <button className="btn" onClick={() => setScreen("controls")}>
                  Controls
                </button>
              </div>
            </>
          )}

          {screen === "highScores" && (
            <HighScores
              score={stats.score}
              scores={scores}
              playerPrevScore={playerScore}
              mainMenu={() => setScreen("home")}
            />
          )}
          {screen === "controls" && (
            <Controls mainMenu={() => setScreen("home")} />
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
