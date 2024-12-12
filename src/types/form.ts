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
  createdDate: dayjs.Dayjs;
  startDate: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
  name: string;
  minValue: number;
  discountAmount: number | null;
  discountPercentage: number | null;
  voucherType: number;
  code: string;
}
export interface ICreateVoucher extends Omit<IFormVoucher, 'createdDate' | 'startDate' | 'endDate'> {
  createdDate: string;
  startDate: string;
  endDate: string;
}
