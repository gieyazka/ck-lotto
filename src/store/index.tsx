import { create } from "zustand";
import { loadingStore } from "../utils/type";

interface BearState {
  bears: number;
  increase: (by: number) => void;
}

const useLoading = create<loadingStore>()((set) => ({
  isLoad: false,
  setLoad: (loading) => set((state) => ({ isLoad: loading })),
}));
// const useAlert = create<callToast>()((set) => ({
//   bears: 0,
//   increase: (by) => set((state) => ({ bears: state.bears + by })),
// }));

export { useLoading };
