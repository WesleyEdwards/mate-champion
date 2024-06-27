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
import { Check, Edit, Undo } from "@mui/icons-material";
import { useLevelContext } from "../../hooks/useLevels";
import { ItemType } from "./CreatingThing";
import grogImg from "../../assets/grog/enemy_walking_single.png";
import packageImg from "../../assets/mate-package.png";
import { camelCaseToTitleCase } from "../../helpers";

export const CourseBuilderSettings = () => {
  const { editingLevel, levelCache } = useLevelContext();
  const [editingItemType, setEditingItemType] = useState<ItemType>();
  const [editingLength, setEditingLength] = useState<number>();
  const [editingOpponentSpeed, setEditingOpponentSpeed] = useState<number>();

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
      <Stack
        direction="row"
        alignItems="center"
        width="100%"
        justifyContent="space-between"
      >
        {editingLength === undefined ? (
          <Stack
            width="100%"
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography>End: {editingLevel?.endPosition}</Typography>
            <Tooltip title="Edit">
              <IconButton
                onClick={() => setEditingLength(editingLevel?.endPosition ?? 0)}
              >
                <Edit />
              </IconButton>
            </Tooltip>
          </Stack>
        ) : (
          <Stack
            width="100%"
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            {" "}
            <Typography>End:</Typography>
            <Input
              value={editingLength}
              type="number"
              sx={{ maxWidth: "8rem" }}
              onChange={(e) =>
                setEditingLength(isNaN(+e.target.value) ? 0 : +e.target.value)
              }
            />
            <Stack direction="row" gap="1rem">
              <Tooltip title="Undo">
                <IconButton
                  variant="plain"
                  onClick={() => setEditingLength(undefined)}
                >
                  <Undo />
                </IconButton>
              </Tooltip>
              <Tooltip title="Save">
                <IconButton
                  onClick={() => {
                    levelCache.update.modify(editingLevel!._id, {
                      endPosition: editingLength,
                    });
                    setEditingLength(undefined);
                  }}
                >
                  <Check />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        )}
      </Stack>
      {editingOpponentSpeed === undefined ? (
        <Stack
          width="100%"
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography>
            Grog speed:{" "}
            {(
              (editingLevel?.opponents.grog.at(0)?.moveSpeed ?? 0.07) * 100
            ).toFixed(0)}
          </Typography>
          <Tooltip title="Edit">
            <IconButton
              onClick={() =>
                setEditingOpponentSpeed(
                  +(
                    (editingLevel?.opponents.grog.at(0)?.moveSpeed ?? 0.07) *
                    100
                  ).toFixed(0)
                )
              }
            >
              <Edit />
            </IconButton>
          </Tooltip>
        </Stack>
      ) : (
        <Stack
          width="100%"
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          {" "}
          <Typography>Grog speed:</Typography>
          <Input
            value={editingOpponentSpeed}
            type="number"
            sx={{ maxWidth: "8rem" }}
            onChange={(e) =>
              setEditingOpponentSpeed(
                isNaN(+e.target.value) ? 0 : +e.target.value
              )
            }
          />
          <Stack direction="row" gap="1rem">
            <Tooltip title="Undo">
              <IconButton
                variant="plain"
                onClick={() => setEditingOpponentSpeed(undefined)}
              >
                <Undo />
              </IconButton>
            </Tooltip>
            <Tooltip
              title={
                editingOpponentSpeed > 100 || editingOpponentSpeed < 0
                  ? "Invalid speed"
                  : "Save"
              }
            >
              <IconButton
                disabled={
                  editingOpponentSpeed > 100 || editingOpponentSpeed < 0
                }
                onClick={() => {
                  levelCache.update.modify(editingLevel!._id, {
                    opponents: {
                      grog:
                        editingLevel?.opponents.grog.map((g) => ({
                          ...g,
                          moveSpeed: editingOpponentSpeed / 100,
                        })) ?? [],
                    },
                  });
                  setEditingOpponentSpeed(undefined);
                }}
              >
                <Check />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};
