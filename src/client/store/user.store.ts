import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

import { Document, Types } from 'mongoose'
import axios from '@clnt/lib/axios';
import { toast } from 'sonner';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  username: string;
  role: 'administrator' | 'instructor' | 'student';
  classes?: Types.ObjectId[];
  is_online?: boolean;
  last_active_at?: Date | null;
  created_at?: Date;
}

export interface LoginFormValues {
  email: string;
  password: string;
}

interface UserState {
  user: IUser | null;
  expiresAt: number;
  loginUser: (form: LoginFormValues) => Promise<void>;
  logoutUser: () => Promise<void>;
  validateSession: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      expiresAt: 0,
      loginUser: async (form) => {
        try {
          const res = await axios.post("/auth/login", form);
          const data = res.data;
          
          if (res.status !== 200) {
            toast.error(data.message || "Login failed");
            return
          }

          set({ user: data?.user, expiresAt: (Date.now() + data?.expiresAt)});
          toast.success(data.message || "Login successful");
        
        } catch (error) {
          console.error("Login error:", error)
        }
      },

      logoutUser: async () => {
        const res = await axios.post('/auth/logout')
        //console.log(res)
        if (res.statusText !== 'OK') {
          toast.error('Logout unsuccessful')
          return
        }
        set({ user: null, expiresAt: 0 });
      },

      validateSession: async () => {
        const { expiresAt } = get();
        if (Date.now() >= expiresAt) {
          console.log('session timeout')
          set({ user: null, expiresAt: 0 });
          return;
        }
        console.log('skipped validate')
      }
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);