document.getElementById("test").addEventListener("click", function (event) {
    event.preventDefault();

    const formData = {
        nom: document.getElementById("nom").value,
        prenom: document.getElementById("prenom").value,
        email: document.getElementById("email").value,
    };

    // Envoi des données au backend
    sendDataToBackend(formData);
});

function sendDataToBackend(formData) {
    fetch("https://api.thoth-edu.fr/save-json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    })
        .then((response) => response.json())
        .then((data) => console.log("Données envoyées avec succès !"))
        .catch((error) =>
            console.error("Erreur lors de l'envoi des données :", error)
        );
}
