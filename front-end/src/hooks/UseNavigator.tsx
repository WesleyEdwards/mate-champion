import { createContext, useContext, useState } from "react";
import { MCScreen } from "../components/GameEntry";

type NavigatorContextType = {
  navigateTo: (screen: MCScreen) => void;
  goBack: () => void;
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
    setScreenStack((prev) => prev.slice(0, prev.length - 1));
  };

  return (
    <NavigatorContext.Provider
      value={{
        navigateTo,
        goBack,
        currentScreen: screenStack.at(-1) ?? "home",
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
