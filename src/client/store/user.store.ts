import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

import { Document, Types } from 'mongoose'
import axios from '@clnt/lib/axios';

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

interface UserState {
  user: IUser | null;
  addUser: (user: IUser) => void;
  getUser: () => Promise<void>;
  removeUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      addUser: (user) => set({ user }),
      getUser: async () => {
        try {
          const response = await axios.get('/auth/user');
          console.log(response)
          if (response.data) {
            set({ user: response.data });
            //console.log('✅ User fetched:', response.data);
          }
        } catch {
          //console.error('❌ Failed to fetch user:', error);
          set({ user: null });
        }
      },
      removeUser: () => set({ user: null }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);