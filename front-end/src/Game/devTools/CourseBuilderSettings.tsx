import {
  Stack,
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
import grogImg from "../../assets/grog/enemy_walking_single.png";
import packageImg from "../../assets/mate-package.png";
import { EntityType } from "../../game2/entityTypes";

export type EditableEntity = Exclude<
  EntityType,
  "player" | "bullet"
>;

export type AddableEntity = Exclude<
  EntityType,
  "player" | "bullet" | "endGate"
>;

export const CourseBuilderSettings = () => {
  const { editingLevel } = useLevelContext();
  const [editingItemType, setEditingItemType] = useState<EditableEntity>();

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

  const handleSetEditingItem = (item: EditableEntity) => {
    contentCreatorModifyObject(item);
    setEditingItemType(item);
  };

  if (editingLevel === "loading" || editingLevel === undefined) {
    return <CircularProgress />;
  }

  const images = [
    {
      obj: "platform",
      display: (
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
    },
    {
      obj: "floor",
      display: (
        <div
          style={{
            width: "60px",
            height: "30px",
            backgroundColor: "green",
            borderColor: "black",
            borderWidth: "3px",
            borderStyle: "solid",
          }}
        ></div>
      ),
    },
    {
      obj: "groog",
      display: (
        <img
          style={{
            maxWidth: "50px",
            maxHeight: "50px",
            marginBlockEnd: "-10px",
          }}
          src={grogImg}
        />
      ),
    },
    {
      obj: "ammo",
      display: (
        <img style={{ maxWidth: "30px", maxHeight: "30px" }} src={packageImg} />
      ),
    },
  ] satisfies {
    obj: EditableEntity;
    display: JSX.Element;
  }[];

  return (
    <Stack>
      <Stack gap="1rem" minWidth="200px">
        {images.map(({ obj, display }) => (
          <Card
            key={obj}
            variant={editingItemType === obj ? "solid" : "plain"}
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
