import { create } from "zustand";
import { IVoucherSession } from "../types/voucher";

interface IChoosenVoucher {
  voucher: IVoucherSession | undefined;
  voucherShop: IVoucherSession | undefined;
  chooseVoucher: (arg: IVoucherSession | undefined) => void;
  chooseVoucherShop: (arg: IVoucherSession | undefined) => void;
}

export const useStoreVoucher = create<IChoosenVoucher>((set) => ({
  voucher: undefined,
  voucherShop:undefined,
  chooseVoucher: (voucher) => {
    set({ voucher });
  },
  chooseVoucherShop: (voucherShop) => {
    set({ voucherShop });
  },
}));
