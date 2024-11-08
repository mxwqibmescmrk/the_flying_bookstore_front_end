import { IListing } from "../../../types/book";
import { IVoucherSession } from "../../../types/voucher";

const countDiscount = (book: IListing | undefined, voucher: IVoucherSession | undefined): number => {
  if (voucher == undefined) return 0;
  let discount = 0;
  let price = (book?.price || 1)
  // Tính toán giảm giá dựa trên loại voucher
  if (voucher.voucherType === 0 && voucher.discountAmount) {
    // Voucher dạng giảm theo số tiền
    discount = voucher.discountAmount;
  } else if (voucher.voucherType === 1 && voucher.discountPercentage) {
    // Voucher dạng giảm theo phần trăm
    discount = (price * voucher.discountPercentage) / 100;
  }
  return discount;
}
export { countDiscount }