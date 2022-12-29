import React, { FC } from "react";

interface MHTypographyProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export const MHTypography: FC<MHTypographyProps> = (props) => {
  return <p {...props} className="green-text" />;
};
