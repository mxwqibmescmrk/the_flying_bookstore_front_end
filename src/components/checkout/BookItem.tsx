import Image from "next/image";
import BookImage from "@/assets/images/book loading.gif";
import Link from "next/link";
import { IBuyOrder, IRentOrder } from "../../types/order";
import { arrayToString, formatCurrency } from "../../utils/helps";
import { useStoreStep } from "../../hooks/step";
import { useEffect, useState } from "react";
import { IListing } from "../../types/book";
import { useStoreAlert } from "../../hooks/alert";
import { getBookDetailService } from "../../api/bookListService";

const BookItem = ({ orderDetail }: { orderDetail: IBuyOrder & IRentOrder }) => {
  const { leaseOrder = null } = orderDetail;
  const { tabNum } = useStoreStep();

  if(tabNum == 1){
    if(!orderDetail?.id) return <>Không có chi tiết đơn hàng</>
  } else if(tabNum == 0) {
    if(!orderDetail?.listing?.id) return <>Không có chi tiết đơn hàng</>
  }
  return (
    <div className="hover:shadow-lg hover:shadow-indigo-500/50 ease-in-out duration-200 p-3 rounded-lg book flex justify-between align-center  mt-5 gap-5">
      <div className="flex">
        <div className="relative w-32 h-48 mr-6">
          <Link href={`/detail/${orderDetail?.listing?.id || orderDetail?.id}`}>
            <Image
              src={
                orderDetail?.listing?.copy.imageLink
                  ? orderDetail?.listing?.copy.imageLink
                  : BookImage
              }
              alt="book"
              fill
              unoptimized
              className="object-cover rounded-lg"
            />
          </Link>
        </div>
        <div className="flex flex-col  justify-center">
          <Link href={`/detail/${orderDetail?.listing?.id}`}>
            <h5 className="text-lg font-semibold">{orderDetail?.listing?.book.title}</h5>
          </Link>
          <p className="text-sm text-gray-400">{arrayToString(orderDetail?.listing?.book?.authors)}</p>
        </div>
      </div>
      <div className="flex items-center ">
        <p className="text-sm mr-3">Số lượng: </p>
        <p className="text-sm text-gray-400">1</p>
      </div>
      {tabNum === 1 ? (
        <div className="flex justify-center flex-col ">
          <div className="flex justify-between">
            <p className="text-sm mr-8">Giá bán:</p>
            <p className="text-sm text-gray-400">{formatCurrency(orderDetail?.totalPrice)}</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center">
          <div className="flex justify-between">
            <p className="text-sm mr-8">Giá thuê: </p>
            <p className="text-sm text-gray-400">{formatCurrency(leaseOrder?.leaseOrderDetails[0].leaseRate)}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm">Cọc: </p>
            <p className="text-sm text-gray-400">{formatCurrency(leaseOrder?.leaseOrderDetails[0].depositFee)}</p>
          </div>
        </div>)}
    </div>
  );
};

export default BookItem;
