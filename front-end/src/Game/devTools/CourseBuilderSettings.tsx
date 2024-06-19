import {
  Select,
  Option,
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
import { contentCreatorModifyObject } from "../devSettings";
import { useEffect, useState } from "react";
import { Check, Edit, Undo } from "@mui/icons-material";
import { useLevelContext } from "../../hooks/useLevels";

export const CourseBuilderSettings = () => {
  const { editingLevel, levelCache } = useLevelContext();
  const [editingItemType, setEditingItemType] = useState(window.selectedItem);
  const [editingLength, setEditingLength] = useState<number>();
  const [editingOpponentSpeed, setEditingOpponentSpeed] = useState<number>();

  useEffect(() => {
    const interval = setInterval(() => {
      setEditingItemType(window.selectedItem);
    }, 300);
    return () => clearInterval(interval);
  });

  if (editingLevel === "loading" || editingLevel === undefined) {
    return <CircularProgress />;
  }

  return (
    <Stack gap="1rem">
      <AccordionGroup>
        <Accordion>
          <AccordionSummary>Modifying</AccordionSummary>
          <AccordionDetails>
            <Card
              variant="plain"
              sx={{
                cursor: "pointer",
                "&:hover": {
                  opacity: 0.8,
                },
              }}
              onClick={() => contentCreatorModifyObject("platform")}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography>Platform</Typography>
                <div
                  style={{
                    width: "20px",
                    height: "10px",
                    backgroundColor: "green",
                    borderColor: "black",
                    borderWidth: "1px",
                  }}
                ></div>
              </Stack>
            </Card>
          </AccordionDetails>
          {/* <AccordionDetails>
            <Button onClick={}>Platform</Button>
          </AccordionDetails>
          <AccordionDetails>
            <Button onClick={}>Floor</Button>
          </AccordionDetails>
          <AccordionDetails>
            <Button onClick={}>Grog</Button>
          </AccordionDetails>
          <AccordionDetails>
            <Button onClick={}>Package</Button>
          </AccordionDetails> */}
        </Accordion>
      </AccordionGroup>
      {/* <Select
        sx={{ minWidth: "10rem" }}
        value={setEditingItemType}
        onChange={(_, value) => {
          contentCreatorModifyObject(value as ItemType);
        }}
      >
        <Option value="platform">Platform</Option>
        <Option value="floor">Floor</Option>
        <Option value="grog">Grog</Option>
        <Option value="package">Package</Option>
      </Select> */}
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
