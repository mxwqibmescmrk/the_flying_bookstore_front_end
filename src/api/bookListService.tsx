import axios, { AxiosResponse } from "axios";
import { IListing } from "@/types/book";
import { PageResponse } from "@/types/page";
import { headerAxios, port } from "../utils/env";
import { handleError } from "./handleError";


const getBookDetailService = async (detailId: string) => {
  try {
    const response: AxiosResponse<IListing> = await axios.request({
      url: `${port}/api/listing/detailListing/${detailId}`,
      headers: {
        ...headerAxios
      }
    });
    return response.data;
  } catch (error: unknown) {
    return handleError(error);
  }
}
const getManyBookService = async (paramsAxios: any) => {
  try {
    const response: AxiosResponse<PageResponse<IListing>> =
      await axios.request({
        maxBodyLength: Infinity,
        url: `${port}/api/listing/search`,
        params: paramsAxios,
        headers: {
          ...headerAxios

        }
      });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}
const getAllBookService = async () => {
  try {
    const response: AxiosResponse<PageResponse<IListing>> = await axios.request({
      url: `${port}/api/listing/search`,
      method: "GET",
      headers: {
        ...headerAxios,
        "Referrer-Policy": "unsafe-url",

      },
      params: {
        allowRent: 1,
        allowPurchase: 1
      }
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}
const deletePostService = async ( modalDeleteId: number | undefined) => {
  return await axios.request({
      method: "DELETE",
      url: `${port}/api/listing/${modalDeleteId}`,
      headers:headerAxios

  })
  .then((response) => {
      return response.data;
  })
  .catch((error) => {
      console.log(error);
  });
};
export { getBookDetailService, getAllBookService, getManyBookService , deletePostService}
