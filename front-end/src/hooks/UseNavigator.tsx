import {createContext, useContext, useEffect, useState} from "react"
import {MCScreen} from "../components/GameEntry"
import {useLevelContext} from "./useLevels"

type NavigatorContextType = {
  navigateTo: (screen: MCScreen, replace?: boolean) => void
  goBack: () => void
  resetStack: () => void
  currentScreen: MCScreen
}

const NavigatorContext = createContext<NavigatorContextType>(
  {} as NavigatorContextType
)

export const NavigatorProvider = (props: {children: React.ReactNode}) => {
  const [screenStack, setScreenStack] = useState<MCScreen[]>(["home"])
  const {setEditingLevel} = useLevelContext()

  const navigateTo: NavigatorContextType["navigateTo"] = (screen, replace) => {
    if (replace) {
      setScreenStack([...screenStack.slice(0, -1), screen])
    } else {
      setScreenStack([...screenStack, screen])
    }
  }

  const goBack = () => {
    const back = screenStack.slice(0, -1)
    const newScreen = back.at(back.length - 1)
    if (
      newScreen !== "editorDetail" &&
      newScreen !== "test" &&
      newScreen !== "edit" &&
      newScreen !== "preview"
    ) {
      setEditingLevel(null)
    }
    setScreenStack(back)
  }

  return (
    <NavigatorContext.Provider
      value={{
        navigateTo,
        goBack,
        currentScreen: screenStack.at(-1) ?? "home",
        resetStack: () => setScreenStack(["home"])
      }}
    >
      {props.children}
    </NavigatorContext.Provider>
  )
}

export const useNavigator = () => {
  const navigatorContext = useContext(NavigatorContext)
  return navigatorContext
}
