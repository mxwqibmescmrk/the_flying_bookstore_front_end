import { SITE_NAME } from "@/utils/env";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Quản lý voucher | ${SITE_NAME}`,
};

const layout = ({children}:{children: React.ReactNode}) => children

export default layout