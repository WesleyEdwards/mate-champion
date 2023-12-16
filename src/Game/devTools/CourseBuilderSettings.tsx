import { Select, Option } from "@mui/joy";

export const CourseBuilderSettings = () => {
  return (
    <Select
      sx={{ minWidth: "10rem" }}
      defaultValue="platform"
      onChange={(_, value) => {
        // @ts-ignore - this is a hacky hack
        window.hackyHack = value;
        console.log(value);
      }}
    >
      <Option value="platform">Platform</Option>
      <Option value="floor">Floor</Option>
      <Option value="grog">Grog</Option>
      <Option value="package">Package</Option>
    </Select>
  );
};
