import React, { FC } from "react";

interface MHButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const MHButton: FC<MHButtonProps> = (props) => {
  return (
    <button {...props} type="submit" className="btn">
      {props.children}
    </button>
  );
};
