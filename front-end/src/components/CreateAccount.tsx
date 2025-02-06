import {FC, useState} from "react"
import {Alert, Button, Input, Stack, Typography} from "@mui/joy"
import {useAuthContext} from "../hooks/useAuth"
import {useLocalStorage} from "../hooks/useLocalStorageValue"
import {LabeledInput} from "./Login"
import {ViewHeaderSubScreen} from "./ViewHeader"
import {useNavigate, useParams} from "react-router-dom"
import {MScreen} from "./AuthSwitch"

export const CreateAccount = () => {
  const navigate = useNavigate()
  const {score: rawScore} = useParams<{score: string}>()
  const score = isNaN(parseInt(rawScore ?? "")) ? 0 : parseInt(rawScore ?? "")
  const {api} = useAuthContext()

  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useLocalStorage("user-email", "")

  const initialEmail = !!localStorage.getItem("user-email")

  const handleSubmitNew = async () => {
    if (!emailIsValid(email)) {
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
    try {
      await api.auth.createAccount({name, email, highScore: score ?? 0})

      return navigate("/login")
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
    <MScreen>
      <ViewHeaderSubScreen title="Create Account" />
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
          {initialEmail && (
            <Stack>
              <Typography fontWeight={600} textAlign={"center"}>
                We didn't recognize that email, <br />
                enter a name to create an account
              </Typography>
            </Stack>
          )}

          <LabeledInput label="Name">
            <Input
              size="lg"
              placeholder="Enter Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </LabeledInput>

          <LabeledInput label="Email">
            <Input
              size="lg"
              sx={{flexGrow: "1", mb: 2}}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </LabeledInput>

          {error && <Alert color="danger">{error}</Alert>}
          <Button
            disabled={[name, email].some((v) => !v)}
            loading={submitting}
            type="submit"
          >
            Create Account
          </Button>
        </Stack>
      </form>
    </MScreen>
  )
}

export const emailIsValid = (email: string) => {
  const re = /[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}/g
  return !!email.match(re)
}
