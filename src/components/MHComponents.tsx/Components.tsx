import React, { FC } from "react";

interface hProps extends React.HTMLAttributes<HTMLHeadingElement> {}
interface Stack extends React.HTMLAttributes<HTMLDivElement> {}
interface Typography extends React.HTMLAttributes<HTMLParagraphElement> {}

export const H1: FC<hProps> = (props) => {
  return (
    <h1 className="green-text" {...props}>
      {props.children}
    </h1>
  );
};

export const H2: FC<hProps> = (props) => {
  return (
    <h2 className="green-text" {...props}>
      {props.children}
    </h2>
  );
};
export const H3: FC<hProps> = (props) => {
  return (
    <h3 className="green-text" {...props}>
      {props.children}
    </h3>
  );
};
export const Typography: FC<Typography> = (props) => {
  return (
    <p className="green-text" {...props}>
      {props.children}
    </p>
  );
};

export const StackVert: FC<Stack> = (props) => {
  return (
    <div className="vertical-flex" {...props}>
      {props.children}
    </div>
  );
};
export const StackHor: FC<Stack> = (props) => {
  return (
    <div className="horizontal-flex" {...props}>
      {props.children}
    </div>
  );
};
