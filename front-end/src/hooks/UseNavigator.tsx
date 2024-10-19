import {createContext, useContext, useEffect, useState} from "react"
import {MCScreen} from "../components/GameEntry"
import {useLevelContext} from "./useLevels"

type NavigatorContextType = {
  navigateTo: (screen: MCScreen) => void
  goBack: () => void
  resetStack: () => void
  currentScreen: MCScreen
}

const NavigatorContext = createContext<NavigatorContextType>(
  {} as NavigatorContextType
)

export const NavigatorProvider = (props: {children: React.ReactNode}) => {
  const [screenStack, setScreenStack] = useState<MCScreen[]>(["home"])
  const {editingLevel, setEditingLevel} = useLevelContext()

  const navigateTo = (screen: MCScreen) => {
    setScreenStack([...screenStack, screen])
  }

  const goBack = () => {
    const back = screenStack.slice(0, -1)
    if (
      back.at(back.length - 1) !== "editorDetail" &&
      back.at(back.length - 1) !== "game"
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
