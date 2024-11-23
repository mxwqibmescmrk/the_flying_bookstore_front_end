import axios, { AxiosRequestConfig } from 'axios';
import { port } from '../utils/env';
import { handleError } from './handleError';
import { ICopy } from '../types/book';

const getImagePreview = async (copyId: ICopy["id"] | undefined) => {
  if(!copyId) return;
  const config: AxiosRequestConfig = {
    url: `${port}/api/copy/imgLink/${copyId}`,
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

export { getImagePreview };