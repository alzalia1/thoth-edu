import { Pconfirm, Palert, Pinput } from "../../shared/scripts/modules/utils.js";

document.getElementById("confirm").addEventListener("click", function (event) {
    event.preventDefault();

    const formData = {
        id: document.getElementById("id").value,
        mdp: document.getElementById("passwd").value,
        accents: { "": ["", ""] },
    };

    // Envoi des données au backend
    sendDataToBackend(formData);
});

function sendDataToBackend(formData) {
    fetch("https://api.thoth-edu.fr/user/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            if (data.status == "success") {
                window.location.href = `https://professeur.thoth-edu.fr`;
            } else {
                Palert("Oh non ! Une erreur est survenue : " + data.reason);
            }
        })
        .catch((error) => Palert("Erreur lors de l'envoi des données :", error));
}
