import { construct } from "./modules/dashConstruct.js";

// Check if user is allowed !
fetch("https://api.thoth-edu.fr/user/check", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("jwt-token")}`,
    },
    body: JSON.stringify({}),
})
    .then((response) => response.json())
    .then((data) => {
        if (data.status == "success") {
            page();
        } else {
            throw Error("Connexion non autorisée");
        }
    })
    .catch((error) => {
        window.stop();
        alert("Votre demande n'est pas autorisée ! Veuillez vous connecter avant.");
        console.log(error);
        window.location.href = `https://professeur.thoth-edu.fr/`;
    });

function page() {
    // Vers crea_eval
    const newEval = document.getElementById("newEval");
    newEval.addEventListener("click", () => {
        window.location.href = `https://professeur.thoth-edu.fr/crea_eval`;
    });

    // Getting user infos
    let userI = {};
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const userParam = urlParams.get("u");

    fetch("https://api.thoth-edu.fr/dashboard/infos_user", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt-token")}`,
        },
        body: JSON.stringify({ id: userParam }),
    })
        .then((response) => response.json())
        .then((data) => (userI = data))
        .catch((error) => alert("Erreur lors de l'envoi des données :", error));

    /*
    userI = {
        username: "testy",
        evals: [
            { name: "C - Esp4", id: "45Uia8" },
            { name: "A - Esp5", id: "4520a8" },
            { name: "D - App7", id: "uAUia8" },
        ],
    };
    */
    // Setting the page
    localStorage.setItem("username", userI.username);
    const username = document.getElementById("username");
    username.textContent = localStorage.getItem("username");

    const evalsDiv = document.getElementById("evals");
    construct(evalsDiv, userI.evals, { url: "controle", param: "e" });
}
