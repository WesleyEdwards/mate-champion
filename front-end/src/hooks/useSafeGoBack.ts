import {useNavigate} from "react-router-dom"

export const useNavigateBack = () => {
  const navigate = useNavigate()
  return () => {
    const referrer = document.referrer
    const sameOrigin = referrer.startsWith(window.location.origin)
    if (sameOrigin) {
      navigate(-1)
    } else {
      navigate("/landing")
    }
  }
}
