// ANCHOR - Connection button
const connectButton = document.getElementById("connect");
connectButton.addEventListener("click", () => {
    window.location.href = `https://professeur.thoth-edu.fr/`;
});

// ANCHOR - Accessing eval

const validateButton = document.getElementById("validate");
const idInputField = document.getElementById("idInputField");
const errorConnecting = document.getElementById("errorConnecting");

validateButton.addEventListener("click", () => {
    let id = idInputField.value;
    if (!id) {
        errorConnecting.textContent = "Veuillez entrer un id";
    }

    fetch("https://api.thoth-edu.fr/eval/check_access", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.exist == "yes") {
                window.location.href = `https://thoth-edu.fr/eval?e=${id}`;
            } else {
                errorConnecting.textContent = "Veuillez entrer un id valide";
            }
        })
        .catch((error) => console.error("Erreur lors de l'envoi des données :", error));
});
