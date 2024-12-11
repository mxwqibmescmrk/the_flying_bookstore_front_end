import axios from 'axios';
import { headerAxios, port } from '../../utils/env';
import { handleError } from '../handleError';


const getSearchVoucherSession = async (keyword: string) => {
  try {
    const response = await axios.get(`${port}/api/voucher-session/search?keyword=${keyword}`, {
      headers: {
        ...headerAxios,
        "Referrer-Policy": "unsafe-url",

      }
    });
    return response;
  } catch (error) {
    return handleError(error);
  }
};

export default getSearchVoucherSession;