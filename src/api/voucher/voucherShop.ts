import axios, { AxiosRequestConfig } from 'axios';
import { handleError } from '../handleError';
import { port } from '../../utils/env';

const getVoucherShop = async () => {
  const config: AxiosRequestConfig = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${port}/api/voucher-shop`,
    headers: {}
  };

  try {
    const response = await axios.request(config);
    if(response.status==200){
      return response.data;
    }
    return handleError("Thất bại");
  } catch (error) {
    return handleError(error)
  }
};

export {getVoucherShop};