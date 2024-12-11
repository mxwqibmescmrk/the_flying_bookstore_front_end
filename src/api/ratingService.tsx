import axios from "axios";
import { headerAxios, port } from "../utils/env";
import { handleError } from "./handleError";
const SubmitReviewService = async ( formData: any) => {
    let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${port}/api/review`,
        headers: {
            ...headerAxios,
            "Content-Type": "application/json",
        },
        data: formData,
    };
    return await axios
        .request(config)
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            console.log(error);
            return handleError(error);
        });
}
export { SubmitReviewService }