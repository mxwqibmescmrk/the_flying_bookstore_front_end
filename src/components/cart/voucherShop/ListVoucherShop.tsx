import { TbTicket } from "react-icons/tb";
import { Button, Card, CardActions, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { port } from "../../../utils/env";
import axios from "axios";
import { IVoucherSession } from "../../../types/voucher";
import { formatCurrency } from "../../../utils/helps";
import dayjs from "dayjs";
import { useStoreCart } from "../../../hooks/cart";
import { useStoreAlert } from "../../../hooks/alert";
import { IListing } from "../../../types/book";
import { useStoreStep } from "../../../hooks/step";
import { getBookDetailService } from "../../../api/bookListService";
import { useStoreVoucher } from "../../../hooks/voucher";
import { isValidVoucher, sortVouchersByPriority } from "../voucherSession/calculateVoucher";
import { SearchIconWrapperVoucher, SearchVoucher, StyledInputBaseVoucher } from "../voucherSession/StyleVoucher";
import { IoTicketOutline } from "react-icons/io5";

const ListVoucherShop = () => {
  const [open, setOpen] = React.useState(false);
  const [listVoucher, setListVoucher] = useState<IVoucherSession[]>([])
  const [keyword, setKeyword] = useState<string>("");
  const { voucherShop: voucherChoosen, chooseVoucherShop: chooseVoucher } = useStoreVoucher();
  const handleClose = () => {
    setOpen(false);
  };
  const voucherChoose = listVoucher.find(voucher => voucher.id == voucherChoosen?.id)

  const { tabNum } = useStoreStep();
  const cart = useStoreCart(state => state.cart);
  const { callErrorAlert } = useStoreAlert();
  const [book, setBook] = useState<IListing>();

  useEffect(() => {
    const callApiGetBookDetail = async () => {
      const bookId = tabNum === 1 ? cart.buy?.bookId : cart.rent?.bookId;
      if (!bookId)
        return;
      try {
        const newBook = await getBookDetailService(bookId.toString());
        if (typeof newBook !== "string") {
          setBook(newBook);
        } else {
          callErrorAlert(newBook);
        }
      } catch (error) {
        console.log({ error });
      }
    }
    callApiGetBookDetail();
  }, [callErrorAlert, cart.buy?.bookId, cart.rent?.bookId, tabNum])

  const descriptionElementRef = React.useRef<HTMLElement>(null);
  useEffect(() => {
    const getSearchVoucher = async () => {
      return await axios.get(`${port}/api/voucher-shop/search?keyword=${keyword}`)
        .then((response) => {
          if (response.status == 200) {
            setListVoucher(response.data);
            const listSortVoucher = sortVouchersByPriority(response.data, book);
            const firstVoucher = listSortVoucher[0];
            if (firstVoucher && !isValidVoucher(firstVoucher)) {
              return;
            }
            chooseVoucher(firstVoucher);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    getSearchVoucher();
  }, [book, keyword, chooseVoucher])

  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  const renderCard = (voucher: IVoucherSession) => {
    return (
      <>
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
              HSD: {dayjs(voucher.startDate).format("DD/MM/YYYY")} - {dayjs(voucher.endDate).format("DD/MM/YYYY")}
            </Typography>
            {
              !isValidVoucher(voucher, book?.price) ? (<Button size="small" variant="text" disabled > Không thỏa điều kiện</Button>) : voucherChoosen?.id === voucher.id ? (
                <Button size="small" variant="outlined" onClick={() => chooseVoucher(undefined)}>Bỏ Chọn</Button>
              ) : (
                <Button size="small" variant="contained" onClick={() => chooseVoucher(voucher)}> Chọn</Button>
              )}
          </Stack>
        </CardActions>
      </>
    )
  }

  return (
    <>
      <div className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-medium text-gray-800">Khuyến Mãi của Shop</h2>
          <span className="text-sm text-gray-500">Có thể chọn 1</span>
        </div>
        {voucherChoose && (
          <div
            className="flex items-center justify-between border border-blue-300 rounded-lg p-3 mb-3"
          >
            <div className="">
              <div className="text-lg font-medium text-gray-800">
                Giảm {voucherChoose.voucherType == 1 ? voucherChoose.discountPercentage + "%" : formatCurrency(voucherChoose.discountAmount)}
              </div>
              <div className="text-sm font-light text-gray-400">
                Cho đơn hàng từ {formatCurrency(voucherChoose.minValue)}
              </div>
            </div>
            <Button size="small" variant="outlined" onClick={() => chooseVoucher(undefined)}>Bỏ Chọn</Button>
          </div>
        )}

        <button className="text-sm mt-2 text-primary flex items-center" onClick={() => setOpen(true)}>
          <IoTicketOutline className="mr-2 text-lg" />Chọn hoặc nhập mã khác
        </button>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={"paper"}
        aria-labelledby="scroll-voucher"
        aria-describedby="scroll-voucher-descript"
      >
        <DialogTitle id="scroll-voucher">{book?.user?.firstName} {book?.user?.lastName} khuyến mãi</DialogTitle>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            padding: "0 16px 6px 16px",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >

          <SearchVoucher>
            <SearchIconWrapperVoucher>
              <TbTicket />
            </SearchIconWrapperVoucher>
            <StyledInputBaseVoucher
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm tên hoặc mã voucher..."
              inputProps={{ 'aria-label': 'search' }}
            />
          </SearchVoucher>
        </Stack>

        <DialogContent dividers={true}>
          <DialogContentText
            id="scroll-voucher-descript"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
              Hiện tại bạn đang có {voucherChoosen ? 1 : 0} voucher. Bạn có thể chọn 1 voucher
            </Typography>
            {listVoucher.map((item, index) => (
              <Card variant="elevation" key={index} raised={item.id == voucherChoosen?.id} sx={{ my: 1 }} >{renderCard(item)}</Card>
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

export default ListVoucherShop