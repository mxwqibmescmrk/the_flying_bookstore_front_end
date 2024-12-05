"use client";
import {
  Alert,
  Button,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { formatCurrency } from "../../utils/helps";
import { IBuyOrderConvert, IOrderStatusBuy, OrderType } from "../../types/order";
import { useStoreAlert } from "../../hooks/alert";
import { CiTrash } from "react-icons/ci";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { callContentAlertBuy } from "../order/contentAlert";
import { useAuthStore } from "../../hooks/user";
import { updateStatusSaleOrder } from "../../api/order";
import CancelModal from "../order/CancelModal";
import CancelModalBuy from "./CancelModalBuy";
dayjs.extend(localizedFormat);
//tiếng việt
require("dayjs/locale/vi");
dayjs.locale("vi"); // use locale globally
dayjs.extend(relativeTime);

const OrderFooterBuy = ({
  order,
  changeStatus,
  orderType,
  reloadButton
}: {
  orderType?: OrderType;
  reloadButton: () => Promise<void>;
  order: IBuyOrderConvert;
  changeStatus: (e: any, newValue: number) => void;
}) => {

  const [cancelModal, setCancelModal] = useState({
    open: false,
    order,
  });
  const { token, profile } = useAuthStore()
  const { callAlert } = useStoreAlert();

  const renderAlert = () => {
    if (!order?.status) return <></>;
    const content = callContentAlertBuy(order);
    if (orderType == OrderType.Buy) {
      if (
        !content?.isBuyer[order?.status] ||
        content?.isBuyer[order?.status] == ""
      ) {
        return <></>;
      }
      return (
        <Alert variant="standard" color="info">
          {content?.isBuyer[order?.status]}
        </Alert>
      );
    } else if (orderType == OrderType.Sell) {
      if (
        !content?.isSeller[order?.status] ||
        content?.isSeller[order?.status] == ""
      ) {
        return <></>;
      }
      return (
        <Alert variant="standard" color="info">
          {content?.isSeller[order?.status]}
        </Alert>
      );
    }
  };

  const callUpdateStatus = async (
    statusMessage: IOrderStatusBuy,
    status: number,
    alertMessage: string
  ): Promise<void> => {
    if (!order?.id || !token) return;
    return await updateStatusSaleOrder(statusMessage, order?.id, token).then(
      () => {
        callAlert(`${alertMessage} thành công`);
        changeStatus(null, status);
      }
    );
  };


  const cancelButton = (
    <IconButton
      color="error"
      aria-label="delete"
      onClick={() => setCancelModal((state) => ({ ...state, open: true }))}
    >
      <CiTrash />
    </IconButton>
  );
  const renderButton = () => {
    if (orderType !== OrderType.Buy) return;
    let message = "";
    switch (order?.status) {
      case "PAYMENT_SUCCESS":
        message = `Đã nhận được sách`;
        return (
          <Button
            variant="contained"
            sx={{ textTransform: "capitalize", mr: 1 }}
            onClick={() => callUpdateStatus("DELIVERED", 2, message)}
          >
            {message}
          </Button>
        );
      case "ORDERED_PAYMENT_PENDING":
        if (order?.paymentMethod == "COD") return cancelButton;
        message = `Đã trả tiền`;
        return (
          <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
            <Button
              variant="contained"
              sx={{ textTransform: "capitalize", mr: 1 }}
              onClick={() => callUpdateStatus("PAYMENT_SUCCESS", 1, message)}
            >
              {message}
            </Button>
            {cancelButton}
          </Stack>
        );

      default:
        break;
    }
  };
  return (
    <>
      <Grid
        container
        spacing={2}
        mt={1}
        justifyItems="center"
        alignItems="center"
      >
        <Grid item xs={6} mb={1}>
          {renderAlert()}
        </Grid>
        <Grid item xs={3} mb={1}>
          {renderButton()}
        </Grid>

        <Grid item xs={3} sx={{ textAlign: "right" }}>
          <Typography variant="body2" color={"gray"}>
            Giá bán: {formatCurrency(order?.totalPrice)}
          </Typography>
          <Typography variant="body1">
            Tổng tiền: {formatCurrency(order?.totalPrice)}
          </Typography>
        </Grid>
      </Grid>
      <CancelModalBuy
        cancelModal={cancelModal}
        setCancelModal={setCancelModal}
        callUpdateStatus={callUpdateStatus}
      />
    </>
  );
};

export default OrderFooterBuy;
