import { fetchRequestAuthGet } from "./fetchRequest.js";
import { link } from "./links.js";

export const validateAccess = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
        location.href = link.login;
    } else {
        const response = await fetchRequestAuthGet(token, link.validate);
        return response;
    }
};
