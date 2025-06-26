import type { User } from "@/core/domain/entities";
import { InvalidCredentialsException } from "@/core/domain/exceptions/InvalidCredentialsException";
import { userRepository } from "@/core/infrastructure/repositories/inMemory";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(persist<AuthState>(
  (set) => ({
    isAuthenticated: false,
    user: null,
    login: async (email, password) => {
      const user = await userRepository.getUserByEmail(email);

      if (!user || user.passwordHash !== password) {
        throw new InvalidCredentialsException("Invalid email or password");
      }

      set({ isAuthenticated: true, user });

      return user;
    },
    logout: () => set({ isAuthenticated: false, user: null }),
  }),
  {
    name: "auth-storage",
  }
));