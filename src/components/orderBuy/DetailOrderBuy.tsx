import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {  IBuyOrder, OrderType } from "../../types/order";
import { useState } from "react";
import theme from "../../utils/theme";
import { useStoreStep } from "../../hooks/step";
import { HeaderOrder } from "../order/HeaderOrder";
import OrderFooter from "../order/OrderFooter";
import NoData from "../order/NoData";
import { columnsOrderSellBuy, convertToRow, IRow } from "../order/column";

const DetailOrderBuy = ({
  order,
  changeStatus,
  orderType,
  reloadButton
}: {
  reloadButton:()=> Promise<void>;
  order: IBuyOrder;
  orderType: OrderType;
  changeStatus: (e: any, newValue: number) => void;
}) => {
  const { tabNum } = useStoreStep()
  // const [listBook, setlistBook] = useState<IRow[]>(order);

  if (!order) return <>Hiện chưa có đơn hàng</>;
 return <></>
};

export default DetailOrderBuy;
