import { Select, Option } from "@mui/joy";
import { contentCreatorModifyObject } from "../devSettings";
import { ItemType } from "./CreatingThing";
import { useEffect, useState } from "react";

export const CourseBuilderSettings = () => {
  const [value, setValue] = useState(window.selectedItem);

  useEffect(() => {
    const interval = setInterval(() => {
      setValue(window.selectedItem);
    }, 300);
    return () => clearInterval(interval);
  });
  return (
    <Select
      sx={{ minWidth: "10rem" }}
      value={value}
      onChange={(_, value) => {
        contentCreatorModifyObject(value as ItemType);
      }}
    >
      <Option value="platform">Platform</Option>
      <Option value="floor">Floor</Option>
      <Option value="grog">Grog</Option>
      <Option value="package">Package</Option>
    </Select>
  );
};
