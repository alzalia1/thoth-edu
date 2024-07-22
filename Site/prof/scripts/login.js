import { Palert, Perror } from "../../shared/scripts/modules/utils.js";

if (localStorage.getItem("jwt-token") && localStorage.getItem("jwt-token") != "none") {
    await fetch("https://api.thoth-edu.fr/user/check", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: localStorage.getItem("jwt-token") }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.status == "success") {
                localStorage.setItem("jwt-token", data.new);
                window.location.href = `https://professeur.thoth-edu.fr/dashboard`;
            }
        })
        .catch((error) => {
            Perror("Error on user/check : " + error);
        });
}

// ANCHOR - Confirmation de l'envoi des infos d'authentification
const confirmButton = document.getElementById("confirm");
confirmButton.addEventListener("click", () => {
    const sendBackForm = {
        id: document.getElementById("id").value,
        psswd: document.getElementById("psswd").value,
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
                localStorage.setItem("jwt-token", data.token);
                localStorage.setItem("username", sendBackForm.id);
                window.location.href = `https://professeur.thoth-edu.fr/dashboard`;
            }
        })
        .catch((error) => Perror("Error on user/login : " + error));
});

// ANCHOR - Ajoute la touche "Entrée" comme validateur
window.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        confirmButton.click();
    }
});
