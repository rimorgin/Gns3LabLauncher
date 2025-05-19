import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

import { Document, Types } from 'mongoose'
import axios from 'axios';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  username: string;
  password: string;
  role: 'instructor' | 'student';
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
    (set, get) => ({
      user: null,
      addUser: (user) => set({ user }),
      getUser: async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/v1/auth/user', {
            withCredentials: true,
          });
          if (response.data) {
            set({ user: response.data });
            console.log('✅ User fetched:', response.data);
          }
        } catch (error) {
          console.error('❌ Failed to fetch user:', error);
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