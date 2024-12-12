import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@mui/material";
import React from "react";
import { useStoreAlert } from "../../hooks/alert";
import { IVoucherSession } from "../../types/voucher";
import { deleteVoucherShop } from "../../api/voucher/voucherShop";
import { Transition } from "../managerPost/DeletePostModal";

const DeleteVoucherModal = ({
  modalDelete,
  handleClose,
  getVoucherList
}: {
  modalDelete: {
    open: boolean;
    data: IVoucherSession | null;
  };
  getVoucherList: () => Promise<void>;
  handleClose: () => void;
}) => {
  const { callAlert, callErrorAlert } = useStoreAlert();
  const onDelete = async () => {
    const data = await deleteVoucherShop(modalDelete.data?.id);
    if (data?.status == 204) {
      console.log(JSON.stringify(data));
      callAlert(`Xóa voucher #${modalDelete.data?.id} thành công`);
      handleClose();
      getVoucherList();
    } else if (typeof data == "string") {
      callErrorAlert(data)
    } else {
      callErrorAlert("Không xóa được")

    }
  };
  return (
    <Dialog
      open={modalDelete.open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>
        Bạn có muốn xóa voucher {modalDelete.data?.name} không?
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Sau khi xóa sẽ không thể hồi phục được.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Hủy</Button>
        <Button onClick={onDelete}>Đồng ý</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteVoucherModal;
