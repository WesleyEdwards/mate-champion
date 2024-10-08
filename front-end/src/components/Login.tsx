import {ArrowBack} from "@mui/icons-material"
import {Stack, Divider, Button, Input, Alert} from "@mui/joy"
import {FC, useState} from "react"
import {useAuthContext} from "../hooks/useAuth"
import {MCScreen, ScreenProps} from "./GameEntry"
import {useNavigator} from "../hooks/UseNavigator"

export const Login: FC<ScreenProps> = () => {
  const {login} = useAuthContext()
  const {resetStack} = useNavigator()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string>("")

  const [submitting, setSubmitting] = useState<boolean>(false)

  const submit = () => {
    if (!email || !password) {
      setError("Please enter a username and password")
      return
    }
    setSubmitting(true)
    login({email, password})
      .then(() => {
        setSubmitting(false)
        resetStack()
      })
      .catch((err) => {
        setSubmitting(false)
        err.then((e: any) => setError(e.message))
      })
  }

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <Divider />
      <Stack gap="1rem" my={2} sx={{width: "722px"}}>
        <Input
          placeholder="Email/Username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button loading={submitting} onClick={submit}>
          Login
        </Button>

        {error && <Alert color="danger">{error}</Alert>}
      </Stack>
    </form>
  )
}
