import {FC} from "react"
import {ScreenProps} from "./GameEntry"
import {Button, Stack, Typography} from "@mui/joy"
import Instructions from "./Instructions"
import {PlayScreen} from "./PlayScreen"
import {useAuthContext} from "../hooks/useAuth"
import {PersonalHigh} from "./PersonalHigh"
import {useNavigator} from "../hooks/UseNavigator"
import mateSingle from "../assets/champ/mate-single.png"
import {Construction, Gamepad, Person, BarChart} from "@mui/icons-material"

export const HomeScreen: FC<ScreenProps> = ({modifyStats}) => {
  const {user} = useAuthContext()
  const {navigateTo} = useNavigator()
  return (
    <Stack width="100%" alignItems={"center"} sx={{width: "722px"}}>
      <Typography level="h1">Mate Champion</Typography>
      <Instructions />
      <img
        style={{
          margin: "4px auto 24px",
          width: "80px"
        }}
        src={mateSingle}
      />
      <PlayScreen
        modifyStats={modifyStats}
        screen={"home"}
        setScreen={navigateTo}
      />
      <Stack
        direction="row"
        width="100%"
        justifyContent="center"
        gap="1.5rem"
        mb={4}
      >
        <Button
          variant="outlined"
          sx={{width: "10rem"}}
          onClick={() => navigateTo("highScores")}
          endDecorator={<BarChart />}
        >
          High Scores
        </Button>

        <Button
          variant="outlined"
          sx={{width: "10rem"}}
          onClick={() => navigateTo("profile")}
          endDecorator={<Person />}
        >
          My Profile
        </Button>
      </Stack>

      <Typography mb={4}>Or</Typography>

      <Button
        variant="solid"
        sx={{
          width: "24rem",
          backgroundColor: "#0b6bcb",
          "&:hover": {
            backgroundColor: "#084989"
          }
        }}
        onClick={() => {
          if (user) {
            return navigateTo("levelEditor")
          } else {
            navigateTo("levelEditor")
          }
        }}
        endDecorator={<Construction />}
      >
        {user ? "Level Editor" : "Create a level"}
      </Button>
      <PersonalHigh />
    </Stack>
  )
}
