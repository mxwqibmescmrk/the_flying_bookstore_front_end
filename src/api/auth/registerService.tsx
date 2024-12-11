import axios from "axios";
import { IUser } from "@/types/user";
import { headerAxios, port } from "../../utils/env";
import { handleError } from "../handleError";

const onRegisterService = async (data: IUser) => {
  try {
    const response = await axios.request({
      method: "POST",
      headers: {
        ...headerAxios,
        "Content-Type": "application/json",
        "Referrer-Policy": "unsafe-url" ,
      },
      url: `${port}/api/user/register`,
      data: {
        username: data.username,
        password: data.password,
        email: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        birthDate: "",
      },
    });
    return response.data;
  } catch (error: unknown) {
    return handleError(error);
  }
};
export { onRegisterService }