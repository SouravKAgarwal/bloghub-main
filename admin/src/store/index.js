import { create } from "zustand";

const useStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")),
  isOTPLevel: false,
  otpData: JSON.parse(localStorage.getItem("otp_data")),
  signInModal: false,

  theme: localStorage.getItem("theme") ?? "light",

  setTheme: (value) => set({ theme: value }),

  signIn: (data) => set((state) => ({ user: data })),

  setOTP: (val) => set((state) => ({ isOTPLevel: val })),

  signOut: () => set({ user: {} }),

  setSignInModal: (val) => set((state) => ({ signInModal: val })),
}));

export default useStore;
