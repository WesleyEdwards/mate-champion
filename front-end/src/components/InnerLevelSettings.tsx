import { Stack, Tooltip, IconButton, Input, Typography } from "@mui/joy";
import { useLevelContext } from "../hooks/useLevels";
import { useEffect, useState } from "react";
import { Edit, Undo, Check } from "@mui/icons-material";
import { ItemType } from "../Game/devTools/CreatingThing";
import { MCModal } from "./MCModal";

export const InnerLevelSettings = () => {
  const { editingLevel, levelCache } = useLevelContext();
  const [editingLength, setEditingLength] = useState<{
    original: number;
    dirty: number;
  }>({ original: 0, dirty: 0 });
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  if (editingLevel === "loading") return null;

  useEffect(() => {
    setEditingLength({
      original: editingLevel?.endPosition ?? 0,
      dirty: editingLevel?.endPosition ?? 0,
    });
  }, [editingLevel]);

  const submit = () => {
    if (editingLength.dirty < 100) {
      return setError("Are you kidding? That's way too short!");
    }
    if (editingLength.dirty > 20000) {
      return setError(
        "Hmm. That's quite long, it'll be more fun if it's shorter"
      );
    }
    setError("");

    levelCache.update.modify(editingLevel!._id, {
      endPosition: editingLength.dirty,
    });
    setEditingLength({
      original: editingLength.dirty,
      dirty: editingLength.dirty,
    });
    setOpen(false);
  };

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        width="100%"
        justifyContent="space-between"
      >
        <Stack
          width="100%"
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography>End: {editingLength.original}</Typography>
          <Tooltip title="Edit">
            <IconButton onClick={() => setOpen(true)}>
              <Edit />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <MCModal
        title={"Level Length"}
        open={open}
        onClose={() => {
          setError("");
          setEditingLength((prev) => ({
            ...prev,
            dirty: prev.original,
          }));
          return setOpen(false);
        }}
        onConfirm={submit}
        error={error}
        subtext={"Change how long the level is (pixels)"}
      >
        <Input
          fullWidth
          value={editingLength.dirty}
          type="number"
          sx={{ width: "8rem", alignSelf: "center" }}
          onChange={(e) =>
            setEditingLength((prev) => ({
              original: prev.original,
              dirty: isNaN(+e.target.value) ? 0 : +e.target.value,
            }))
          }
        />
      </MCModal>
    </>
  );
};

// {editingOpponentSpeed === undefined ? (
//         <Stack
//           width="100%"
//           direction="row"
//           alignItems="center"
//           justifyContent="space-between"
//         >
//           <Typography>
//             Grog speed:{" "}
//             {(
//               (editingLevel?.opponents.grog.at(0)?.moveSpeed ?? 0.07) * 100
//             ).toFixed(0)}
//           </Typography>
//           <Tooltip title="Edit">
//             <IconButton
//               onClick={() =>
//                 setEditingOpponentSpeed(
//                   +(
//                     (editingLevel?.opponents.grog.at(0)?.moveSpeed ?? 0.07) *
//                     100
//                   ).toFixed(0)
//                 )
//               }
//             >
//               <Edit />
//             </IconButton>
//           </Tooltip>
//         </Stack>
//       ) : (
//         <Stack
//           width="100%"
//           direction="row"
//           alignItems="center"
//           justifyContent="space-between"
//         >
//           {" "}
//           <Typography>Grog speed:</Typography>
//           <Input
//             value={editingOpponentSpeed}
//             type="number"
//             sx={{ maxWidth: "8rem" }}
//             onChange={(e) =>
//               setEditingOpponentSpeed(
//                 isNaN(+e.target.value) ? 0 : +e.target.value
//               )
//             }
//           />
//           <Stack direction="row" gap="1rem">
//             <Tooltip title="Undo">
//               <IconButton
//                 variant="plain"
//                 onClick={() => setEditingOpponentSpeed(undefined)}
//               >
//                 <Undo />
//               </IconButton>
//             </Tooltip>
//             <Tooltip
//               title={
//                 editingOpponentSpeed > 100 || editingOpponentSpeed < 0
//                   ? "Invalid speed"
//                   : "Save"
//               }
//             >
//               <IconButton
//                 disabled={
//                   editingOpponentSpeed > 100 || editingOpponentSpeed < 0
//                 }
//                 onClick={() => {
//                   levelCache.update.modify(editingLevel!._id, {
//                     opponents: {
//                       grog:
//                         editingLevel?.opponents.grog.map((g) => ({
//                           ...g,
//                           moveSpeed: editingOpponentSpeed / 100,
//                         })) ?? [],
//                     },
//                   });
//                   setEditingOpponentSpeed(undefined);
//                 }}
//               >
//                 <Check />
//               </IconButton>
//             </Tooltip>
//           </Stack>
//         </Stack>
//       )}
