"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Box, Button, Stack, Tab, Tabs, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import NoData from "@/components/order/NoData";
import {
  IRowsPost2,
  columnsPost,
  convertDataToIRow,
} from "@/components/managerPost/column";
import DeletePostModal from "@/components/managerPost/DeletePostModal";
import { useAuthStore } from "@/hooks/user";
import { getListPostService } from "@/api/managerPostService";
import CustomTabPanel from "../../../components/order/CustomTabPanel";
import { a11yProps } from "../../../utils/helps";
import { useStoreStep } from "../../../hooks/step";
import { useStoreAlert } from "../../../hooks/alert";

const ManagerPost = () => {
  const [modalDelete, setModalDelete] = useState<{
    open: boolean;
    data: IRowsPost2 | null;
  }>({
    open: false,
    data: null,
  });
  const [tabPost, setTabPost] = useState(0)
  const { profile } = useAuthStore()
  const [listPost, setListPost] = useState<{
    rentBuy: IRowsPost2[],
    rent: IRowsPost2[],
    buy: IRowsPost2[]
  }>(
    {
      rentBuy: [],
      rent: [],
      buy: []
    }
  );
  const { callErrorAlert } = useStoreAlert()

  const handleClickOpen = (data: IRowsPost2) => {
    setModalDelete({ open: true, data });
  };

  const handleChangeTabPost : (event: React.SyntheticEvent, newValue: number) => void = (event, newValue)  => {
    setTabPost(newValue);
  };

  const handleClose = () => {
    setModalDelete((state) => ({ ...state, open: false }));
  };

  const getListPost = useCallback(async (): Promise<void> => {
    if (!profile) return;
    try {
      const response = await getListPostService(profile);
      if (typeof response != "string") {
        const convertData = convertDataToIRow(response?.content);
        setListPost({
          rentBuy: convertData,
          rent: convertData.filter(item => item.allowRent == 1 && item.allowPurchase == 0),
          buy: convertData.filter(item => item.allowRent == 0 && item.allowPurchase == 1),
        });
      } else {
        callErrorAlert(response);
      }
    } catch (error) {

    }
  }, [callErrorAlert, profile]);

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
          Quản lý bài đăng của tôi
        </Typography>
        <Link href="/manager-post/add-post">
          <Button variant="contained">Thêm bài đăng</Button>
        </Link>
      </Stack>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabPost} onChange={handleChangeTabPost} aria-label="manage post">
          <Tab value={0} label="Bài đăng bán và thuê" {...a11yProps(0)} sx={{textTransform:"none"}}  />
          <Tab value={1} label="Bài đăng chỉ thuê" {...a11yProps(1)} sx={{textTransform:"none"}} />
          <Tab value={2} label="Bài đăng chỉ bán" {...a11yProps(2)} sx={{textTransform:"none"}} />
        </Tabs>
      </Box>
      <CustomTabPanel value={tabPost} index={0}>
        <Box sx={{ width: "100%", height: listPost.rentBuy[0]!! ? "auto" : "500px" }}>
          <DataGrid
            rows={listPost.rentBuy}
            columns={columnsPost(handleClickOpen, tabPost)}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
            slots={{ toolbar: GridToolbar, noRowsOverlay: NoData }}
            slotProps={{ toolbar: { showQuickFilter: true } }}
            sx={{ py: 1, px: 2 }}
          />
        </Box>
      </CustomTabPanel>
      <CustomTabPanel value={tabPost} index={1}>
        <Box sx={{ width: "100%", height: listPost.rent[0]!! ? "auto" : "500px" }}>
          <DataGrid
            rows={listPost.rent}
            columns={columnsPost(handleClickOpen, tabPost)}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
            slots={{ toolbar: GridToolbar, noRowsOverlay: NoData }}
            slotProps={{ toolbar: { showQuickFilter: true } }}
            sx={{ py: 1, px: 2 }}
          />
        </Box>
      </CustomTabPanel>
      <CustomTabPanel value={tabPost} index={2}>
        <Box sx={{ width: "100%", height: listPost.buy[0]!! ? "auto" : "500px" }}>
          <DataGrid
            rows={listPost.buy}
            columns={columnsPost(handleClickOpen, tabPost)}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
            slots={{ toolbar: GridToolbar, noRowsOverlay: NoData }}
            slotProps={{ toolbar: { showQuickFilter: true } }}
            sx={{ py: 1, px: 2 }}
          />
        </Box>
      </CustomTabPanel>


      <DeletePostModal handleClose={handleClose} modalDelete={modalDelete} getListPost={getListPost} />
    </>
  );
};

export default ManagerPost;
