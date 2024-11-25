import { IRowBuy } from "../components/order/column";
import { IListing, IReview } from "./book";
import { IUser } from "./user";
export enum OrderType {
  Buy = "mua",
  Sell = "bán",
  Leasor = "cho thuê",
  Leasee = "thuê",
}

interface ILeaseOrderDetail {
  id: number;
  listingId: number;
  leaseRate: number;
  depositFee: number;
  penaltyRate: number;
  title: string;
}
export interface IChangeToBuyOrder {
  LeaseOrderId: string;
  listingId: number;
  buyerAddress: string;
  paymentMethod: IPaymentMethod;
}
export type IOrderStatus =
  | "ORDERED_PAYMENT_PENDING"
  | "CANCELED"
  | "PAYMENT_SUCCESS"
  | "DELIVERED"
  | "LATE_RETURN"
  | "RETURNING"
  | "RETURNED"
  | "DEPOSIT_RETURNED"
  | "USER_PAID"
  | "PAID_OWNER"
  | "DEPOSIT_RETURNED";
export type IPaymentMethod = "COD" | "BANK_TRANSFER" | "VNPAY";

export interface IBuyOrderConvert {
  id?: number;
  listing?: IRowBuy[] | undefined;
  status?: IOrderStatus;
  seller?: IUser;
  buyer?: IUser;
  sellerAddress?: string;
  buyerAddress?: string;
  receiveDate?: string | null;
  totalPrice?: number;
  totalChange?: number;
  totalCompensate?: number;
  totalPenaltyRate?: number | null;
  paymentMethod?: IPaymentMethod;
  sellPaymentId?: number;
  changePaymentId?: number;
  compensatePaymentId?: number | null;
  createdDate?: string;
}

export interface IBuyOrder {
  id?: number;
  listingId?: number;
  status?: IOrderStatus;
  sellerId?: number;
  buyerId?: number;
  sellerAddress?: string;
  buyerAddress?: string;
  receiveDate?: string | null;
  totalPrice?: number;
  totalChange?: number;
  totalCompensate?: number;
  totalPenaltyRate?: number | null;
  paymentMethod?: IPaymentMethod;
  sellPaymentId?: number;
  changePaymentId?: number;
  compensatePaymentId?: number | null;
  createdDate?: string;
}

export interface IRentOrder {
  leaseOrder?: ILeaseOrder;
  listing?: IListing;
  lessor?: IUser;
  lessee?: IUser;
  totalPenaltyFee?: number;
}

interface ILeaseOrder {
  id: number;
  listingId: number;
  status: IOrderStatus;
  lessorId: number;
  lesseeId: number;
  lessorAddress: string;
  lesseeAddress: string;
  fromDate: string;
  toDate: string;
  receiveDate: null;
  returnDate: null;
  totalLeaseFee: number;
  totalPenaltyRate: number;
  totalDeposit: number;
  paymentMethod: IPaymentMethod;
  imageLink: null;
  leaseAndDepositPaymentId: number;
  refundDepositPaymentId: null;
  payOwnerPaymentId: null;
  createdDate: string;
  updatedDate: null;
  deletedDate: null;
  leaseOrderDetails: ILeaseOrderDetail[];
  reviews: IReview[];
}
export const orderUserTitles: Record<OrderType, string> = {
  [OrderType.Buy]: "Người mua",
  [OrderType.Sell]: "Người bán",
  [OrderType.Leasee]: "Người thuê",
  [OrderType.Leasor]: "Chủ sách",
};
export const orderStakeholderTitles: Record<OrderType, string> = {
  [OrderType.Buy]: orderUserTitles[OrderType.Sell],
  [OrderType.Sell]: orderUserTitles[OrderType.Buy],
  [OrderType.Leasee]: orderUserTitles[OrderType.Leasor],
  [OrderType.Leasor]: orderUserTitles[OrderType.Leasee],
};