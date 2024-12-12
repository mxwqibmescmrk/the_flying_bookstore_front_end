export interface IVoucherSession {
  id?: number;
  name: string;
  code: string; // Add code field
  createdDate?: Date;
  startDate: Date;
  endDate: Date;
  minValue?: number;
  discountAmount?: number;
  discountPercentage?: number;
  voucherType: 0 | 1; // 0 for discountAmount value, 1 for discountPercentage
}
