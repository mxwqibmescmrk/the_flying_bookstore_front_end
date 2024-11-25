import axios, { AxiosRequestConfig } from 'axios';
import { port } from '../utils/env';
import { handleError } from './handleError';
import { IBuyOrder, IBuyOrderConvert } from '../types/order';
import { IListing } from '../types/book';
import { getBookDetailService } from './bookListService';
import dayjs from 'dayjs';
import { getUserInfo } from './profile';
import { IUser } from '../types/user';
import { IRowBuy } from '../components/order/column';
const makeRequestGetBookDetailService = async (order: IBuyOrder) => {
  if (!order || !order?.listingId) return [];
  try {
    const response: IListing | string = await getBookDetailService(order?.listingId.toString());
    if (typeof response !== 'string') {
      const newBook: IRowBuy[] = [{
        id: response.id,
        title: response.book.title,
        createdDate: order?.createdDate || dayjs().format("DD/MM/YYYY"),
        deposit: response.depositFee,
        price: order?.totalPrice || 0,
        total: order?.totalPrice || 0,
      }];
      return newBook
    } else {
      return undefined;
    }
  } catch (error) {
    console.log({ error });
  }
  return undefined
}

const convertListSaleOrder = async (listOrder: IBuyOrder[]): Promise<IBuyOrderConvert[]> => {
  try {
    // Xử lý danh sách đơn hàng với Promise.all để đảm bảo tất cả đều được xử lý trước khi trả về.
    const convertedOrders = await Promise.all(
      listOrder.map(async (order) => {
        try {
          const listing = await makeRequestGetBookDetailService(order);
          const buyerResponse = order.buyerId ? await getUserInfo(order.buyerId) : undefined;
          let buyer = undefined;
          if (buyerResponse && typeof buyerResponse !== 'string' && 'data' in buyerResponse) {
            buyer = buyerResponse.data;
          }

          let sellerResponse = order.sellerId ? await getUserInfo(order.sellerId) : undefined;
          let seller = undefined;
          if (sellerResponse && typeof sellerResponse !== 'string' && 'data' in sellerResponse) {
            seller = sellerResponse.data;
          }

          // Chỉ trả về order khi có đủ thông tin cần thiết.
          if (!listing || !buyer || !seller) {
            console.warn("Incomplete data for order ID:", order.id);
            return null; // Dữ liệu không hợp lệ, trả về null.
          }
          const newOrder: IBuyOrderConvert = {
            ...order,
            listing,
            buyer,
            seller,
          }
          return newOrder;
        } catch (error) {
          console.error(`Error converting order ID ${order.id}:`, error);
          return null;
        }
      })
    );

    // Loại bỏ các giá trị null khỏi kết quả.
    return convertedOrders.filter((order) => order !== null) as IBuyOrderConvert[];
  } catch (error) {
    console.error("Error in convertSaleOrder:", error);
    return [];
  }
};

const getSaleOrderBySeller = async (sellerId: number, isBuyer: boolean): Promise<IBuyOrderConvert[] | string> => {
  const config: AxiosRequestConfig = {
    method: 'get',
    url: `${port}/api/SaleOrder/${isBuyer ? "buyer" : "seller"}/${sellerId}`,
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
