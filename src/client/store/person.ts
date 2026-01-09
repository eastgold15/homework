import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface User {
  gourd: {
    oneChild: string;
    twoChild: string;
    threeChild: string;
    fourChild: string;
    fiveChild: string;
    sixChild: string;
    sevenChild: string;
  };
  updateGourd: () => void;
}

// 注意：使用 immer 中间件时的特殊结构
export const useUserStore = create<User>()(
  immer((set) => ({
    gourd: {
      oneChild: "大娃",
      twoChild: "二娃",
      threeChild: "三娃",
      fourChild: "四娃",
      fiveChild: "五娃",
      sixChild: "六娃",
      sevenChild: "七娃",
    },
    updateGourd: () =>
      set((state) => {
        // 直接修改状态，无需手动合并
        state.gourd.oneChild = "大娃-超进化";
        state.gourd.twoChild = "二娃-谁来了";
        state.gourd.threeChild = "三娃-我来了";
      }),
  }))
);
