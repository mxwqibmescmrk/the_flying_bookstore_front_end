import { Metadata } from "next";
import { SITE_NAME } from "../../../../../utils/env";
import VoucherForm from "../../../../../components/voucher/VoucherForm";
import Loading from "../../../../loading";

export const metadata: Metadata = {
  title: `Sửa voucher | ${SITE_NAME}`,
};

const EditVoucher = async ({
  params,
}: {
  params: Promise<{ voucherId: string }>
}) => {
  const voucherId = (await params).voucherId
  if(!voucherId){
    return (<Loading/>);
  }
  return (<VoucherForm voucherId={voucherId} />);
};

export default EditVoucher;
