import axios, { AxiosRequestConfig } from 'axios';
import { handleError } from '../handleError';
import { headerAxios, port } from '../../utils/env';
import { ICreateVoucher } from '../../types/form';

const deleteVoucherShop = async (modalDeleteId: number | undefined) => {
  return await axios.request({
    method: "DELETE",
    url: `${port}/api/voucher-shop/${modalDeleteId}`,
    headers: headerAxios
  })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      handleError(error)
    });
};

const createVoucherShop = async (data: ICreateVoucher) => {
  const config: AxiosRequestConfig = {
    method: 'post',
    url: `${port}/api/voucher-shop`,
    headers: headerAxios,
    data
  };
  return await axios.request(config)
    .then((response) => {
      if (response.status == 200) {
        return response;
      }
    })
    .catch((error) => {
      handleError(error)
    });
}
const updateVoucherShop = async (id: string, data: ICreateVoucher) => {
  const config: AxiosRequestConfig = {
    method: 'put',
    url: `${port}/api/voucher-shop/${id}`,
    headers: headerAxios,
    data
  };
  return await axios.request(config)
    .then((response) => {
      if (response.status == 200) {
        return response;
      }
    })
    .catch((error) => {
      handleError(error)
    });
}
const getSearchVoucherShop = async (keyword: string) => {
  return await axios.get(`${port}/api/voucher-shop/search?keyword=${keyword}`, {
    headers: {
      ...headerAxios,
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

const getVoucherShopDetail = async (voucherId: string) => {
  const config: AxiosRequestConfig = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${port}/api/voucher-shop/${voucherId}`,
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

export { getVoucherShop, createVoucherShop,updateVoucherShop, getSearchVoucherShop, deleteVoucherShop, getVoucherShopDetail };