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
        .then((response) => response.json())
        .then((data) => localStorage.setItem("jwt-token", data.access_token))
        .catch((error) => console.error("Erreur lors de l'envoi des données :", error));
}
