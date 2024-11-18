import axios, { AxiosRequestConfig } from 'axios';
import { port } from '../utils/env';
import { handleError } from './handleError';

const getSaleOrderBySeller = async (sellerId: number, isBuyer: boolean) => {
  const config: AxiosRequestConfig = {
    method: 'get',
    url: `${port}/api/SaleOrder/${isBuyer? "buyer": "seller"}/${sellerId}`,
  };
  try {
    const response = await axios.request(config);
    if (response.status === 200) {
      return response.data;
    }
    return handleError('Thất bại');
  } catch (error) {
    return handleError(error);
  }
};

export { getSaleOrderBySeller };
