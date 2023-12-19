import { useEffect, useState } from "react";
import { Api } from "../api/Api";
import { User } from "../types";

export const useAuth = () => {
  const api = new Api(localStorage.getItem("mate-token"));
  const [user, setUser] = useState<User>();

  useEffect(() => {
    api.auth.getSelf().then(setUser);
  });

  return { api, user };
};
