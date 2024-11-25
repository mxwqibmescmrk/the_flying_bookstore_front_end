import { GridActionsCellItem, GridActionsColDef, GridColDef, GridRenderCellParams, GridRowParams } from "@mui/x-data-grid";
import Link from "next/link";
import dayjs from "dayjs";
import { CiCircleInfo } from "react-icons/ci";
import theme from "../../utils/theme";
import { IRentOrder } from "../../types/order";

export type IRowBuy = {
  id: number;
  title: string;
  createdDate: string;
  deposit: number;
  price: number;
  total: number;
};
export type IRow = {
  id: number;
  title: string;
  deposit: number;
  duration: number;
  price: number;
  total: number;
};
export function convertToRow(order: IRentOrder): IRow {
  const { listing, leaseOrder } = order;
  const id = listing?.id || 0;
  const title = listing?.book.title || "";
  const totalDeposit = leaseOrder?.totalDeposit || 0;
  const totalLeaseFee = leaseOrder?.totalLeaseFee || 0;
  const dateEnd = dayjs(leaseOrder?.toDate);

  const duration = dateEnd.diff(leaseOrder?.fromDate, "day");
  const row: IRow = {
    id,
    title,
    deposit: totalDeposit,
    price: totalLeaseFee,
    total: totalDeposit,
    duration
  };

  return row;
}

const actionColumn: GridActionsColDef<any> = {
  field: "actions",
  type: "actions",
  width: 50,
  getActions: (params: GridRowParams<IRow>) => [
    <Link href={`/detail/${params?.row?.id}`} key="1">
      <GridActionsCellItem
        icon={<CiCircleInfo size={20} />}
        label="Xem chi tiết"
        size="large"
      />
    </Link>,],
};
// Example usage:
const columnsSame = [
  { field: "id", headerName: "Id bài đăng", width: 90, sortable: false },
  {
    field: "title",
    headerName: "Tên sách",
    minWidth: 150,
    sortable: false,
  },
];
export const columnsOrderRent: GridColDef<IRow>[] = [
  ...columnsSame,
  {
    field: "duration",
    headerName: "Thời gian thuê",
    type: "number",
    sortable: false,
    width: 150,
    valueGetter: (value: number) => value == 0 ? `1 ngày` : `${value} ngày`,
  },
  {
    field: "deposit",
    headerName: "Tiền cọc",
    width: 120,
    type: "number",
    sortable: false,
  },

  {
    field: "price",
    headerName: "Tiền thuê",
    type: "number",
    sortable: false,
    width: 150,
  },
  {
    field: "total",
    headerName: "Tổng cộng",
    sortable: false,
    type: "number",
    width: 150,
  },
  actionColumn
];
export const columnsOrderSellBuy: GridColDef<IRowBuy>[] = [
  ...columnsSame,
  {
    field: "createdDate",
    headerName: "Thời gian đặt",
    type: "number",
    sortable: false,
    width: 150,
    valueGetter: (value: number) => dayjs(value).format("DD/MM/YYYY"),
  },
  {
    field: "deposit",
    headerName: "Giá gốc",
    type: "number",
    sortable: false,
  },
  {
    field: "price",
    headerName: "Giá bán",
    type: "number",
    sortable: false,
  },
  {
    field: "total",
    headerName: "Tổng cộng",
    sortable: false,
    type: "number",
    width: 150,
  },
  actionColumn
];