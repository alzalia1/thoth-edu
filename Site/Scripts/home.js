const connectButton = document.getElementById("connect");
const validateButton = document.getElementById("validate");

connectButton.addEventListener("click", openConnectWindow);
validateButton.addEventListener("click", openAccessWindow);

function openConnectWindow() {
    window.location.href = `Pages/professeur/connexion.html`;
}

async function openAccessWindow() {
    let inputContent = document
        .getElementById("idInputField")
        .value.toLowerCase()
        .trim();

    try {
        let response = await fetch(`Pages/acces/${inputContent}.html`);
        if (!response.ok) {
            throw new Error(
                `La page n'existe pas. Code d'erreur : ${response.status}`
            );
        }

        window.location.href = `Pages/acces/${inputContent}.html`;
    } catch (error) {
        const errorConnecting = document.getElementById("errorConnecting");
        errorConnecting.textContent = "Veuillez indiquer un ID valide ! ";
    }
}
