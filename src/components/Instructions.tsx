import React, { FC } from "react";
import {
  StackHor,
  StackVert,
  Typography,
} from "./MHComponents.tsx/Components";

interface ListItemProps {
  character?: boolean;
  symbol: string;
  text: string;
}
const ListItem: FC<ListItemProps> = (props) => {
  const { symbol, text, character = true } = props;
  return (
    <StackHor
      style={{
        width: "100%",
        justifyContent: "start",
        gap: character ? "4rem" : "1rem",
      }}
    >
      <Typography
        style={{
          fontSize: character ? "1.5rem" : undefined,
        }}
      >
        {symbol}
      </Typography>
      <Typography>{text}</Typography>
    </StackHor>
  );
};

export const Instructions: FC = () => {
  return (
    <StackVert
      style={{
        alignItems: "start",
      }}
    >
      <Typography
        style={{
          overflow: "wrap",
          maxWidth: "500px",
        }}
      >
        The objective of this game is to survive the wrath of all who seek to
        destroy the good reputation of mate. Try to make it as far as you can
        without getting caught.
      </Typography>
      <StackVert>
        <ListItem symbol="&larr;" text="left" />
        <ListItem symbol=" &rarr;" text="right" />
        <ListItem symbol=" &uarr;" text="up" />
        <ListItem symbol="(space)" text="shank" character={false} />
      </StackVert>
    </StackVert>
  );
};

export default Instructions;
