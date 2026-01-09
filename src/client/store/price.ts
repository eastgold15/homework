import { create } from "zustand";

// 定义一个接口，用于描述状态管理器的状态和操作
interface PriceStore {
  price: number;
  incrementPrice: () => void;
  decrementPrice: () => void;
  resetPrice: () => void;
  getPrice: () => number;
}

const usePriceStore = create<PriceStore>((set, get) => ({
  price: 0,
  incrementPrice: () => set((state) => ({ price: state.price + 1 })),
  decrementPrice: () => set((state) => ({ price: state.price - 1 })),
  resetPrice: () => set({ price: 0 }),
  getPrice: () => get().price,
}));

export default usePriceStore;
