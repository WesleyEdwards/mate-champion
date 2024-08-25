import { Stack, Card } from "@mui/joy";
import { contentCreatorModifyObject } from "../../game/loopShared/devTools/devSettings";
import { AddableEntity, EditableEntity } from "./CourseBuilderSettings";
import grogImg from "../../assets/grog/enemy_walking_single.png";
import packageImg from "../../assets/mate-package.png";
import platformImg from "../../assets/platform.png";
import { Entity } from "../../game/entities/entityTypes";

export const EditingItem = ({
  edit,
  setEdit,
}: {
  edit: EditableEntity | undefined;
  setEdit: (e: EditableEntity) => void;
}) => {
  const handleSetEditingItem = (item: EditableEntity) => {
    contentCreatorModifyObject(item);
    setEdit(item);
  };

  return (
    <Stack gap="1rem" minWidth="200px">
      {Object.entries(images).map(([obj, display]) => (
        <Card
          key={obj}
          variant={edit === obj ? "solid" : "plain"}
          sx={{
            cursor: "pointer",
            "&:hover": {
              opacity: 0.8,
            },
            paddingY: "5px",
            minHeight: "60px",
          }}
          onClick={() => handleSetEditingItem(obj)}
        >
          <Stack
            justifyContent="space-between"
            direction="row"
            alignItems="center"
            height="100%"
          >
            {obj} {display}
          </Stack>
        </Card>
      ))}
    </Stack>
  );
};

const images: Record<AddableEntity, JSX.Element> = {
  platform: (
    <div
      style={{
        width: "60px",
        height: "30px",
        backgroundColor: "springgreen",
        borderColor: "black",
        borderWidth: "3px",
        borderStyle: "solid",
      }}
    ></div>
  ),
  floor: (
    <img
      src={platformImg}
      style={{
        width: "60px",
        height: "30px",
      }}
    />
  ),
  groog: (
    <img
      style={{
        maxWidth: "50px",
        maxHeight: "50px",
        marginBlockEnd: "-10px",
      }}
      src={grogImg}
    />
  ),
  ammo: (
    <img style={{ maxWidth: "30px", maxHeight: "30px" }} src={packageImg} />
  ),
};

export const renderEntity = (e: AddableEntity): JSX.Element => {
  return images[e];
};
