import { fetchRequestPost } from "./utils/fetchRequest.js";
import { link } from "./utils/links.js";

const handleLogin = async () => {
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    const pack = {
        email,
        password,
    };

    const route = link.login;

    const response = await fetchRequestPost(pack, route);

    const { token } = response;

    if (!token) {
        const { message } = response;
        alert(message);
    } else {
        localStorage.setItem("accessToken", token);

        location.href = link.profile;
    }
};

const signUpPage = (e) => {
    e.preventDefault();
    location.href = link.register;
};

document.querySelector("#login").addEventListener("click", handleLogin);
document.querySelector("#sigup-page").addEventListener("click", signUpPage);
