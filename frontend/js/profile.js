import { validateAccess } from "./utils/validateAcess.js";
import { link } from "./utils/links.js";
import { fetchRequestAuthPost } from "./utils/fetchRequest.js";

const data = await validateAccess();

let file;

//User name

const userName = document.querySelector("#user-name");
userName.innerText = data.user.name;

//transações

const sendFileToServer = () => {
    const fileInput = document.getElementById("file-upload");
    fileInput.addEventListener("change", function () {
        if (file && file.length > 0) {
            uploadFile(file);
        }
    });
};

const uploadFile = async (file) => {
    const token = localStorage.getItem("accessToken");

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetchRequestAuthPost(
        formData,
        link.transactionFile,
        token,
    );

    alert(response.message);
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
            file = this.files[0];

            fileNameDisplay.textContent = `📄 Arquivo selecionado: ${file.name}`;

            fileInfo.style.display = "block";

            btnSelect.style.display = "none";

            uploadInstruction.style.display = "none";
        }
    });
};

const transactionPack = [];

const getDataTransaction = () => {
    const date = document.querySelector("#manual-date").value;
    const description = document.querySelector("#manual-desc").value;
    const category = document.querySelector("#manual-category").value;
    const amount = document.querySelector("#manual-value").value;

    if (!date || !description || !amount) {
        alert("Preencha todos os campos!");
        return;
    }

    const transaction = {
        date,
        description,
        category,
        amount,
        type:
            category === "Renda Extra" || category === "Salário"
                ? "income"
                : "expense",
    };

    renderTransaction(transaction);

    document.querySelector("#form-manual-transaction").reset();
    transactionPack.push(transaction);
};

const subimitTransaction = async () => {
    const token = localStorage.getItem("accessToken");
    const response = await fetchRequestAuthPost(
        transactionPack,
        link.transaction,
        token,
    );

    if (response.status === 500) {
        const { message } = response;
        alert(message);
    } else {
        const { message, count, transaction } = response;
        alert(message);
        document.querySelector("#preview-body").innerHTML = "";
        const headTransactions = document.querySelector(
            "#head-preview-transactions",
        );
        headTransactions.style.display = "none";
    }
};

const renderTransaction = (transaction) => {
    const section = document.querySelector("#preview-body");
    const submitButton = document.querySelector("#submit-transaction");
    submitButton.style.display = "flex";

    const headTransactions = document.querySelector(
        "#head-preview-transactions",
    );
    headTransactions.style.display = "table-header-group";

    const row = document.createElement("tr");
    row.classList.add("preview-transactions");
    row.style.animation = "fadeIn 0.5s ease forwards";

    let { type, amount } = transaction;

    const amountBRL = parseFloat(amount).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    if (type === "income") type = "Renda";
    if (type === "expense") type = "Despesa";

    // 2. Definindo a largura nas células via CSS ou Style
    row.innerHTML = `
        <td style="width: 20%;">${transaction.date.split("-").reverse().join("/")}</td>
        <td style="width: 40%;">${transaction.description}</td>
        <td style="width: 15%;"><span class="category-badge">${transaction.category}</span></td>
        <td style="width: 15%; color: ${type === "Renda" ? "#29a503" : "#ff0000"} ; font-weight: bold;">${amountBRL}</td>
        <td style="width: 10%;"><span class="status-pill">${type}</span></td>
    `;

    section.prepend(row);
};

const manualInsertData = () => {
    const pageTransaction = document.querySelector("#import-container-card");
    const importManual = document.querySelector("#import-manual");
    pageTransaction.style.display = "none";
    importManual.style.display = "block";
};

const toggleManualImput = () => {
    const pageTransaction = document.querySelector("#import-container-card");
    const importManual = document.querySelector("#import-manual");
    pageTransaction.style.display = "grid";
    importManual.style.display = "none";
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

document
    .querySelector("#btn-manual-entry")
    .addEventListener("click", manualInsertData);

document
    .querySelector("#btn-close-manual")
    .addEventListener("click", toggleManualImput);

document
    .querySelector("#add-transaction")
    .addEventListener("click", getDataTransaction);

document
    .querySelector("#submit-transaction")
    .addEventListener("click", subimitTransaction);

document
    .querySelector("#btn-send-file")
    .addEventListener("click", sendFileToServer);

//Sidebar navegation

const links = document.querySelectorAll("a");

links.forEach((link) => {
    link.addEventListener("click", (e) => {
        tooglePage(e);
    });
});
