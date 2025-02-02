import {Button, Input, Alert, Typography, Stack} from "@mui/joy"
import {useState} from "react"
import {useAuthContext} from "../hooks/useAuth"
import {useLocalStorage} from "../hooks/useLocalStorageValue"
import {useToast} from "../hooks/Toaster"
import {emailIsValid} from "./CreateAccount"
import {ViewHeaderSubScreen} from "./ViewHeader"
import {MScreen} from "./AuthSwitch"
import {useNavigate} from "react-router-dom"

export const Login = () => {
  const {login, api} = useAuthContext()
  const navigate = useNavigate()

  const [email, setEmail] = useLocalStorage("user-email", "")
  const [identifier, setIdentifier] = useState("")
  const [code, setCode] = useState("")
  const toast = useToast()

  const [error, setError] = useState<string>("")

  const [submitting, setSubmitting] = useState<boolean>(false)

  const submit = async () => {
    if (!emailIsValid(email)) {
      return setError("Please enter a valid email")
    }
    if (identifier && email && code) {
      setSubmitting(true)
      try {
        await login({email, code: code.trim()})
        toast({
          message: "Successfully logged in",
          color: "success"
        })
        navigate("/landing")
      } catch {
        setError("Invalid code, try again")
      }
      setSubmitting(false)
      return
    }
    if (email && !identifier) {
      api.auth
        .sendAuthCode({email})
        .then((res) => {
          setIdentifier(res.identifier)
        })
        .catch(() => {
          navigate("/createAccount")
        })
    }
  }

  return (
    <MScreen>
      <ViewHeaderSubScreen title="Login" />
      <form
        onSubmit={(e) => {
          e.preventDefault()
          return submit()
        }}
      >
        <Stack my={"2rem"} gap="2rem">
          {(() => {
            if (identifier) {
              return (
                <>
                  <Typography textAlign={"center"}>
                    Enter the code sent to <b>{email}</b>
                  </Typography>

                  <LabeledInput label="Code">
                    <Input
                      placeholder="Verification code"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                    />
                  </LabeledInput>
                </>
              )
            }
            return (
              <>
                <Typography fontWeight={600} textAlign={"center"}>
                  We'll send you a Verification code to get started
                </Typography>
                <LabeledInput label="Email">
                  <Input
                    placeholder="Enter Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </LabeledInput>
              </>
            )
          })()}
          <Button
            loading={submitting}
            type="submit"
            disabled={identifier ? !code : !email}
          >
            {identifier ? "Submit" : "Send Code"}
          </Button>

          {error && <Alert color="danger">{error}</Alert>}
        </Stack>
      </form>
    </MScreen>
  )
}

export const LabeledInput = ({
  label,
  children
}: {
  label: string
  children: React.ReactNode
}) => {
  return (
    <div>
      <Typography level="body-md" alignSelf={"flex-start"} my={"4px"}>
        {label}
      </Typography>
      {children}
    </div>
  )
}
