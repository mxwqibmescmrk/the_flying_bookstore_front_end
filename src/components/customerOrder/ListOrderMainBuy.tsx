"use client";
import {
  Box,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import CustomTabPanel, { orderProps } from "../order/CustomTabPanel";
import {  IBuyOrder, OrderType } from "../../types/order";
import { useAuthStore } from "../../hooks/user";
import { useStoreAlert } from "../../hooks/alert";
import { useRouter } from "next/navigation";
import { getOrderWithStatusService } from "../../api/order";
import useApiCall from "../../hooks/useApiCall";
import { getSaleOrderBySeller } from "../../api/orderBuy";
import ListOrderBuy from "../orderBuy/ListOrderBuy";

const arrSame: Array<{ label: string }> = [
  { label: "Tất cả" },
  { label: "Đã đặt hàng" },
  { label: "Đã nhận" },
]

const arrStatusBuySell: Array<{ label: string }> = [
  ...arrSame,
  { label: "Đã hủy" },
];

const ListOrderMainBuy = ({ orderType }: { orderType: OrderType }) => {
  const [status, setStatus] = useState(0);
  const { profile } = useAuthStore();
  const { callAlert,  } = useStoreAlert();
  const [listOrder, setListOrder] = useState<Array<IBuyOrder>>();
  const { handleApiCall, loading } = useApiCall<IBuyOrder[]>();  // Sử dụng hook
  const router = useRouter();

  const handleChange = (_: any, newValue: number) => {
    setStatus(newValue);
  }
  const callApiGetAllOrder = useCallback(async () => {
    const isCustomer = orderType === OrderType.Buy;
    if (!profile?.id) {
      callAlert("Mời bạn đăng nhập lại!");
      return router.push("/");
    }
    return await handleApiCall(
      () => getSaleOrderBySeller(profile?.id, isCustomer),
      (response) => {
        setListOrder(response)
      },
      "Lấy đơn hàng thành công"
    )
  }, [orderType, profile?.id, handleApiCall, callAlert, router]);

  const getOrderWithStatus = useCallback(async (status: number) => {
    const isCustomer = orderType === OrderType.Leasee;
    return await handleApiCall(
      () => getOrderWithStatusService(status, profile, isCustomer),
      (response) => {
        setListOrder(response); 
      },
      "Lấy đơn hàng thành công"
    );
  }, [handleApiCall, orderType, profile]);
  const callWhichApi = useCallback(async () => {
    switch (status) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        return await getOrderWithStatus(status);
      case 0:
        return await callApiGetAllOrder();
      default:
        return callAlert("Cần thêm status mới");
    }
  }, [status, getOrderWithStatus, callApiGetAllOrder, callAlert]);
  const reloadButton = async () => {
    return await callWhichApi().then(() => {
      callAlert("Đã tải lại thành công");
    });
  };
  const reloadStatus = async (_: any, newValue: number) => {
    setStatus(newValue);
    return await callWhichApi();
  };
  useEffect(() => {
    callWhichApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const renderSectionTab = () => {
    return arrStatusBuySell.map((_, index) => {
      return (
        <CustomTabPanel value={status} index={index} key={index}>
          <ListOrderBuy orderType={orderType} listOrder={listOrder} loading={loading} reloadButton={reloadButton} reloadStatus={reloadStatus} />
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
