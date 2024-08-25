import {
  CircularProgress,
  Stack,
  Card,
  IconButton,
  Typography,
  CardContent,
} from "@mui/joy";
import { useState, useEffect, FC } from "react";
import { Entity, EntityType } from "../../game/entities/entityTypes";
import { devSettings } from "../../game/loopShared/devTools/devSettings";
import { useLevelContext } from "../../hooks/useLevels";
import { EditingItem, renderEntity } from "./ItemTypeEdit";
import { Add, Remove } from "@mui/icons-material";
import { PlatformState } from "../../game/entities/platform";

export type EditableEntity = Exclude<EntityType, "player" | "bullet">;

export type AddableEntity = Exclude<
  EntityType,
  "player" | "bullet" | "endGate"
>;

export const CourseBuilderSettings = () => {
  const { editingLevel } = useLevelContext();
  const [editingItemType, setEditingItemType] = useState<EditableEntity>();
  const [editingEntities, setEditingEntities] = useState<Entity[]>([]);

  const updateEditing = () => {
    if (editingItemType !== devSettings().modifyingItem) {
      setEditingItemType(devSettings().modifyingItem);
    }
    if (!arraysAreSame(editingEntities, window.editingEntities)) {
      setEditingEntities([...window.editingEntities]);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      updateEditing();
    }, 100);
    return () => clearInterval(interval);
  });

  if (editingLevel === "loading" || editingLevel === undefined) {
    return <CircularProgress />;
  }

  return (
    <Stack gap="2rem">
      <EditingItem edit={editingItemType} setEdit={setEditingItemType} />
      <EditingEntities edit={editingEntities} setEdit={setEditingEntities} />
    </Stack>
  );
};

export const EditingEntities: FC<{
  edit: Entity[];
  setEdit: React.Dispatch<React.SetStateAction<Entity[]>>;
}> = ({ edit, setEdit }) => {
  return (
    <Stack>
      {edit.map((entity) => {
        if (entity.typeId === "platform") {
          return (
            <Card key={entity.id}>
              <CardContent>
                <div
                  style={{
                    width: "100%",
                    height: "30px",
                    backgroundColor: (entity.state as PlatformState).color,
                    borderColor: "black",
                    borderWidth: "3px",
                    borderStyle: "solid",
                  }}
                ></div>
                <Stack alignItems={"center"}>
                  <Typography level="body-lg">Width</Typography>
                  <Stack
                    direction="row"
                    p="10px"
                    justifyContent="space-between"
                    alignItems="center"
                    width="100%"
                  >
                    <IconButton
                      onClick={() => {
                        setEdit((prev) =>
                          prev.map((e) => {
                            if (e.id === entity.id) {
                              entity.state.dimensions[0] -= 10;
                              return entity;
                            }
                            return e;
                          })
                        );
                      }}
                    >
                      <Remove />
                    </IconButton>
                    <Typography>{entity.state.dimensions[0]}</Typography>
                    <IconButton
                      onClick={() => {
                        setEdit((prev) =>
                          prev.map((e) => {
                            if (e.id === entity.id) {
                              entity.state.dimensions[0] += 10;
                              return entity;
                            }
                            return e;
                          })
                        );
                      }}
                    >
                      <Add />
                    </IconButton>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          );
        }
        return <div key={entity.id}>{entity.typeId}</div>;
      })}
    </Stack>
  );
};

// export const CourseBuilderSettings = () => {
//   const { editingLevel } = useLevelContext();
//   const [editingItemType, setEditingItemType] = useState<EditableEntity>();

//   const updateEditing = () => {
//     if (editingItemType !== devSettings().modifyingItem) {
//       setEditingItemType(devSettings().modifyingItem);
//     }
//   };

//   useEffect(() => {
//     const interval = setInterval(() => {
//       updateEditing();
//     }, 300);
//     return () => clearInterval(interval);
//   });

//   const handleSetEditingItem = (item: EditableEntity) => {
//     contentCreatorModifyObject(item);
//     setEditingItemType(item);
//   };

//   if (editingLevel === "loading" || editingLevel === undefined) {
//     return <CircularProgress />;
//   }

//   const imgHeight = "30px";

//   return (
//     <Stack gap="1rem">
//       <AccordionGroup>
//         <Accordion>
//           <AccordionSummary>Modifying</AccordionSummary>
//           {(
//             [
//               {
//                 obj: "platform",
//                 display: (
//                   <div
//                     style={{
//                       width: "20px",
//                       height: "10px",
//                       backgroundColor: "springgreen",
//                       borderColor: "black",
//                       borderWidth: "1px",
//                     }}
//                   ></div>
//                 ),
//               },
//               {
//                 obj: "floor",
//                 display: (
//                   <div
//                     style={{
//                       width: "20px",
//                       height: "10px",
//                       backgroundColor: "green",
//                       borderColor: "black",
//                       borderWidth: "1px",
//                     }}
//                   ></div>
//                 ),
//               },
//               {
//                 obj: "groog",
//                 display: (
//                   <img
//                     style={{ maxWidth: imgHeight, maxHeight: imgHeight }}
//                     src={grogImg}
//                   />
//                 ),
//               },
//               // {
//               //   obj: "package",
//               //   display: (
//               //     <img
//               //       style={{ maxWidth: imgHeight, maxHeight: imgHeight }}
//               //       src={packageImg}
//               //     />
//               //   ),
//               // },
//             ] satisfies {
//               obj: EditableEntity;
//               display: JSX.Element;
//             }[]
//           ).map(({ obj, display }) => (
//             <AccordionDetails key={obj}>
//               <Card
//                 variant={editingItemType === obj ? "solid" : "plain"}
//                 sx={{
//                   cursor: "pointer",
//                   "&:hover": {
//                     opacity: 0.8,
//                   },
//                 }}
//                 onClick={() => handleSetEditingItem(obj)}
//               >
//                 <Stack
//                   direction="row"
//                   justifyContent="space-between"
//                   alignItems="center"
//                   height="30px"
//                 >
//                   <Typography>{camelCaseToTitleCase(obj)}</Typography>
//                   {display}
//                 </Stack>
//               </Card>
//             </AccordionDetails>
//           ))}
//         </Accordion>
//       </AccordionGroup>
//       <InnerLevelSettings />
//     </Stack>
//   );
// };

export const arraysAreSame = (a: Entity[], b: Entity[]) =>
  a.every((e) => b.find((entity) => entity.id === e.id)) &&
  b.every((e) => a.find((entity) => entity.id === e.id));
