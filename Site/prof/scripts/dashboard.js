import { construct } from "./modules/dashConstruct.js";

// Check if user is allowed !
fetch("https://api.thoth-edu.fr/user/check", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt-token")}`,
    },
    body: JSON.stringify({ token: localStorage.getItem("jwt-token") }),
})
    .then((response) => response.json())
    .then((data) => {
        if (data.status == "fail") {
            throw Error();
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

    fetch("https://api.thoth-edu.fr/dashboard/infos_user", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt-token")}`,
        },
        body: JSON.stringify({ token: localStorage.getItem("jwt-token") }),
    })
        .then((response) => response.json())
        .then((data) => {
            userI = data;
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
            console.log(userI);
            // Setting the page
            localStorage.setItem("username", userI.username);
            const username = document.getElementById("username");
            username.textContent = localStorage.getItem("username");

            const evalsDiv = document.getElementById("evals");
            construct(evalsDiv, userI.evals, { url: "controle", param: "e" });
        })
        .catch((error) => alert("Erreur lors de l'envoi des données :", error));
}

page();
