import { StateCreator, create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface IOrder {
  rentOrderId: number | null;
  buyOrderId: number | null;
  updateRentOrder: (arg: number | null) => void;
  updateBuyOrder: (arg: number | null) => void;
  removeOrder: () =>void;
}

const orderSlice: StateCreator<IOrder, [["zustand/persist", unknown]]> = (
  set
) => ({
  rentOrderId: null,
  buyOrderId:null,
  updateRentOrder: (newOrderId) => {
    set({ rentOrderId: newOrderId });
  },
  updateBuyOrder: (newOrderId) => {
    set({ buyOrderId: newOrderId });
  },
  removeOrder: () => set({rentOrderId:null, buyOrderId:null})
});
export const useStoreOrder = create<IOrder>()(
  persist(orderSlice, {
    name: "order-storage", // name of the item in the storage (must be unique)
    storage: createJSONStorage(() => localStorage),
  })
);
