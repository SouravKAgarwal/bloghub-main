import { create } from "zustand";

const useCommentStore = create((set) => ({
  openComment: false,

  commentId: null,

  setOpen: (value) => set((state) => ({ openComment: value })),

  setCommentId: (value) => set((state) => ({ commentId: value })),
}));

export default useCommentStore;
