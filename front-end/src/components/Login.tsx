import {ArrowBack} from "@mui/icons-material"
import {Stack, Divider, Button, Input, Alert, Typography} from "@mui/joy"
import {FC, useState} from "react"
import {useAuthContext} from "../hooks/useAuth"
import {MCScreen, PageStack, ScreenProps} from "./GameEntry"
import {useNavigator} from "../hooks/UseNavigator"

export const Login: FC<ScreenProps> = () => {
  const {login, api} = useAuthContext()
  const {resetStack} = useNavigator()

  const [email, setEmail] = useState("")
  const [identifier, setIdentifier] = useState("")
  const [code, setCode] = useState("")

  const [error, setError] = useState<string>("")

  const [submitting, setSubmitting] = useState<boolean>(false)

  const submit = async () => {
    if (identifier && email && code) {
      setSubmitting(true)
      await login({email, code})
      setSubmitting(false)
      resetStack()
      return
    }
    if (email) {
      api.auth.sendAuthCode({email}).then((res) => {
        setIdentifier(res.identifier)
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
        <Button loading={submitting} type="submit">
          {identifier ? "Submit" : "Send Code"}
        </Button>

        {error && <Alert color="danger">{error}</Alert>}
      </PageStack>
    </form>
  )
}
// export const Login: FC<ScreenProps> = () => {
//   const {login} = useAuthContext()
//   const {resetStack} = useNavigator()

//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [error, setError] = useState<string>("")

//   const [submitting, setSubmitting] = useState<boolean>(false)

//   const submit = async () => {
//     if (!email || !password) {
//       setError("Please enter a username and password")
//       return
//     }
//     setSubmitting(true)
//     await login({email, password})
//     setSubmitting(false)
//     resetStack()
//   }

//   return (
//     <form
//       onSubmit={(e) => {
//         e.preventDefault()
//         return submit()
//       }}
//     >
//       <PageStack>
//         <Input
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <Input
//           placeholder="Password"
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <Button loading={submitting} type="submit">
//           Login
//         </Button>

//         {error && <Alert color="danger">{error}</Alert>}
//       </PageStack>
//     </form>
//   )
// }
