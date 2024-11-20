"use client";
import BookInfo from "@/components/detail/BookInfo";
import DocumentInfo from "@/components/detail/DocumentInfo";
import RentBook from "@/components/detail/RentBook";
import PromoteSection from "@/components/home/PromoteSection";
import { IListing, IReview } from "@/types/book";
import { useEffect, useState } from "react";
import { getBookDetailService } from "@/api/bookListService";
import { IParamsDetail } from "@/types/params";
import { useStoreAlert } from "../../../hooks/alert";

export default function Page({ params }: IParamsDetail) {
  const [listing, setListing] = useState<IListing>();
  const { callErrorAlert } = useStoreAlert(state => state);
  useEffect(() => {
    const makeRequest = async () => {
      const response = await getBookDetailService(params.detail[0]);
      if (typeof response !== 'string') {
        setListing({ ...response, review: response.review && response.review.length > 0 ? response.review : dummyReview }); //Todo: fix this tech debt
      } else {
        callErrorAlert(response);
      }
    }
    makeRequest();
  }, [callErrorAlert, params.detail]);

  return (
    <div className="container mx-auto mt-10 mb-20">
      <BookInfo book={listing} />
      <div className="flex mt-5 gap-5">
        <div className="basis-9/12">
          <DocumentInfo book={listing} />
        </div>
        <div className="flex-1">
          <RentBook book={listing} />
        </div>
      </div>
      <PromoteSection />
    </div>
  );
}

const dummyReview: IReview[] = [
  {
    "id": 1,
    "score": 5,
    "description": "Người cho thuê cuốn sách này rất tận tâm và chu đáo, luôn đảm bảo sách được giữ gìn cẩn thận và giao đúng hẹn. Cuốn sách Don Quixote Nhà quý tộc tài ba xứ Mancha - Tập 1 của Miguel De Cervantes là một tác phẩm kinh điển, mang đến cho người đọc những cuộc phiêu lưu kỳ thú và hài hước của hiệp sĩ Don Quixote. Cuốn sách không chỉ là một câu chuyện giải trí mà còn chứa đựng nhiều bài học sâu sắc về cuộc sống và con người. Đây là một cuốn sách không thể bỏ qua cho những ai yêu thích văn học cổ điển.",
    "imageLink": null,
    "leaseOrderId": 11,
    "userId": 2,
    "listingId": 1,
    "createdDate": "2024-11-21T00:00:00Z",
    "updatedDate": null,
    "deletedDate": null
  }
]