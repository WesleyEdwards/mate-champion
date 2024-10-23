import {FC, useState} from "react"
import {Alert, Button, Input, Stack, Tooltip, Typography} from "@mui/joy"
import {useAuthContext} from "../hooks/useAuth"
import {ArrowBack, Help, Info, InfoOutlined} from "@mui/icons-material"
import {ScreenProps} from "./GameEntry"
import {useNavigator} from "../hooks/UseNavigator"
import {AlreadyHaveAccountButton} from "./SignInButton"

export const CreateAccount: FC<ScreenProps> = ({score}) => {
  const {createAccount} = useAuthContext()
  const {resetStack} = useNavigator()

  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmitNew = async () => {
    if (!email.includes("@") || !email.includes(".")) {
      setError("Invalid email")
      return
    }

    setSubmitting(true)
    setError(null)
    if (!name) return
    if (name.length > 300) {
      setError("Name is too long")
      return setSubmitting(false)
    }
    if (password.length < 3) {
      setError("Password must be at least 3 characters long")
      return setSubmitting(false)
    }
    try {
      await createAccount({
        _id: crypto.randomUUID(),
        name,
        email: email === "" ? undefined : email,
        password,
        highScore: score ?? 0,
        userType: "User"
      })

      return resetStack()
    } catch (e) {
      setSubmitting(false)
      const error = await e
      if (typeof error === "object" && !!error && "error" in error) {
        setError(error.error as string)
      } else {
        setError("Error creating account")
      }
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        return handleSubmitNew()
      }}
    >
      <Stack direction="row" justifyContent="space-between">
        {score > 0 && <Typography level="h2">Score: {score}</Typography>}
      </Stack>
      <Stack sx={{gap: "1rem", my: "1rem"}}>
        {score !== undefined && score !== 0 && (
          <Stack>
            <Typography>That&apos;s a new record for you!</Typography>
            <Typography>To save your score, create an account</Typography>
          </Stack>
        )}
        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Stack direction="row" alignItems={"center"} gap="12px">
          <Input
            sx={{flexGrow: "1"}}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Tooltip title="Your email can be used to reset your password">
            <InfoOutlined />
          </Tooltip>
        </Stack>
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <Alert color="danger">{error}</Alert>}
        <Button
          disabled={[name, password, email].some((v) => !v)}
          loading={submitting}
          type="submit"
        >
          Create Account
        </Button>
        <AlreadyHaveAccountButton />
      </Stack>
    </form>
  )
}
