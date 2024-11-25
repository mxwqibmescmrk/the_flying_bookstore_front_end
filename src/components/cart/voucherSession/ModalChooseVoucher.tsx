import { Button, Card, CardActions, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, Typography } from "@mui/material"
import { SearchIconWrapperVoucher, SearchVoucher, StyledInputBaseVoucher } from "./StyleVoucher"
import { TbTicket } from "react-icons/tb"
import { IVoucherSession } from "../../../types/voucher"
import dayjs from "dayjs"
import { isValidVoucher } from "./calculateVoucher"
import { formatCurrency } from "../../../utils/helps"
import { IListing } from "../../../types/book"
import { Dispatch, SetStateAction } from "react"

const ModalChooseVoucher = ({ properties: { book, voucherChoosen, chooseVoucher, open, handleClose, keyword, setKeyword, descriptionElementRef, listVoucher } }: { properties: { book: IListing | undefined, voucherChoosen: IVoucherSession | undefined, chooseVoucher: (arg: IVoucherSession | undefined) => void, open: boolean, handleClose: () => void, keyword: string, setKeyword: Dispatch<SetStateAction<string>>, descriptionElementRef: React.RefObject<HTMLElement>, listVoucher: IVoucherSession[] } }) => {
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
          {listVoucher.map((item: IVoucherSession, index: number) => (
            <Card variant="elevation" key={index} raised={item.id == voucherChoosen?.id} sx={{ my: 1 }} >{renderCard(item)}</Card>
          ))}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Xong</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ModalChooseVoucher