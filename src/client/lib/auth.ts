import axios from "@clnt/lib/axios";
import { User } from "@prisma/client";
import { configureAuth } from 'react-query-auth';
import { useAppStateStore } from "./store/app-state-store";
import { useQueryClient } from "@tanstack/react-query";

export interface IUser extends User {
  permissions: string[];
}

export interface LoginFormValues {
  email: string;
  password: string;
}


const login = async ({ email, password }: LoginFormValues): Promise<IUser> => {
  const res = await axios.post("/auth/login-local", { email, password });
  return res.data
};
const register = async (): Promise<never> => {
  throw new Error("Not implemented");
};

const logout = async (): Promise<void> => {
  useAppStateStore.getState().resetAppState()
  await axios.post("/auth/logout");
};

const loadUser = async (): Promise<IUser | null> => {
  try {
    const res = await axios.get("/auth/user");
    const permRes = await axios.get("/auth/permissions");
    return {
      ...(res.data.user ?? {}),
      permissions: permRes.data.permissions,
    };
  } catch {
    return null;
  }
};

export const { useUser, useLogin, useRegister, useLogout, AuthLoader } = configureAuth({
  userFn: loadUser,
  loginFn: login,
  registerFn: register,
  logoutFn: logout,
});
