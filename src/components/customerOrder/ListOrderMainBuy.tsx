"use client";
import {
  Box,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import CustomTabPanel, { orderProps } from "../order/CustomTabPanel";
import { IBuyOrderConvert, IOrderStatusBuy, OrderType } from "../../types/order";
import { useAuthStore } from "../../hooks/user";
import { useStoreAlert } from "../../hooks/alert";
import { useRouter } from "next/navigation";
import { getOrderWithStatusService } from "../../api/order";
import useApiCall from "../../hooks/useApiCall";
import { getSaleOrderBySeller } from "../../api/orderBuy";
import ListOrderBuy from "../orderBuy/ListOrderBuy";
import { scrollToTop } from "../scrollButton/ScrollButton";

const arrSame: Array<{ label: string }> = [
  { label: "Tất cả" },
  { label: "Đã đặt hàng" },
  { label: "Đã nhận" },
]

const arrStatusBuySell: Array<{ label: string }> = [
  ...arrSame,
  { label: "Đã hủy" },
];
const orderStatus: { [key in IOrderStatusBuy]?: number } = {
  ORDERED_PAYMENT_PENDING: 1,
  CANCELED: 3,
  DELIVERED: 2,
  PAID_BUYER: 2,
  PAID_SELLER: 2,
  PAYMENT_SUCCESS: 1
}


const ListOrderMainBuy = ({ orderType }: { orderType: OrderType }) => {
  const [status, setStatus] = useState(0);
  const { profile } = useAuthStore();
  const { callAlert, callErrorAlert } = useStoreAlert();
  const [listOrder, setListOrder] = useState<Array<IBuyOrderConvert>>();
  const router = useRouter();

  const handleChange = (_: any, newValue: number) => {
    setStatus(newValue);
    scrollToTop();
  }
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const filterOrder = (orderList:IBuyOrderConvert[]) => {
    const newListOrder = orderList?.filter(order => {
      if(status == 0) return true;
      if (order?.status !== undefined) {
        console.log("orderStatus[order.status]", orderStatus[order.status]);
        console.log("order.status", order.status);
        return orderStatus[order.status] === status;
      }
      return false;
    })
    return newListOrder
  }

  const callApiGetAllOrder = useCallback(async () => {
    const isCustomer = orderType === OrderType.Buy;
    if (!profile?.id) {
      callErrorAlert("Mời bạn đăng nhập lại!");
      return router.push("/");
    }
    try {
      const response = await getSaleOrderBySeller(profile?.id, isCustomer);
      if (typeof response !== "string") {
        const newListOrder: IBuyOrderConvert[] = response;
        setListOrder(filterOrder(newListOrder));
        callAlert("Lấy đơn hàng thành công");
      } else {
        callErrorAlert(response);
      }
    } catch (error) {
      console.error(error);
    }
  }, [orderType, profile?.id, callErrorAlert, router, filterOrder, callAlert]);

  const reloadButton = async () => {
    return await callApiGetAllOrder().then(() => {
      callAlert("Đã tải lại thành công");
    });
  };
  const reloadStatus = async (_: any, newValue: number) => {
    setStatus(newValue);
    return await callApiGetAllOrder();
  };
  useEffect(() => {
    callApiGetAllOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const renderSectionTab = () => {
    return arrStatusBuySell.map((_, index) => {
      return (
        <CustomTabPanel value={status} index={index} key={index}>
          <ListOrderBuy orderType={orderType} listOrder={listOrder} reloadButton={reloadButton} reloadStatus={reloadStatus} />
        </CustomTabPanel>
      );
    });
  };
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Quản lý đơn {orderType}
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={status} onChange={handleChange} aria-label="order tab">
          {arrStatusBuySell.map(({ label }, index) => {
            return <Tab label={label} {...orderProps(index)} key={index} />;
          })}
        </Tabs>
      </Box>
      {renderSectionTab()}
    </>
  );
};
export default ListOrderMainBuy;
