import axios from "axios";
import { IUser } from "../types/user";
import { headerAxios, port } from "../utils/env";
import { handleError } from "./handleError";
const getListPostService = async (profile: IUser) => {
    try {
        const response = await axios.request({
            url: `${port}/api/listing/search/byOwnerId/` + profile.id,
            headers:headerAxios

        });
        return response.data;
    } catch (error) {
        return handleError(error)
    }
};

export { getListPostService }