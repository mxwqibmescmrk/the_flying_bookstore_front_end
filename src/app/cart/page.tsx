"use client";
import CartInfo from "@/components/cart/CartInfo";
import { useStoreCart } from "@/hooks/cart";
import { Box, Button, Tab, Tabs } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import EmptyImg from "@/assets/images/empty_cart_animation_loop.gif";
import { useState } from "react";
import { a11yProps } from "../../utils/helps";
import CustomTabPanel from "../../components/order/CustomTabPanel";
import CartItem from "../../components/cart/CartItem";
import { useStoreStep } from "../../hooks/step";
import ListVoucher from "../../components/cart/voucherSession/ListVoucher";
import { IVoucherSession } from "../../types/voucher";
import ListVoucherShop from "../../components/cart/voucherShop/ListVoucherShop";

const Cart = () => {
  const { changeTabNum, tabNum } = useStoreStep();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    changeTabNum(newValue);
  };
  const renderEmptyCard = () => {
    return (<div className="mx-auto text-center flex flex-col mt-5 items-center">
      <Image src={EmptyImg} alt="empty cart" width={600} unoptimized />
      <p className="my-5 text-lg text-gray-700">
        Giỏ hàng của bạn đang trống
      </p>
      <Link href={"/"}>
        <Button variant="outlined">Quay lại trang chủ</Button>
      </Link>
    </div>);
  }
  const cart = useStoreCart((state) => state.cart);
  const renderInsideTab = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-10">
        <div className="md:col-span-9 flex flex-col gap-5 ">
          <div className=" flex flex-col gap-5 ">
            <CartItem />
          </div>
          <div className="mt-10 ">
            <CartInfo />
          </div>
        </div>
        <div className="md:col-span-3">
          <ListVoucherShop/>
          <ListVoucher />
        </div>
      </div>)
  }
  return (
    <div className="container mx-auto my-10">
      <h2 className="text-2xl font-semibold text-primary text-center">
        Giỏ hàng của bạn
      </h2>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', width: 'fit-content', mx: 'auto', mt: 1 }}>
        <Tabs value={tabNum} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Sách thuê" {...a11yProps(0)} />
          <Tab label="Sách mua" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={tabNum} index={0}>
        {!cart.rent?.bookId ? renderEmptyCard() : renderInsideTab()}
      </CustomTabPanel>
      <CustomTabPanel value={tabNum} index={1}>
        {!cart.buy?.bookId ? renderEmptyCard() : renderInsideTab()}
      </CustomTabPanel>

    </div>
  );
};

export default Cart;
