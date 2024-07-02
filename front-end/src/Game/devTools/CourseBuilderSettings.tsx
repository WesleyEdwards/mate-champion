import {
  Stack,
  Tooltip,
  IconButton,
  Input,
  Typography,
  AccordionGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CircularProgress,
} from "@mui/joy";
import { contentCreatorModifyObject, devSettings } from "../devSettings";
import { useEffect, useState } from "react";
import { useLevelContext } from "../../hooks/useLevels";
import { ItemType } from "./CreatingThing";
import grogImg from "../../assets/grog/enemy_walking_single.png";
import packageImg from "../../assets/mate-package.png";
import { camelCaseToTitleCase } from "../../helpers";
import { InnerLevelSettings } from "../../components/InnerLevelSettings";

export const CourseBuilderSettings = () => {
  const { editingLevel } = useLevelContext();
  const [editingItemType, setEditingItemType] = useState<ItemType>();

  const updateEditing = () => {
    if (editingItemType !== devSettings().modifyingItem) {
      setEditingItemType(devSettings().modifyingItem);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      updateEditing();
    }, 300);
    return () => clearInterval(interval);
  });

  const handleSetEditingItem = (item: ItemType) => {
    contentCreatorModifyObject(item);
    setEditingItemType(item);
  };

  if (editingLevel === "loading" || editingLevel === undefined) {
    return <CircularProgress />;
  }

  const imgHeight = "30px";

  return (
    <Stack gap="1rem">
      <AccordionGroup>
        <Accordion>
          <AccordionSummary>Modifying</AccordionSummary>
          {(
            [
              {
                obj: "platform",
                display: (
                  <div
                    style={{
                      width: "20px",
                      height: "10px",
                      backgroundColor: "springgreen",
                      borderColor: "black",
                      borderWidth: "1px",
                    }}
                  ></div>
                ),
              },
              {
                obj: "floor",
                display: (
                  <div
                    style={{
                      width: "20px",
                      height: "10px",
                      backgroundColor: "green",
                      borderColor: "black",
                      borderWidth: "1px",
                    }}
                  ></div>
                ),
              },
              {
                obj: "grog",
                display: (
                  <img
                    style={{ maxWidth: imgHeight, maxHeight: imgHeight }}
                    src={grogImg}
                  />
                ),
              },
              {
                obj: "package",
                display: (
                  <img
                    style={{ maxWidth: imgHeight, maxHeight: imgHeight }}
                    src={packageImg}
                  />
                ),
              },
            ] satisfies {
              obj: ItemType;
              display: JSX.Element;
            }[]
          ).map(({ obj, display }) => (
            <AccordionDetails key={obj}>
              <Card
                variant={editingItemType === obj ? "solid" : "plain"}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    opacity: 0.8,
                  },
                }}
                onClick={() => handleSetEditingItem(obj)}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  height="30px"
                >
                  <Typography>{camelCaseToTitleCase(obj)}</Typography>
                  {display}
                </Stack>
              </Card>
            </AccordionDetails>
          ))}
        </Accordion>
      </AccordionGroup>
      <InnerLevelSettings />
    </Stack>
  );
};
