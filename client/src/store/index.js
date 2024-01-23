import { create } from "zustand";

const useStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("userInfo")),

  isLoading: false,

  theme: localStorage.getItem("theme") ?? "light",

  signIn: (data) => set((state) => ({ user: data })),

  setTheme: (value) => set({ theme: value }),

  setIsLoading: (val) => set((state) => ({ isLoading: val })),

  signOut: () => set({ user: {} }),
}));

export default useStore;
