import { IOrderStatus, IOrderStatusBuy, IPaymentMethod, OrderType } from "../../types/order";
export type IOrderStatusBuyMessage = {
  isBuyer: {
    [key in IOrderStatusBuy]?: string;
  };
  isSeller: {
    [key in IOrderStatusBuy]?: string;
  };
};
export type IOrderStatusMessage = {
  isCustomer: {
    [key in IOrderStatus]?: string;
  };
  isManager: {
    [key in IOrderStatus]?: string;
  };
};

const contentBuy: IOrderStatusBuyMessage = {
  isBuyer: {
    ORDERED_PAYMENT_PENDING: `Chờ khách thanh toán`,
    PAYMENT_SUCCESS: `Chờ khách lấy hàng`,
    DELIVERED: `Chủ sách đã đưa hàng`,
    CANCELED: `Khách đã hủy`,
    PAID_BUYER: `Đã trả tiền thừa cho người mua`,
    PAID_SELLER: `Đã trả tiền cho người bán`
  },
  isSeller: {
    ORDERED_PAYMENT_PENDING: `Chờ thanh toán`,
    PAYMENT_SUCCESS: `Lấy hàng`,
    CANCELED: `Khách đã hủy`,
    DELIVERED: `Đã lấy hàng`,
    PAID_BUYER: `Đã trả tiền thừa cho người mua`,
    PAID_SELLER: `Đã trả tiền cho người bán`
  },
};
const content: IOrderStatusMessage = {
  isCustomer: {
    ORDERED_PAYMENT_PENDING: `Chờ khách thanh toán`,
    PAYMENT_SUCCESS: `Chờ khách lấy hàng`,
    DELIVERED: `Chủ sách đã đưa hàng`,
    CANCELED: `Khách đã hủy`,
    USER_PAID: `Chờ admin duyệt thanh toán`,
    RETURNING: `Chủ sách chờ nhận sách`,
    RETURNED: `Chủ sách đã lấy lại sách`,
    LATE_RETURN: `Khách trả trễ`,
    DEPOSIT_RETURNED: `Admin đã trả tiền cọc cho người thuê`,
    PAID_OWNER: `Đã trả tiền thuê`
  },
  isManager: {
    ORDERED_PAYMENT_PENDING: `Chờ thanh toán`,
    USER_PAID: `Chờ admin duyệt thanh toán`,
    PAYMENT_SUCCESS: `Lấy hàng`,
    CANCELED: `Khách đã hủy`,
    DELIVERED: `Đã lấy hàng`,
    RETURNING: `Chờ chủ sách nhận sách`,
    RETURNED: `Đã trả sách`,
    DEPOSIT_RETURNED: `Admin đã trả tiền cọc`,
    PAID_OWNER: `Admin đã trả tiền đầy đủ`,
    LATE_RETURN: `Trả trễ`,
  },
};

const renderStatusBuy = (
  status?: IOrderStatusBuy | undefined,
  orderType?: OrderType
) => {
  if (!status) return <></>;
  if (orderType == OrderType.Buy && contentBuy.isBuyer[status]) {
    return contentBuy.isBuyer[status];
  }
  if (contentBuy.isSeller[status]) return contentBuy.isSeller[status];
  return <>Chưa định nghĩa</>;
};
const renderStatus = (
  status?: IOrderStatus | undefined,
  orderType?: OrderType
) => {
  if (!status) return <></>;
  if (orderType == OrderType.Leasor && content.isCustomer[status]) {
    return content.isCustomer[status];
  }
  if (content.isManager[status]) return content.isManager[status];
  return <>Chưa định nghĩa</>;
};
const renderPayment = (method?: IPaymentMethod | undefined) => {
  if (!method) return <></>;
  switch (method) {
    case "BANK_TRANSFER":
      return <>Chuyển khoản</>;
    case "COD":
      return <>COD</>;
    case "VNPAY":
      return <>VnPay</>;
    default:
      return <>Lỗi tí</>;
  }
};
export { renderPayment, renderStatus, renderStatusBuy };
