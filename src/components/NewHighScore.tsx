import React, { FC, useState } from "react";
import { userExists } from "../Firebase/FirebaseHelpers";
import { MHButton } from "./MHComponents.tsx/MHButton";

interface NewHighScoreProps {
  score: number;
  enablePlay: () => void;
  onSubmit: (name: string) => Promise<void>;
}

export const NewHighScore: FC<NewHighScoreProps> = (props) => {
  const { onSubmit, enablePlay } = props;

  const [error, setError] = useState<string | null>(null);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [name, setName] = useState<string>();

  const handleSubmitNew = async () => {
    setDisableSubmit(true);
    setError(null);
    if (!name) {
      setError("Name is required");
      return;
    }
    const sameUsers = await userExists(name);
    if (sameUsers.length > 0) {
      setError("Name is already exists");
      return;
    }
    return onSubmit(name).then(() => {
      enablePlay();
    });
  };

  return (
    <div>
      <h2>Game Over!</h2>
      <h3 className="green-text">
        You got a high score!
        <br />
        To receive credit, Enter your name:
      </h3>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <input
            style={{
              padding: "0.5rem",
            }}
            type="text"
            value={name || ""}
            onChange={(e) => setName(e.target.value)}
          />
          <MHButton
            style={{
              padding: "0.5rem",
            }}
            disabled={disableSubmit}
            onClick={handleSubmitNew}
            type="submit"
          >
            Submit
          </MHButton>
        </div>
        {error && <p className="red-text">{error}</p>}
      </div>
    </div>
  );
};
