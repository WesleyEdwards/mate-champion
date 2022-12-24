import React, { FC } from "react";

interface ListItemProps {
  character?: boolean;
  symbol: string;
  text: string;
}
const ListItem: FC<ListItemProps> = (props) => {
  const { symbol, text, character = true } = props;
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        flexDirection: "row",
        justifyContent: "start",
        alignItems: "center",
        padding: "0.25rem",
        gap: character ? "4rem" : "1rem",
      }}
    >
      <div
        style={{
          fontSize: character ? "1.5rem" : undefined,
        }}
      >
        {symbol}
      </div>
      {text}
    </div>
  );
};

export const Instructions: FC = () => {
  return (
    <div id="instructions" className="green-text">
      <p>
        The objective of this game is to survive the wrath of all who seek to
        <br />
        destroy the good reputation of mate. Try to make it as far as
        <br />
        you can without getting caught.
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: "150px",
        }}
      >
        <ListItem symbol="&larr;" text="left" />
        <ListItem symbol=" &rarr;" text="right" />
        <ListItem symbol=" &uarr;" text="up" />
        <ListItem symbol="(space)" text="shank" character={false} />
      </div>
    </div>
  );
};

export default Instructions;
