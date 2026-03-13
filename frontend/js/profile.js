import { validateAccess } from "./utils/validateAcess.js";
import { link } from "./utils/links.js";

const data = await validateAccess();

//User name

const userName = document.querySelector("#user-name");
userName.innerText = data.user.name;

//transações

const sendFileToServer = () => {
    const file = document.querySelector("#file-upload");
};

const renderSendToServer = () => {
    const fileInput = document.getElementById("file-upload");
    const fileInfo = document.getElementById("file-info");
    const fileNameDisplay = document.getElementById("file-name");
    const btnSelect = document.getElementById("btn-secondary");
    const uploadInstruction = document.getElementById("upload-instruction");

    fileInput.addEventListener("change", function () {
        console.log(this.files);
        if (this.files && this.files.length > 0) {
            const file = this.files[0];

            // 2. Injetamos o nome do arquivo no parágrafo
            fileNameDisplay.textContent = `📄 Arquivo selecionado: ${file.name}`;

            // 3. Mostramos a div de feedback (que estava com display: none)
            fileInfo.style.display = "block";

            // 4. (Opcional) Escondemos o botão de selecionar para limpar o visual
            btnSelect.style.display = "none";

            uploadInstruction.style.display = "none";
        }
    });
};

//navegation

const renderSection = (pageTarget) => {
    document.querySelectorAll(".content-section").forEach((section) => {
        section.classList.remove("active");
    });

    const targetSection = document.getElementById(pageTarget);
    if (targetSection) {
        targetSection.classList.add("active");
    }
};

const tooglePage = (e) => {
    e.preventDefault();

    const allLinks = document.querySelectorAll(".nav-link");
    allLinks.forEach((link) => link.classList.remove("active"));

    const page = e.currentTarget;
    page.classList.toggle("active");

    const pageTarget = page.dataset.target;

    renderSection(pageTarget);
};

const logout = () => {
    localStorage.removeItem("accessToken");
    location.href = link.login;
};

document
    .querySelector("#btn-secondary")
    .addEventListener("click", renderSendToServer);

document.querySelector("#logout-btn").addEventListener("click", logout);

//Sidebar navegation

const links = document.querySelectorAll("a");

links.forEach((link) => {
    link.addEventListener("click", (e) => {
        tooglePage(e);
    });
});
