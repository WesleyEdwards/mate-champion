import {FC} from "react"
import {Button, Stack, Typography} from "@mui/joy"
import Instructions from "./Instructions"
import {useAuthContext} from "../hooks/useAuth"
import {PersonalHigh} from "./PersonalHigh"
import mateSingle from "../assets/champ/mate-single.png"
import {Construction, Person, BarChart} from "@mui/icons-material"
import {useNavigate} from "react-router-dom"
import {MScreen} from "./Layout"

export const HomeScreen: FC = () => {
  const {user} = useAuthContext()
  const navigate = useNavigate()

  return (
    <MScreen>
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
        <Button
          sx={{width: "11rem", mb: "2rem"}}
          onClick={() => {
            navigate("/play")
          }}
        >
          Play
        </Button>
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
            onClick={() => navigate("/highScores")}
            endDecorator={<BarChart />}
          >
            High Scores
          </Button>

          <Button
            variant="outlined"
            sx={{width: "10rem"}}
            onClick={() => navigate("/profile")}
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
            navigate("/levels")
          }}
          endDecorator={<Construction />}
        >
          {user ? "Level Editor" : "Create a level"}
        </Button>
        <PersonalHigh />
      </Stack>
    </MScreen>
  )
}
