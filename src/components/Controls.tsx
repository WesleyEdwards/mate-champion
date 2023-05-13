import { FC, useState } from "react";

interface ControlsProps {}
export const Controls: FC<ControlsProps> = (props) => {
  const [showControls, setShowControls] = useState(false);

  return (
    <button className="btn" onClick={() => setShowControls(!showControls)}>
      Controls
    </button>
  );
};

export default Controls;