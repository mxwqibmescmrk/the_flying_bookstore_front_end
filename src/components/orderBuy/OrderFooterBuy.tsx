"use client";
import {
  Alert,
  Box,
  Button,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import RateModel from "../order/RateModel";
import { useState } from "react";
import { formatCurrency } from "../../utils/helps";
import { IBuyOrderConvert, IChangeToBuyOrder, IOrderStatus, IRentOrder, OrderType } from "../../types/order";
import { changeToBuyOrder, updateStatusOrder } from "../../api/order";
import { useStoreAlert } from "../../hooks/alert";
import { CiTrash } from "react-icons/ci";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";
import CancelModal from "../order/CancelModal";
import { callContentAlert, callContentAlertBuy } from "../order/contentAlert";
import { useAuthStore } from "../../hooks/user";
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
    if (orderType == OrderType.Leasor) {
      if (
        !content?.isCustomer[order?.status] ||
        content?.isCustomer[order?.status] == ""
      ) {
        return <></>;
      }
      return (
        <Alert variant="standard" color="info">
          {content?.isCustomer[order?.status]}
        </Alert>
      );
    } else {
      if (
        !content?.isManager[order?.status] ||
        content?.isManager[order?.status] == ""
      ) {
        return <></>;
      }
      return (
        <Alert variant="standard" color="info">
          {content?.isManager[order?.status]}
        </Alert>
      );
    }
  };

  const callUpdateStatus = async (
    statusMessage: IOrderStatus,
    status: number,
    alertMessage: string
  ): Promise<void> => {
    if (!order?.id || !token) return;
    return await updateStatusOrder(statusMessage, order?.id, token).then(
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
    let message = "";
    if (orderType == OrderType.Leasor) {
      switch (order?.status) {
        case "RETURNING":
          message = `Đã nhận lại sách`;
          return (
            <Button
              variant="contained" sx={{ textTransform: "capitalize" }}
              onClick={() => callUpdateStatus("RETURNED", 4, message)}
            >
              {message}
            </Button>
          );
        default:
        // return <></>;
      }
    }
    switch (order?.status) {
      case "PAYMENT_SUCCESS":
        message = `Đã nhận được sách`;
        return (
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Button
              variant="contained"
              sx={{ textTransform: "capitalize", mr: 1 }}
              onClick={() => callUpdateStatus("DELIVERED", 2, message)}
            >
              {message}
            </Button>
          </Stack>
        );
      case "ORDERED_PAYMENT_PENDING":
        if (order?.paymentMethod == "COD") return cancelButton;
        message = `Đã trả tiền`;
        return (
          <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
            <Button
              variant="contained"
              sx={{ textTransform: "capitalize", mr: 1 }}
              onClick={() => callUpdateStatus("USER_PAID", 1, message)}
            >
              {message}
            </Button>
            {cancelButton}
          </Stack>
        );
      case "DELIVERED":
        message = `Đã trả sách`;
        return (
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Button
              variant="contained"
              sx={{ textTransform: "capitalize", mr: 1 }}
              onClick={() => callUpdateStatus("RETURNING", 2, message)}
            >
              {message}
            </Button>
          </Stack>
        );

      case "LATE_RETURN":
        message = `Đã trả sách`;
        return (
          <>
            <Button
              variant="contained" sx={{ textTransform: "capitalize" }}
              onClick={() => callUpdateStatus("RETURNING", 2, message)}
            >
              {message}
            </Button>
          </>
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
    </>
  );
};

export default OrderFooterBuy;
