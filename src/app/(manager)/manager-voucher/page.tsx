"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Box, Button, Stack, Tab, Tabs, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import NoData from "@/components/order/NoData";

import DeletePostModal from "@/components/managerPost/DeletePostModal";
import { useAuthStore } from "@/hooks/user";
import { getListPostService } from "@/api/managerPostService";
import CustomTabPanel from "../../../components/order/CustomTabPanel";
import { a11yProps } from "../../../utils/helps";
import { useStoreStep } from "../../../hooks/step";
import { useStoreAlert } from "../../../hooks/alert";
import { getVoucherShop } from "../../../api/voucher/voucherShop";
import { IVoucherSession } from "../../../types/voucher";
import { columnsVoucher } from "../../../components/voucher/column";

const ManagerVoucher = () => {
  const [modalDelete, setModalDelete] = useState<{
    open: boolean;
    data: IVoucherSession | null;
  }>({
    open: false,
    data: null,
  });
  const [tabPost, setTabPost] = useState(0)
  const { profile } = useAuthStore()
  const [listVoucher, setListVoucher] = useState<{
    all: IVoucherSession[],
    percent: IVoucherSession[],
    money: IVoucherSession[]
  }>({
    all: [],
    percent: [],
    money: []
  })
  const { callErrorAlert } = useStoreAlert()

  const handleClickOpen = (data: IVoucherSession) => {
    setModalDelete({ open: true, data });
  };

  const handleChangeTabPost: (event: React.SyntheticEvent, newValue: number) => void = (event, newValue) => {
    setTabPost(newValue);
  };

  const handleClose = () => {
    setModalDelete((state) => ({ ...state, open: false }));
  };

  const getListPost = useCallback(async (): Promise<void> => {
    return await getVoucherShop()
      .then((response) => {
        if (typeof response != "string") {
          const newListVoucher:IVoucherSession[] = response;
          setListVoucher({
            all: newListVoucher,
            money: newListVoucher.filter(item => item.voucherType==0),
            percent: newListVoucher.filter(item => item.voucherType==1)
          });
        }
      })
      .catch((error) => {
        callErrorAlert(error);
      });
  }, [callErrorAlert]);

  useEffect(() => {
    getListPost();
  }, [getListPost]);

  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h4" gutterBottom>
          Quản lý voucher của tôi
        </Typography>
        <Link href="/manager-voucher/add-voucher">
          <Button variant="contained">Thêm voucher</Button>
        </Link>
      </Stack>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabPost} onChange={handleChangeTabPost} aria-label="manage post">
          <Tab value={0} label="Tất cả Voucher" {...a11yProps(0)} sx={{ textTransform: "none" }} />
          <Tab value={1} label="Voucher theo giá tiền" {...a11yProps(1)} sx={{ textTransform: "none" }} />
          <Tab value={2} label="Voucher theo phần trăm" {...a11yProps(2)} sx={{ textTransform: "none" }} />
        </Tabs>
      </Box>
      <CustomTabPanel value={tabPost} index={0}>
        <Box sx={{ width: "100%", height: listVoucher.all[0]!! ? "auto" : "500px" }}>
          <DataGrid
            rows={listVoucher.all}
            columns={columnsVoucher(handleClickOpen, 0)}
            {...dataGridProps}
          />
        </Box>
      </CustomTabPanel>
      
      <CustomTabPanel value={tabPost} index={1}>
        <Box sx={{ width: "100%", height: listVoucher.money[0]!! ? "auto" : "500px" }}>
          <DataGrid
            rows={listVoucher.money}
            columns={columnsVoucher(handleClickOpen,1)}
            {...dataGridProps}
          />
        </Box>
      </CustomTabPanel>
      <CustomTabPanel value={tabPost} index={2}>
        <Box sx={{ width: "100%", height: listVoucher.percent[0]!! ? "auto" : "500px" }}>
          <DataGrid
            rows={listVoucher.percent}
            columns={columnsVoucher(handleClickOpen,2)}
            {...dataGridProps}
          />
        </Box>
      </CustomTabPanel>
      <DeletePostModal handleClose={handleClose} modalDelete={modalDelete} getListPost={getListPost} />
    </>
  );
};

export default ManagerVoucher;

const dataGridProps = {
  initialState: {
    pagination: {
      paginationModel: {
        pageSize: 5,
      },
    },
  },
  pageSizeOptions: [5],
  disableRowSelectionOnClick: true,
  slots: { toolbar: GridToolbar, noRowsOverlay: NoData },
  slotProps: { toolbar: { showQuickFilter: true } },
  sx: { py: 1, px: 2 },
};