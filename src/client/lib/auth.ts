import axios from "@clnt/lib/axios";
import { configureAuth } from "react-query-auth";
import { useAppStateStore } from "./store/app-state-store";
import { IUser, LoginFormValues } from "@clnt/types/auth-types";

const login = async ({ email, password }: LoginFormValues): Promise<IUser> => {
  const res = await axios.post("/auth/login-local", { email, password });
  return res.data;
};
const register = async (): Promise<never> => {
  throw new Error("Not implemented");
};

const logout = async (): Promise<void> => {
  useAppStateStore.getState().resetAppState();
  await axios.post("/auth/logout");
};

const loadUser = async (): Promise<IUser | null> => {
  try {
    const res = await axios.get("/auth/me");
    const permRes = await axios.get("/auth/permissions");
    return {
      ...(res.data.user ?? {}),
      permissions: permRes.data.permissions,
    };
  } catch {
    return null;
  }
};

export const { useUser, useLogin, useRegister, useLogout, AuthLoader } =
  configureAuth({
    userFn: loadUser,
    loginFn: login,
    registerFn: register,
    logoutFn: logout,
  });
