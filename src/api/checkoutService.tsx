import axios from "axios";
import { headerAxios, port } from "../utils/env";
import { handleError } from "./handleError";

const onSubmitOrderBuyService = async (convertValue: any,  token: string | null) => {
  try {
    const response = await axios.request({
      method: "post",
      maxBodyLength: Infinity,
      url: `${port}/api/SaleOrder/createSaleOrder`,
      headers: {
        ...headerAxios,
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: JSON.stringify(convertValue),
    });
    return response.data;
  } catch (error:unknown) {
    return handleError(error);
  }
}

const onSubmitOrderService = async (convertValue: any,  token: string | null) => {
  try {
    const response = await axios.request({
      method: "post",
      maxBodyLength: Infinity,
      url: `${port}/api/leaseOrder`,
      headers: {
        ...headerAxios,
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: JSON.stringify(convertValue),
    });
    return response.data;
  } catch (error:unknown) {
    return handleError(error);
  }
}

const getDetailOrderService = async (orderId: number | null, token: string | null) => {
  try {
    const response = await axios.request({
      url: `${port}/api/leaseOrder/` + orderId,
      headers: {
        ...headerAxios,
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  };
};

export { onSubmitOrderService, onSubmitOrderBuyService, getDetailOrderService }