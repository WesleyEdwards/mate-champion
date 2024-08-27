import {
  Stack,
  Card,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  MenuButton,
  Dropdown,
} from "@mui/joy";
import { contentCreatorModifyObject } from "../../game/loopShared/devTools/devSettings";
import { AddableEntity, EditableEntity } from "./CourseBuilderSettings";
import grogImg from "../../assets/grog/enemy_walking_single.png";
import packageImg from "../../assets/mate-package.png";
import platformImg from "../../assets/platform.png";
import { FC } from "react";
import { capitalize } from "lodash";
import { Edit } from "@mui/icons-material";

export const AddingEntity = ({
  edit,
  setEdit,
}: {
  edit: AddableEntity | undefined;
  setEdit: (e: AddableEntity) => void;
}) => {
  const handleSetEditingItem = (item: AddableEntity) => {
    contentCreatorModifyObject(item);
    setEdit(item);
  };

  if (!edit) return null;

  const Render = entityFC[edit];

  return (
    <Card
      style={{
        padding: "12px",
      }}
    >
      <Stack>
        <Stack direction="row" justifyContent="space-between">
          <Stack>
            <Typography level="title-lg">{capitalize(edit)}</Typography>
            <Typography level="body-xs">
              Ctrl + Click to add a{edit === "ammo" ? "n" : ""}{" "}
              {capitalize(edit)}.
            </Typography>
          </Stack>
          <Dropdown>
            <MenuButton
              slots={{ root: IconButton }}
              slotProps={{
                root: {
                  variant: "outlined",
                  color: "neutral",
                },
              }}
            >
              <Edit />
            </MenuButton>
            <Menu>
              {Object.keys(entityFC).map((k) => (
                <MenuItem
                  key={k}
                  onClick={() => handleSetEditingItem(k)}
                  disabled={edit === k}
                >
                  {k}
                </MenuItem>
              ))}
            </Menu>
          </Dropdown>
        </Stack>
        <Render />
      </Stack>
    </Card>
  );

  // return (
  //   <Stack gap="1rem" minWidth="200px">
  //     {Object.entries(entityFC).map(([obj, Display]) => (
  //       <Card
  //         key={obj}
  //         variant={edit === obj ? "solid" : "plain"}
  //         sx={{
  //           cursor: "pointer",
  //           "&:hover": {
  //             opacity: 0.8,
  //           },
  //           paddingY: "5px",
  //           minHeight: "60px",
  //         }}
  //         onClick={() => handleSetEditingItem(obj)}
  //       >
  //         <Stack
  //           justifyContent="space-between"
  //           direction="row"
  //           alignItems="center"
  //           height="100%"
  //         >
  //           {obj} <Display />
  //         </Stack>
  //       </Card>
  //     ))}
  //   </Stack>
  // );
};

export const entityFC: Record<
  AddableEntity,
  FC<{ style?: React.CSSProperties | undefined }>
> = {
  platform: ({ style }) => (
    <div
      style={{
        width: "60px",
        height: "30px",
        backgroundColor: "springgreen",
        borderColor: "black",
        borderWidth: "3px",
        borderStyle: "solid",
        ...style,
      }}
    ></div>
  ),
  floor: ({ style }) => (
    <img
      src={platformImg}
      style={{ ...style, width: "60px", height: "30px" }}
    />
  ),
  groog: ({ style }) => (
    <img
      style={{
        ...style,
        maxWidth: "50px",
        maxHeight: "50px",
      }}
      src={grogImg}
    />
  ),
  ammo: ({ style }) => (
    <img
      style={{ ...style, maxWidth: "30px", maxHeight: "30px" }}
      src={packageImg}
    />
  ),
};
