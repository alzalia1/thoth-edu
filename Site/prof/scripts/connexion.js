import { Pconfirm, Palert, Pinput } from "../../shared/scripts/modules/utils.js";

document.getElementById("confirm").addEventListener("click", function (event) {
    event.preventDefault();

    const formData = {
        id: document.getElementById("id").value,
        mdp: document.getElementById("passwd").value,
    };

    // Envoi des données au backend
    sendDataToBackend(formData);
});

function sendDataToBackend(formData) {
    fetch("https://api.thoth-edu.fr/user/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    })
        .then((response) => {
            if (response.headers.get("content-type").includes("application/json")) {
                return response.json();
            } else {
                throw new Error("Server response is not JSON");
            }
        })
        .then((data) => {
            if (data.status == "fail") {
                Palert("Erreur : " + data.reason);
            } else {
                localStorage.setItem("jwt-token", data.access_token);
                window.location.href = `https://professeur.thoth-edu.fr/dashboard`;
            }
        })
        .catch((error) => console.error("Erreur lors de l'envoi des données :", error));
}
