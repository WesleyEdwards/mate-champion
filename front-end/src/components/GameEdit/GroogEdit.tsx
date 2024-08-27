import {
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Dropdown,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  Select,
  Stack,
  Option,
  Typography,
} from "@mui/joy";
import { FC } from "react";
import { entityFC } from "./ItemTypeEdit";
import { Groog } from "../../game/entities/groog";
import { MCSlider, SizeControl } from "./helpers";

export const GroogEdit: FC<{
  groog: Groog;
  editGroog: (g: Groog) => void;
}> = ({ groog, editGroog }) => {
  const Renderer = entityFC["groog"];

  const facing = groog.state.velocity[0] > 0 ? "right" : "left";

  return (
    <Card>
      <CardContent>
        <Renderer
          style={{
            width: "100%",
            marginBottom: "1rem",
          }}
        />

        <Stack direction="row" gap="1rem" alignItems="center">
          <Typography>Facing: </Typography>

          <Select
            defaultValue={facing}
            onChange={(e, value) => {
              const abs = Math.abs(groog.state.velocity[0]);
              if (value === "left") {
                groog.state.velocity[0] = -abs;
              } else {
                groog.state.velocity[0] = abs;
              }
              editGroog(groog);
            }}
          >
            <Option value="left">Left</Option>
            <Option value="right">Right</Option>
          </Select>
        </Stack>

        <MCSlider
          title="Speed"
          setValue={(value) => {
            const accountForDir = groog.state.velocity[0] > 0 ? value : -value;
            groog.state.velocity[0] = accountForDir / 100;
            return editGroog(groog);
          }}
          value={Math.abs(Math.floor(groog.state.velocity[0] * 100))}
          incrementBy={1}
          min={3}
          max={100}
        />
      </CardContent>
    </Card>
  );
};
