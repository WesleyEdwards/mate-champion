import { Select, Option } from "@mui/joy";
import { contentCreatorModifyObject } from "../devSettings";
import { ItemType } from "./CreatingThing";

export const CourseBuilderSettings = () => {
  return (
    <Select
      sx={{ minWidth: "10rem" }}
      defaultValue="platform"
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
