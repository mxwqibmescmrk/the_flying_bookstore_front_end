import { Divider } from "@mui/material";
import React, { useEffect, useState } from "react";
import BookItem from "./BookItem";
import { BsFileText } from "react-icons/bs";
import { PiCalendarCheck } from "react-icons/pi";
import { LuFlag } from "react-icons/lu";
import { CgCreditCard } from "react-icons/cg";
import { IBuyOrder } from "../../types/order";
import dayjs from "dayjs";
import { renderPayment, renderStatus } from "./PaymentStatus";
import { useStoreStep } from "../../hooks/step";
import { GrUserManager } from "react-icons/gr";
import { RiCalendarTodoLine } from "react-icons/ri";
import { RiMapPin2Line } from "react-icons/ri";
import { PiPhone } from "react-icons/pi";
import { formatCurrency, formatPhoneNumber } from "../../utils/helps";
import CartInfoItem, { CartInfoItemProps } from "../cart/CartInfoItem";
import { PiMoney } from "react-icons/pi";
import { GiMoneyStack } from "react-icons/gi";
import { TbSum, TbTicket } from "react-icons/tb";
import { getUserInfo } from "../../api/profile";
import { useStoreAlert } from "../../hooks/alert";
import { IUser } from "../../types/user";
import { MdAttachMoney, MdOutlineAttachMoney } from "react-icons/md";
import { IoTicketOutline } from "react-icons/io5";

const OrderBuy = ({ orderDetail }: { orderDetail: IBuyOrder }) => {
  const [sellUser, setSellUser] = useState<IUser>();
  const { callErrorAlert } = useStoreAlert()
  useEffect(() => {
    const callApiGetSellerInfo = async () => {
      if (!orderDetail?.sellerId) return callErrorAlert("Không nhận diện được người bán!");
      const response = await getUserInfo(orderDetail?.sellerId);
      if (typeof response != "string") {
        console.log({ response });
        setSellUser(response.data);
      } else {
        callErrorAlert(response);
      }
    }
    callApiGetSellerInfo()
  }, [callErrorAlert, orderDetail?.sellerId])
  if (!orderDetail?.id) return <>Không có đơn hàng</>
  const listOrderDetail: Array<CartInfoItemProps> = [
    {
      title: `Mã đơn hàng`,
      description: orderDetail?.id,
      children: <BsFileText className="total__icon" />
    },
    {
      title: `Ngày đặt mua`,
      description: dayjs(orderDetail?.createdDate).format("DD/MM/YYYY"),
      children: <PiCalendarCheck className="total__icon" />
    },
    {
      title: `Người bán`,
      description: `${sellUser?.lastName} ${sellUser?.firstName}`,
      children: <GrUserManager className="total__icon" />
    },
    {
      title: `Địa chỉ người bán`,
      description: orderDetail?.sellerAddress,
      children: <RiMapPin2Line className="total__icon" />
    }, {
      title: `Số điện thoại người bán`,
      description: formatPhoneNumber(sellUser?.phoneNumber),
      children: <PiPhone className="total__icon" />
    },
    {
      title: `Trạng thái`,
      description: renderStatus(orderDetail?.status),
      children: <LuFlag className="total__icon" />
    },
    {
      title: `Phương thức thanh toán`,
      description: renderPayment(orderDetail?.paymentMethod),
      children: <CgCreditCard className="total__icon" />
    },
    {
      title: `Giá bán`,
      description: formatCurrency(orderDetail?.totalPrice),
      children: <MdAttachMoney className="total__icon" />
    },
    {
      title: 'Khuyến mãi từ người bán',
      description: formatCurrency(10000),
      children: <IoTicketOutline className="total__icon" />
    }, {
      title: 'Khuyến mãi từ The Flying Bookstore',
      description: formatCurrency(20000),
      children: <TbTicket className="total__icon" />
    },
  ]
  return (
    <>
      <Divider>Bài đăng</Divider>
      <BookItem orderDetail={orderDetail} />
      <Divider sx={{ mt: 3 }} />
      <h4 className="text-lg font-medium text-center mt-5 my-3">
        Thông tin đặt hàng
      </h4>
      <div className="columns-2 gap-10 my-4">
        <div className="total">
          {listOrderDetail.map(({ title, children, description }, index) =>
            (<CartInfoItem key={index * 2} title={title} description={description}>{children}</CartInfoItem>))
          }
          <div className="border-t">
            <CartInfoItem title={`Tổng tiền thanh toán`} description={!!orderDetail?.totalPrice && formatCurrency(orderDetail?.totalPrice)} >
              <TbSum className="total__icon" />
            </CartInfoItem>
          </div>
        </div>
      </div >
    </>
  );
};

export default OrderBuy;
