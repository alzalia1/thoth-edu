document.getElementById("confirm").addEventListener("click", function (event) {
  event.preventDefault();

  const formData = {
    id: document.getElementById("id").value,
    mdp: document.getElementById("passwd").value,
    accents: ["", ""],
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
    .then(
      (response) => (window.location.href = `https://professeur.thoth-edu.fr/`)
    )
    .catch((error) =>
      console.error("Erreur lors de l'envoi des données :", error)
    );
}
