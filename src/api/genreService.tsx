import axios from "axios";
import { headerAxios, port } from "../utils/env";

const genreSliceService = async () => {
    console.log({ port });

    return await axios.request({
        url: `${port}/api/genre`, 
        headers: {
            ...headerAxios,
            "Referrer-Policy": "unsafe-url",
        },
    }).then(response => response.data)
        .catch(error => console.log(error));
}
export { genreSliceService }