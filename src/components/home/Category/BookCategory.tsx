"use client";
import Slider from "react-slick";
import Category from "./Category";
import { useCallback, useEffect, useState } from "react";
import { useGenreStore } from "@/hooks/genre";

const settings = {
  infinite: true,
  slidesToShow: 5,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2000,
  centerMode: true,
  centerPadding: "60px",
  lazyLoad: "ondemand" as "ondemand", // Lazy load ảnh
};
const BookCategory = () => {
  const { listGenre: listCategory } = useGenreStore();
  const fetchGenre = useGenreStore((state) => state.fetch);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer để phát hiện khi BookCategory hiển thị
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Ngừng theo dõi sau khi phần tử xuất hiện
        }
      },
      { threshold: 0.1 } // 10% BookCategory xuất hiện
    );

    const section = document.querySelector(".book-category");
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      fetchGenre(); // Chỉ fetch dữ liệu khi phần tử hiển thị
    }
  }, [isVisible, fetchGenre]);

  const renderCategory = useCallback(
    () => {
      if (!listCategory || !Array.isArray(listCategory) || listCategory.length == 0) return <p className="text-center"> </p>;
      return (
        <Slider {...settings}>
          {listCategory.slice(0, 20).map((category, index) => (
            <Category category={category} key={index} />
          ))}
        </Slider>
      );
    },
    [listCategory] // Include 'settings' in the dependency array
  );

  return (
    <div className="container mx-auto mt-10 mb-24 overflow-hidden">
      <h3 className="text-3xl pt-8 pb-10 font-semibold text-center">
        Danh mục sản phẩm
      </h3>
      {renderCategory()}
    </div>
  );
};

export default BookCategory;
