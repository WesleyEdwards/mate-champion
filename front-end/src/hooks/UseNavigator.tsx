import { createContext, useContext, useEffect, useState } from "react";
import { MCScreen } from "../components/GameEntry";

type NavigatorContextType = {
  navigateTo: (screen: MCScreen) => void;
  goBack: () => void;
  resetStack: () => void;
  currentScreen: MCScreen;
};

const NavigatorContext = createContext<NavigatorContextType>(
  {} as NavigatorContextType
);

export const NavigatorProvider = (props: { children: React.ReactNode }) => {
  const [screenStack, setScreenStack] = useState<MCScreen[]>(["home"]);

  const navigateTo = (screen: MCScreen) => {
    setScreenStack([...screenStack, screen]);
  };

  const goBack = () => {
    console.log("goBack");
    setScreenStack(screenStack.slice(0, -1));
  };

  useEffect(() => {
    console.log(screenStack);
  }, [screenStack]);

  return (
    <NavigatorContext.Provider
      value={{
        navigateTo,
        goBack,
        currentScreen: screenStack.at(-1) ?? "home",
        resetStack: () => setScreenStack(["home"]),
      }}
    >
      {props.children}
    </NavigatorContext.Provider>
  );
};

export const useNavigator = () => {
  const navigatorContext = useContext(NavigatorContext);
  return navigatorContext;
};
