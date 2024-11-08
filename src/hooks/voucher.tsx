import { create } from "zustand";
import { IVoucherSession } from "../types/voucher";

interface IChoosenVoucher {
  voucher: IVoucherSession | undefined;
  chooseVoucher: (arg: IVoucherSession | undefined) => void;
}

export const useStoreVoucher = create<IChoosenVoucher>((set) => ({
  voucher: undefined,
  chooseVoucher: (voucher) => {
    set({ voucher });
  },
}));
