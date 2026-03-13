import { fetchRequestPost } from "./utils/fetchRequest.js";
import { link } from "./utils/links.js";

const signUp = async () => {
    const name = document.querySelector("#name").value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const confirmPassword = document.querySelector("#confirm-password").value;
    const errorMessage = document.querySelector("#error-msg");

    errorMessage.style.display = "none";

    if (password === confirmPassword) {
        const pack = {
            name,
            email,
            password,
        };

        const route = link.register;

        const response = await fetchRequestPost(pack, route);

        if (response.status === 500) {
            alert("Erro ao registrar");
        }
        if (response.status === 400) {
            alert("Usuario já cadastrado");
        }
        if (response.status === 201) {
            location.href = link.login;
        }
    } else {
        errorMessage.style.display = "block";
        confirmPassword.focus();
    }
};

const redirectToLogin = (e) => {
    e.preventDefault();
    location.href = link.login;
};

document.querySelector("#signup-btn").addEventListener("click", signUp);
document
    .querySelector("#login-page")
    .addEventListener("click", redirectToLogin);
