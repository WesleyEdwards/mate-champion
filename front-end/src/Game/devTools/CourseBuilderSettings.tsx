import {
  Select,
  Option,
  Stack,
  Tooltip,
  IconButton,
  Input,
  Typography,
} from "@mui/joy";
import { contentCreatorModifyObject } from "../devSettings";
import { ItemType } from "./CreatingThing";
import { useEffect, useState } from "react";
import { Check, Edit, Undo } from "@mui/icons-material";
import { useLevelContext } from "../../hooks/useLevels";

export const CourseBuilderSettings = () => {
  const { editingLevel, modifyLevel } = useLevelContext();
  const [setEditingItemType, editingItemType] = useState(window.selectedItem);
  const [editingLength, setEditingLength] = useState<number>();
  const [editingOpponentSpeed, setEditingOpponentSpeed] = useState<number>();

  useEffect(() => {
    const interval = setInterval(() => {
      editingItemType(window.selectedItem);
    }, 300);
    return () => clearInterval(interval);
  });

  return (
    <Stack gap="1rem">
      <Select
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
      </Select>
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
                    modifyLevel({
                      level: { endPosition: editingLength },
                      saveToDb: true,
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
                  modifyLevel({
                    level: {
                      opponents: {
                        grog:
                          editingLevel?.opponents.grog.map((g) => ({
                            ...g,
                            moveSpeed: editingOpponentSpeed / 100,
                          })) ?? [],
                      },
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
