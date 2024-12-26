import {Stack, Typography} from "@mui/joy"
import {FC} from "react"

export const Instructions: FC = () => {
  return (
    <>
      <Stack sx={{alignItems: "start", my: "2rem", gap: 2}}>
        <Typography style={{overflow: "wrap", maxWidth: "500px"}}>
          Survive the wrath of all who seek to destroy the good reputation of
          Yerba Mate! Try to make it as far as you can without dying.
        </Typography>
        <Typography style={{overflow: "wrap", maxWidth: "500px"}}>
          Collect Mate to help you survive longer, avoid falling, and be
          careful. Good luck.
        </Typography>
      </Stack>
    </>
  )
}

export default Instructions
