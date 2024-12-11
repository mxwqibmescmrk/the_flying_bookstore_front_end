import axios from "axios";
import { headerAxios, port } from "../utils/env";

const DeletePostService = async ( modalDeleteId: number | undefined) => {
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
export { DeletePostService }