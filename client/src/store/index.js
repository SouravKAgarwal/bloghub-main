import { create } from "zustand";

const useStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("userInfo")),

  isOTPLevel: false,
  
  otpData: JSON.parse(localStorage.getItem("otp_data")),

  isLoading: false,

  theme: localStorage.getItem("theme") ?? "light",

  signIn: (data) => set((state) => ({ user: data })),

  setTheme: (value) => set({ theme: value }),

  setOTP: (val) => set((state) => ({ isOTPLevel: val })),

  setIsLoading: (val) => set((state) => ({ isLoading: val })),

  signOut: () => set({ user: {} }),
}));

export default useStore;
