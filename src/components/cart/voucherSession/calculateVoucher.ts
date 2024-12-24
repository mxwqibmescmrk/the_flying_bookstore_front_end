import dayjs from "dayjs";
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
const today = dayjs();

function sortVouchersByPriority(vouchers: IVoucherSession[], book: IListing | undefined): IVoucherSession[] {
  return vouchers
    .sort((a, b) => {
      const discountA = countDiscount(book, a);
      const discountB = countDiscount(book, b);
      const aStartDate = dayjs(a.startDate);
      const aEndDate = dayjs(a.endDate);
      const bStartDate = dayjs(b.startDate);
      const bEndDate = dayjs(b.endDate);

      const isAExpired = today.isAfter(aStartDate) && today.isBefore(aEndDate.add(1, "day"));
      const isANotExpired = !isAExpired;
      const isBExpired = today.isAfter(bStartDate) && today.isBefore(bEndDate.add(1, "day"));
      const isBNotExpired = !isBExpired;

      //  Ưu tiên voucher chưa hết hạn
      if (isAExpired && isBNotExpired) {
        return -1;
      }
      if (isANotExpired && isBExpired) {
        return 1;
      }

      // Ưu tiên giảm giá cao hơn
      return discountB - discountA;

      return 0; // Giữ nguyên thứ tự nếu các tiêu chí đều giống nhau
    });
}
const isValidVoucher = (voucher: IVoucherSession, price?: number) => {
  const startDate = dayjs(voucher.startDate);
  const endDate = dayjs(voucher.endDate);

  if (voucher?.minValue && price && price < voucher?.minValue) {
    return false;
  }
  return today.isAfter(startDate) && today.isBefore(endDate.add(1, "day"));
}
const calculateTotalPriceAfterVoucher = (book: IListing | undefined, voucher: IVoucherSession | undefined, voucherShop: IVoucherSession | undefined): number => {
  if (book == undefined) return 0;

  let price = (book?.price || 1)
  let discount = countDiscount(book, voucher);
  let discountShop = countDiscount(book, voucherShop);

  // Tính tổng tiền sau khi áp dụng voucher, đảm bảo không âm
  const totalPrice = Math.max(price - discount - discountShop, 0);

  return totalPrice;
}
export { countDiscount, sortVouchersByPriority, isValidVoucher, calculateTotalPriceAfterVoucher }