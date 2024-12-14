import React from "react";
import LogoImage from "./../../assets/images/logo.jpg";
import MapImage from "./../../assets/images/google-map.png";
import Image from "next/image";
import { FaYoutube } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { LuMapPin } from "react-icons/lu";
import { FiPhoneCall } from "react-icons/fi";
import { IoMailOutline } from "react-icons/io5";
import "./Footer.scss";
import Link from "next/link";
const Info = () => {
  return (
    <div className="border-t">
      <div className="container mx-auto flex py-8 gap-5">
        <div className="info flex flex-col w-4/12">
          <div className="logo flex border border-slate-500 rounded-md border-dashed w-8/12">
            <Image src={LogoImage} alt="logo" width={100} className="mx-3" />
            <div className="self-center">
              <h3 className="text-primary font-bold text-xl">The Flying</h3>
              <p className="text-bookstore tracking-widest">bookstore</p>
            </div>
          </div>
          <p className="text-sm pt-8">
            The Flying Bookstore là nơi có thể giúp bạn học sinh/ sinh viên đem
            cho thuê, mượn tài liệu của mình. Đồng thời giúp quản lý các tài
            liệu mình cho thuê, mượn.
          </p>
          <div className="flex py-5 text-primary text-2xl gap-7">
            <FaFacebook />
            <FaYoutube />
            <FaInstagram />
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-xl mb-3">Liên hệ</h4>
          <div className="flex flex-col gap-2 ml-3">
            <div className="item-contact">
              <LuMapPin className="icon" />
              <span>
                171/11 Trương Phước Phan, Bình Hưng Hòa, Bình Tân, TP.HCM
              </span>
            </div>
            <div className="item-contact">
              <FiPhoneCall className="icon" />
              <span>+123 345 123</span>
            </div>
            <div className="item-contact">
              <IoMailOutline className="icon" />
              <span>support@flying.bookstore</span>
            </div>
          </div>
          <h4 className="font-semibold text-xl my-3">Chính sách</h4>
          <div className="flex flex-col gap-2 ml-3">
            <Link href={`/private-policy`}>
              <div className="item-contact text-primary ">
                Chính sách bảo mật
              </div>
            </Link>
            <Link href={`/book-condition-guide`}>
              <div className="item-contact text-primary ">
                Hướng dẫn về tình trạng sách
              </div>
            </Link>
          </div>
        </div>
        <div>
          <Image src={MapImage} alt="logo"  className="mx-3" />
        </div>
      </div>
    </div>
  );
};

export default Info;
