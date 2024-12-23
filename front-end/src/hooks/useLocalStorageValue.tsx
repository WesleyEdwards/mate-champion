import {useEffect, useState} from "react"

export function useLocalStorage(
  key: string,
  initValue?: string
): [s: string, setS: (s: string) => void] {
  const [s, setS] = useState<string>(initValue ?? "")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (loading) return
    localStorage.setItem(key, s)
    setS(s)
  }, [s, key, loading])

  useEffect(() => {
    if (!loading) return
    const prev = window.localStorage.getItem(key) ?? ""
    if (prev !== "") {
      setS(prev)
    }
    setLoading(false)
  }, [key, loading])

  return [s, setS]
}
