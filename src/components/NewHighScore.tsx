import React, { FC, useState } from "react";
import { MHButton } from "./MHComponents.tsx/MHButton";
import { userAlreadyExists } from "../Firebase/FirebaseHelpers";

interface NewHighScoreProps {
  score: number;
  onSubmit: (name: string) => Promise<void>;
}

export const NewHighScore: FC<NewHighScoreProps> = (props) => {
  const { onSubmit } = props;

  const [error, setError] = useState<string | null>(null);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [name, setName] = useState("");

  const handleSubmitNew = async () => {
    setDisableSubmit(true);
    setError(null);
    if (!name) return;
    if (name.length > 300) {
      setError("Name is too long");
      return setDisableSubmit(false);
    }
    const sameUsers = await userAlreadyExists(name);

    if (sameUsers) {
      setError("Name is already exists");
      setDisableSubmit(false);
      return;
    }
    return onSubmit(name);
  };

  return (
    <div>
      <h2 className="green-text">Game Over!</h2>
      <h3 className="green-text">
        You got a high score!
        <br />
        To receive credit, Enter your name:
      </h3>
      <div className="vertical-flex" style={{ gap: "1rem" }}>
        <div className="horizontal-flex" style={{ gap: "1rem" }}>
          <input
            style={{ padding: "0.5rem" }}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            style={{ padding: "0.5rem" }}
            disabled={name.length === 0 || disableSubmit}
            onClick={handleSubmitNew}
            type="submit"
          >
            Submit
          </button>
        </div>
        {error && <p className="red-text">{error}</p>}
      </div>
    </div>
  );
};
