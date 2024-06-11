import { Palert } from "../../shared/scripts/modules/utils.js";

// ANCHOR - Confirmation de l'envoi des infos d'authentification
const confirmButton = document.getElementById("confirm");
confirmButton.addEventListener("click", () => {
    const sendBackForm = {
        id: document.getElementById("id").value,
        mdp: document.getElementById("passwd").value,
    };

    fetch("https://api.thoth-edu.fr/user/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(sendBackForm),
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if (data.status == "fail") {
                Palert("Erreur : " + data.reason);
            } else {
                localStorage.setItem("jwt-token", data.access_token);
                window.location.href = `https://professeur.thoth-edu.fr/dashboard`;
            }
        })
        .catch((error) => Palert("Erreur lors de l'envoi des données :" + error));
});

// ANCHOR - Ajoute la touche "Entrée" comme validateur
window.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        confirmButton.click();
    }
});
