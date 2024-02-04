import { create } from "zustand";

const usePostStore = create((set) => ({
  openPost: false,

  postId: null,

  setOpenPost: (value) => set((state) => ({ openPost: value })),

  setPostId: (value) => set((state) => ({ postId: value })),
}));

export default usePostStore;
