import Image from "next/image"
import LogoImage from "./../../../assets/images/logo.jpg";
import { TbTicket } from "react-icons/tb";
import { alpha, Button, Card, CardActions, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, InputBase, Stack, styled, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { port } from "../../../utils/env";
import axios from "axios";
import { IVoucherSession } from "../../../types/voucher";
import { formatCurrency } from "../../../utils/helps";
import dayjs from "dayjs";

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));
const renderCard = (voucher: IVoucherSession) => {
  return (
    <React.Fragment>
      <CardContent sx={{ paddingBottom: 0 }}>
        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
          {voucher.name}
        </Typography>
        <Typography variant="h6" component="div" color={"primary"}>
          Giảm {voucher.voucherType == 1 ? voucher.discountPercentage + "%" : formatCurrency(voucher.discountAmount)}
        </Typography>
        <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>cho đơn hàng tối thiểu {formatCurrency(voucher.minValue)}</Typography>
        <Typography variant="body2">
          Mã: {voucher.code}
        </Typography>
      </CardContent>
      <CardActions sx={{ paddingTop: 0 }}>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            width: "100%",
            padding: "0 8px 0 8px",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body2">
            HSD: {dayjs(voucher.endDate).format("DD-MM-YYYY")}
          </Typography>
          <Button size="small">Chọn</Button>
        </Stack>
      </CardActions>
    </React.Fragment>
  )
}
const ListVoucher = () => {
  const [open, setOpen] = React.useState(true);
  const [listVoucher, setListVoucher] = useState<IVoucherSession[]>([])
  const [keyword, setKeyword] = useState<string>();
  const handleClose = () => {
    setOpen(false);
  };

  const descriptionElementRef = React.useRef<HTMLElement>(null);

  useEffect(() => {
    const getSearchVoucher = async () => {
      return await axios.get(`${port}/api/voucher-session/search?name=${keyword}`)
        .then((response) => {
          if (response.status == 200) {
            setListVoucher(response.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    getSearchVoucher();
  }, [keyword])

  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);
  return (
    <>
      <div className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-medium text-gray-800">Khuyến Mãi toàn sàn</h2>
          <span className="text-sm text-gray-500">Có thể chọn 1</span>
        </div>
        <div
          className="flex items-center justify-between border border-blue-300 rounded-lg p-3 mb-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 flex items-center justify-center rounded-lg ">
              <Image src={LogoImage} alt="icon" />
            </div>
            <div className="text-sm font-medium text-gray-800">
              Giảm 10%
            </div>
          </div>
          <button
            className={`px-3 py-1 text-sm font-semibold rounded-lg bg-gray-200 text-gray-700`}
          >
            Bỏ Chọn
          </button>
        </div>

        <button className="text-sm mt-2 text-primary flex items-center" onClick={() => setOpen(true)}>
          <TbTicket className="mr-2 text-lg" /> Chọn hoặc nhập mã khác
        </button>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={"paper"}
        aria-labelledby="scroll-voucher"
        aria-describedby="scroll-voucher-descript"
      >
        <DialogTitle id="scroll-voucher">The Flying Bookstore khuyến mãi</DialogTitle>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            padding: "0 16px 6px 16px",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >

          <Search>
            <SearchIconWrapper>
              <TbTicket />
            </SearchIconWrapper>
            <StyledInputBase
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm tên voucher..."
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          <Button variant="outlined">Tìm</Button>
        </Stack>

        <DialogContent dividers={true}>
          <DialogContentText
            id="scroll-voucher-descript"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            {listVoucher.map((item, index) => (
              <Card variant="outlined" key={index} sx={{ my: 1 }} >{renderCard(item)}</Card>
            ))}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Xong</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ListVoucher