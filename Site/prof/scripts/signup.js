import { Palert, Perror } from "../../shared/scripts/modules/utils.js";

// ANCHOR - Confirmation de l'envoi des infos d'authentification
const confirmButton = document.getElementById("confirm");
confirmButton.addEventListener("click", function (event) {
    event.preventDefault();

    const sendBackForm = {
        id: document.getElementById("id").value,
        psswd: document.getElementById("psswd").value,
    };

    fetch("https://api.thoth-edu.fr/user/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(sendBackForm),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            if (data.status == "success") {
                window.location.href = `https://professeur.thoth-edu.fr/login`;
            } else {
                Palert("Oh non ! Une erreur est survenue : " + data.reason);
            }
        })
        .catch((error) => Perror("Error on user/signup : " + error));
});

// ANCHOR - Ajoute la touche "Entrée" comme validateur
window.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        confirmButton.click();
    }
});
