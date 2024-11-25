import dayjs, { Dayjs } from "dayjs";


export type IFormCheckout = {
  lastName: string;
  firstName: string;
  email: string;
  phoneNumber: string;
  address: string;
  birthDate: Dayjs|null;
};
export interface IFormVoucher {
  name: string;
  createdDate: dayjs.Dayjs;
  startDate: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
  minValue: number;
  discountAmount: number | null;
  discountPercentage: number | null;
  voucherType: number;
  code: string;
}