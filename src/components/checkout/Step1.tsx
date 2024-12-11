import { Box, Button } from "@mui/material";
import InfoRent from "./InfoRent";
import Pay from "./Pay";
import "./Step.scss";
import Link from "next/link";
import { FormProvider, useForm } from "react-hook-form";
import { useAuthStore } from "@/hooks/user";
import { IFormCheckout } from "@/types/form";
import dayjs from "dayjs";
// import { VNPay } from "vnpay";
import { useStoreCart } from "@/hooks/cart";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useStoreOrder } from "../../hooks/order";
import { getProfile, onSubmitProfile } from "../../api/profile";
import { useStoreAlert } from "../../hooks/alert";
import { onSubmitOrderBuyService, onSubmitOrderService } from "@/api/checkoutService";
import InfoCheckout from "../cart/InfoCheckout";
import CartItem from "../cart/CartItem";
import { useStoreStep } from "../../hooks/step";
import ListVoucherShop from "../cart/voucherShop/ListVoucherShop";
import ListVoucher from "../cart/voucherSession/ListVoucher";
import { useStoreVoucher } from "../../hooks/voucher";

// const vnpay = new VNPay({
//   tmnCode: process.env.TMN_CODE || "",
//   secureSecret: process.env.SECURE_SECRET || "",
//   vnpayHost: process.env.VNPAY_HOST || "",
// });

const convertPaymentType = (paymentType: number) => {
  switch (paymentType) {
    case 0:
      return "COD";
    case 1:
      return "BANK_TRANSFER";
    case 2:
      return "VNPAY";
    default:
      break;
  }
};
const Step1 = ({ handleNext }: { handleNext: () => void }) => {
  const { tabNum } = useStoreStep();
  const { callAlert, callErrorAlert } = useStoreAlert();
  const { profile, token, setToken } = useAuthStore();
  const { updateRentOrder, updateBuyOrder } = useStoreOrder();
  const { cart } = useStoreCart();
  const [payType, setPayType] = useState<number>(0);
  const methods = useForm<IFormCheckout>();
  const { voucherShop,voucher } = useStoreVoucher();

  const {
    handleSubmit,
    getValues,
    formState: { isSubmitSuccessful },
    reset,
  } = methods;

  useEffect(() => {
    const defaultValues: IFormCheckout = {
      lastName: profile?.lastName || "",
      firstName: profile?.firstName || "",
      email: profile?.email || "",
      phoneNumber: profile?.phoneNumber || "",
      address: profile?.address || "",
      birthDate: profile?.birthDate ? dayjs(profile.birthDate) : null,
    };
    reset(defaultValues);
  }, [profile?.address, profile?.birthDate, profile?.email, profile?.firstName, profile?.lastName, profile?.phoneNumber, reset]);

  useEffect(() => {
    getProfile(token, setToken);
  }, [setToken, token]);
  const callApiBuyOrder = async () => {
    const data = getValues();
    const convertValue = {
      status: "ORDERED_PAYMENT_PENDING",
      listingId: cart?.buy?.bookId,
      buyerAddress: data.address,
      paymentMethod: convertPaymentType(payType),
      VoucherShopId: voucherShop?.id,
      VoucherSessionId: voucher?.id
    };
    console.log({convertValue});
    
    const response = await onSubmitOrderBuyService(convertValue, token);
    if (typeof response != "string") {
      callAlert("Tạo đơn hàng mua thành công");
      updateBuyOrder(response?.saleOrder?.id);
      handleNext();
    } else {
      callErrorAlert(response)
    }
  }
  const callApiRentOrder = async () => {
    const data = getValues();
    const convertValue = {
      status: "ORDERED_PAYMENT_PENDING",
      listingId: cart?.rent?.bookId,
      lesseeId: profile?.id,
      lesseeAddress: data.address,
      fromDate: dayjs(cart?.rent?.dayRent.dateStart).format("YYYY-MM-DD"),
      toDate: dayjs(cart?.rent?.dayRent.dateEnd).format("YYYY-MM-DD"),
      paymentMethod: convertPaymentType(payType),
    };
    const response = await onSubmitOrderService(convertValue, token);
    // const response= demoRes.leaseOrder;
    if (typeof response != "string") {
      callAlert("Tạo đơn hàng thuê thành công");
      updateRentOrder(response?.id);
      handleNext();
      if (payType == 2) {
        // TODO: VNPay
      }
    } else {
      callErrorAlert(response)
    }
  }
  const onSubmitOrder = async () => {
    if (tabNum == 1) {
      callApiBuyOrder()
    } else {
      callApiRentOrder()
    }
  };
  const beforeOnSubmitProfile = async (data: IFormCheckout) => {
    return await onSubmitProfile(data, profile, token).then((res) => {
      callAlert(
        "Xác nhận thông tin thành công, mời bạn chọn thanh toán rồi tạo đơn hàng"
      );
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(beforeOnSubmitProfile)}>
        <div className="step mt-8 grid grid-cols-2">
          {/* thông tin đặt thuê */}
          <div className="card ">
            <h3 className="">Thông tin đặt {tabNum == 1 ? "mua" : "thuê"}</h3>
            <InfoRent />
            <h3 className="mt-10">Thông tin đặt hàng</h3>
            <InfoCheckout />
          </div>
          <div className="card">
            <h3 className="">Thông tin sản phẩm</h3>
            <CartItem isCheckout={true} />
            {tabNum == 1 ? (<>
              <h3 className="mt-7">Mã giảm giá</h3>
              <ListVoucherShop />
              <ListVoucher /></>) : (<></>)}
            <h3 className="mt-7">Thanh toán</h3>
            <Pay payType={payType} setPayType={setPayType} />
          </div>
        </div>
        <Box sx={{ display: "flex", flexDirection: "row", pt: 2, mb: 5 }}>
          <Link href={"/cart"}>
            <Button color="inherit" variant="outlined" size="large">
              Quay lại giỏ hàng
            </Button>
          </Link>
          <Box sx={{ flex: "1 1 auto" }} />

          <Button
            size="large"
            variant="contained"
            onClick={onSubmitOrder}
          >
            Tạo đơn hàng
          </Button>
        </Box>
      </form>
    </FormProvider>
  );
};

export default Step1;
