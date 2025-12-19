import { create } from "zustand";

interface User {
  id: string;
  phoneNumber: string;
  email?: string;
  role: "CUSTOMER" | "ADMIN" | "VERIFIER";
  fullName?: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  setAuthenticated: (isAuth: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user }),
  setAuthenticated: (isAuth) => set({ isAuthenticated: isAuth }),
  clearAuth: () => set({ user: null, isAuthenticated: false }),
}));
