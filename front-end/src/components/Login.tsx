import {Button, Input, Alert, Typography} from "@mui/joy"
import {FC, useState} from "react"
import {useAuthContext} from "../hooks/useAuth"
import {PageStack, ScreenProps} from "./GameEntry"
import {useNavigator} from "../hooks/UseNavigator"
import {useLocalStorage} from "../hooks/useLocalStorageValue"
import {useToast} from "../hooks/Toaster"

export const Login: FC<ScreenProps> = () => {
  const {login, api} = useAuthContext()
  const {resetStack, navigateTo} = useNavigator()

  const [email, setEmail] = useLocalStorage("user-email", "")
  const [identifier, setIdentifier] = useState("")
  const [code, setCode] = useState("")
  const toast = useToast()

  const [error, setError] = useState<string>("")

  const [submitting, setSubmitting] = useState<boolean>(false)

  const submit = async () => {
    if (identifier && email && code) {
      setSubmitting(true)
      try {
        await login({email, code: code.trim()})
        resetStack()
        toast({
          message: "Successfully logged in",
          color: "success"
        })
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
          navigateTo("createAccount", true)
        })
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        return submit()
      }}
    >
      <PageStack>
        {(() => {
          if (identifier) {
            return (
              <>
                <Typography>
                  Enter the code sent to <b>{email}</b>
                </Typography>
                <Input
                  placeholder="Verification code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </>
            )
          }
          return (
            <>
              <Typography>
                We'll send you a Verification code to get started
              </Typography>
              <Input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
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
      </PageStack>
    </form>
  )
}
