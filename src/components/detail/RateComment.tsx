import { Rating } from "@mui/material";
import Image from "next/image";
import React from "react";
import Avatar from "@/assets/images/no avatar.jpeg";
import { FaStar } from "react-icons/fa";
import { IReview } from "@/types/book";
import dayjs from "dayjs";

const RateComment = ({ review }: { review: IReview }) => {
  return (
    <div className=" flex border rounded-lg p-5 items-center">
      <div className="flex-none relative w-24 h-24">
        <Image src={Avatar} alt="ava" fill className="rounded-full object-cover" />
      </div>
      <div className="border-l pl-5 ml-5">
        <h4 className="text-lg font-semibold">Ẩn danh</h4>
        <p className="text-gray-600 mt-2 text-sm">
          {review?.description}
        </p>
        <div className="flex items-center mt-3">
          <Rating
            name="half-rating-read"
            defaultValue={0}
            value={review.score}
            readOnly
            size="small"
            emptyIcon={<FaStar className="" fontSize="inherit" />}
            icon={<FaStar className="" fontSize="inherit" />}
          />
          <p className="text-gray-400 text-sm ml-2 mr-3">{review?.score} sao</p>
          <h5 className="text-sm border-l pl-3">{dayjs(review.createdDate).format("DD/MM/YYYY")}</h5>
        </div>
      </div>
    </div>
  );
};

export default RateComment;
