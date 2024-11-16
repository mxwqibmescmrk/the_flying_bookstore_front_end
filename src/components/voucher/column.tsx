import { GridColDef, GridRowParams, GridActionsCellItem } from '@mui/x-data-grid';
import Link from 'next/link';
import { CiCircleInfo, CiEdit, CiTrash } from 'react-icons/ci';
import theme from '../../utils/theme';
import { IVoucherSession } from '../../types/voucher';
import { formatCurrency } from '../../utils/helps';



const columnForPercent = [
  {
    field: "discountPercentage",
    headerName: "Phần trăm giảm",
    width: 150,
    editable: false,
    valueGetter: (value: number) => value ? value + "%" : "",
  },
]

const columnForMoney = [
  {
    field: "discountAmount",
    headerName: "Số tiền giảm",
    width: 150,
    editable: false,
    valueGetter: (value: number) => value ? formatCurrency(value) : "",
  },
]

const columnForAll = [

  {
    field: "voucherType",
    headerName: "Loại voucher",
    width: 200,
    editable: false,
    valueFormatter: (value: number) => value === 0 ? 'Giảm theo số tiền' : 'Giảm theo phần trăm',
  },
  ...columnForMoney,
  ...columnForPercent
]

export const columnsVoucher = (
  handleClickOpen: (arg: IVoucherSession) => void,
  voucherType: number
): GridColDef<IVoucherSession>[] => {
  return [
    {
      field: "id",
      headerName: "Id",
      width: 15,
      editable: false,
    },
    {
      field: "name",
      headerName: "Tên",
      width: 150,
      editable: false,
    },
    {
      field: "code",
      headerName: "Mã",
      width: 100,
      editable: false,
    },
    {
      field: "dateRange",
      headerName: "Thời gian hiệu lực",
      width: 150,
      editable: false,
      valueGetter: (_, row) => {
        const startDate = new Date(row.startDate).toLocaleDateString('vi-VN');
        const endDate = new Date(row.endDate).toLocaleDateString('vi-VN');
        return `${startDate} - ${endDate}`;
      },
    },
    {
      field: "minValue",
      headerName: "Giá trị tối thiểu",
      width: 130,
      editable: false,
      valueGetter: (value: number) => formatCurrency(value),
    },
    ...(voucherType == 2 ? columnForPercent  : voucherType == 1 ? columnForMoney : columnForAll),

    {
      field: "actions",
      type: "actions",
      width: 150,
      getActions: (params: GridRowParams<IVoucherSession>) => [
        <Link href={`/voucher/edit/${params?.row?.id}`} key="2">
          <GridActionsCellItem
            icon={<CiEdit size={20} />}
            label="Sửa"
            size="large"
          />
        </Link>,
        <GridActionsCellItem
          icon={<CiTrash size={20} color={theme.palette.error.main} />}
          key="3"
          label="Xóa"
          size="large"
          onClick={() => handleClickOpen(params?.row)}
        />,
      ],
    },
  ];
};