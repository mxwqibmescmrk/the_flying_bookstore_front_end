import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { IBuyOrder, OrderType } from "../../types/order";
import { useEffect, useState } from "react";
import theme from "../../utils/theme";
import { useStoreStep } from "../../hooks/step";
import { HeaderOrder } from "../order/HeaderOrder";
import OrderFooter from "../order/OrderFooter";
import NoData from "../order/NoData";
import { columnsOrderSellBuy, convertToRow, IRow, IRowBuy } from "../order/column";
import { useStoreAlert } from "../../hooks/alert";
import { getBookDetailService } from "../../api/bookListService";
import { IListing } from "../../types/book";
import dayjs from "dayjs";

const DetailOrderBuy = ({
  order,
  changeStatus,
  orderType,
  reloadButton
}: {
  reloadButton: () => Promise<void>;
  order: IBuyOrder;
  orderType: OrderType;
  changeStatus: (e: any, newValue: number) => void;
}) => {
  const [listBook, setlistBook] = useState<IRowBuy[]>();
  const { callErrorAlert } = useStoreAlert()

  useEffect(() => {
    const makeRequest = async () => {
      if (!order || !order?.listingId) return;
      const response: IListing | string = await getBookDetailService(order?.listingId.toString());
      if (typeof response !== 'string') {
        setlistBook([{
          id: response.id,
          title: response.book.title,
          createdDate: order?.createdDate || dayjs().format("DD/MM/YYYY"),
          deposit: response.depositFee,
          price: order?.totalPrice || 0,
          total: order?.totalChange || 0,
        }])
      } else {
        callErrorAlert(response);
      }
    }

    makeRequest();
  }, [callErrorAlert, order])

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
        height: typeof listBook == "object" && listBook.length > 0 ? "auto" : "500px",
      }}
    >
      <HeaderOrder order={order} orderType={orderType} />
      <DataGrid
        rows={Array.isArray(listBook) && listBook.length > 0 ? listBook : []}
        columns={columnsOrderSellBuy}
        disableRowSelectionOnClick
        slots={{ noRowsOverlay: NoData }}
        sx={{ border: "none" }}
        hideFooterPagination
        hideFooterSelectedRowCount
        hideFooter
      />
      {/* <OrderFooter reloadButton={reloadButton} changeStatus={changeStatus} order={order} orderType={orderType} /> */}
    </Box>
  );
};

export default DetailOrderBuy;
