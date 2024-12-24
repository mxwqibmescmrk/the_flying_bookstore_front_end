import axios, { AxiosRequestConfig } from 'axios';
import { headerAxios, port } from '../utils/env';
import { handleError } from './handleError';
import { IBuyOrder, IBuyOrderConvert, IListingOrder, ISaleOrder } from '../types/order';
import { IListing } from '../types/book';
import { getBookDetailService } from './bookListService';
import dayjs from 'dayjs';
import { getUserInfo } from './profile';
import { IUser } from '../types/user';
import { IRowBuy } from '../components/order/column';
const makeRequestGetBookDetailService = (order: ISaleOrder) => {
  const listing: IListingOrder = order.listing;
  const newBook: IRowBuy[] = [{
    id: listing.id,
    title: listing.book.title,
    createdDate: order?.saleOrder.createdDate || dayjs().format("DD/MM/YYYY"),
    deposit: listing.deposit,
    price: order?.listing.price || 0,
    total: order?.saleOrder.totalPrice || 0,
  }];
  return newBook
}

const convertListSaleOrder = (listOrder: ISaleOrder[]): IBuyOrderConvert[] => {
  const convertedOrders = listOrder.map((order) => {
    const listing = makeRequestGetBookDetailService(order);
    let buyer = order.Buyer;
    let seller = order.Seller;
    const newOrder: IBuyOrderConvert = {
      ...order.saleOrder,
      listing,
      buyer,
      seller,
    }
    return newOrder;
  })
  return convertedOrders.filter((order) => order !== null) as IBuyOrderConvert[];

};

const getSaleOrderBySeller = async (sellerId: number, isBuyer: boolean): Promise<IBuyOrderConvert[] | string> => {
  const config: AxiosRequestConfig = {
    method: 'get',
    url: `${port}/api/SaleOrder/${isBuyer ? "buyer" : "seller"}/${sellerId}`,
    headers: headerAxios
  };
  try {
    const response = await axios.request(config);
    if (response.status === 200) {
      return convertListSaleOrder(response.data);
    }
    return handleError('Thất bại');
  } catch (error) {
    return handleError(error);
  }
};

export { getSaleOrderBySeller };
