import { SITE_NAME } from "@/utils/env";
import { Metadata } from "next";
import VoucherForm from "../../../../components/voucher/VoucherForm";

export const metadata: Metadata = {
  title: `Thêm voucher | ${SITE_NAME}`,
};

const CreateNewVoucher = () => {
  return (<VoucherForm/>)
};

export default CreateNewVoucher;
