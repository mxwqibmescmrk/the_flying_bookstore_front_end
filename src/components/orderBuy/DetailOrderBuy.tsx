import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { IBuyOrderConvert, OrderType } from "../../types/order";
import theme from "../../utils/theme";
import NoData from "../order/NoData";
import { columnsOrderSellBuy } from "../order/column";
import { HeaderOrderBuy } from "./HeaderOrderBuy";
import OrderFooterBuy from "./OrderFooterBuy";

const DetailOrderBuy = ({
  order,
  changeStatus,
  orderType,
  reloadButton
}: {
  reloadButton: () => Promise<void>;
  order: IBuyOrderConvert;
  orderType: OrderType;
  changeStatus: (e: any, newValue: number) => void;
}) => {

  if (!order) return <>Hiện chưa có đơn hàng</>;
  return (
    <Box
      sx={{
        width: "100%",
        border: 1,
        borderRadius: 3,
        borderColor: theme.palette.grey[400],
        px: 2,
        py: 1,
        height: Array.isArray(order?.listing)  && order?.listing.length > 0 ? "auto" : "500px",
      }}
    >
      <HeaderOrderBuy order={order} orderType={orderType} />
      <DataGrid
        rows={Array.isArray(order?.listing) && order.listing.length > 0 ? order.listing : []}
        columns={columnsOrderSellBuy}
        disableRowSelectionOnClick
        slots={{ noRowsOverlay: NoData }}
        sx={{ border: "none" }}
        hideFooterPagination
        hideFooterSelectedRowCount
        hideFooter
      />
      <OrderFooterBuy reloadButton={reloadButton} changeStatus={changeStatus} order={order} orderType={orderType} />
    </Box>
  );
};

export default DetailOrderBuy;
