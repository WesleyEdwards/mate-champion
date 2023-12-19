import { createContext, useContext } from "react";
import { Api } from "../api/Api";
import { User } from "../types";

type AuthContextType = {
  api: Api;
  user?: User;
};

export const AuthContext = createContext({} as AuthContextType);

export const useAuthContext = () => useContext(AuthContext);
