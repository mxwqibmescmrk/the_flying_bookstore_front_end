import { SITE_NAME } from "@/utils/env"
import { Metadata } from "next"
import { OrderType } from "../../../types/order";
import ListOrderMainBuy from "../../../components/customerOrder/ListOrderMainBuy";

export const metadata: Metadata={
  title: `Quản lý đơn ${OrderType.Sell} | ${SITE_NAME}`,
}

const page = () => {
  return <ListOrderMainBuy orderType={OrderType.Sell} />;
};
export default page;
