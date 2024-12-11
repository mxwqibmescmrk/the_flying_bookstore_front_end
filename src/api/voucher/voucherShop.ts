import axios, { AxiosRequestConfig } from 'axios';
import { handleError } from '../handleError';
import { headerAxios, port } from '../../utils/env';

const getSearchVoucherShop = async (keyword: string) => {
  return await axios.get(`${port}/api/voucher-shop/search?keyword=${keyword}`, {
    headers: {
      ...headerAxios,
      "Referrer-Policy": "unsafe-url",
    }
  })
    .then((response) => {
      if (response.status == 200) {
        return response;
      }
    })
    .catch((error) => {
      handleError(error)
    });
}

const getVoucherShop = async () => {
  const config: AxiosRequestConfig = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${port}/api/voucher-shop`,
    headers: headerAxios
  };

  try {
    const response = await axios.request(config);
    if (response.status == 200) {
      return response.data;
    }
    return handleError("Thất bại");
  } catch (error) {
    return handleError(error)
  }
};

export { getVoucherShop, getSearchVoucherShop };