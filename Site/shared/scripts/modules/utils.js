/** ANCHOR - To alert the user about smth
 * @param {string} text - Text to display
 * @param {Function} okHandler - Function to handle the ok button (nothing by default)
 */
export function Palert(text, okHandler = () => {}) {
    const body = document.body;

    const Gdiv = document.createElement("div");
    Gdiv.classList.add("popup");
    Gdiv.style.display = "block";
    const Sdiv = document.createElement("div");
    Sdiv.classList.add("interieur-popup");

    // Text
    const p = document.createElement("p");
    p.textContent = text;

    // Ok button
    const ok = document.createElement("button");
    ok.textContent = "Ok";
    ok.classList.add("ok-button");
    ok.addEventListener("click", () => {
        body.removeChild(Gdiv);
        okHandler();
    });

    Sdiv.append(p, ok);
    Gdiv.append(Sdiv);
    body.append(Gdiv);
}

/** ANCHOR - To confirm smth with the user
 * @param {string} text - Text to display
 * @param {Function} okHandler - Function to handle the ok reaction
 * @param {Function} noHandler - function to handle the no reaction (nothing by default)
 */
export function Pconfirm(text, okHandler, noHandler = () => {}) {
    const body = document.body;

    const Gdiv = document.createElement("div");
    Gdiv.classList.add("popup");
    Gdiv.style.display = "block";
    const Sdiv = document.createElement("div");
    Sdiv.classList.add("interieur-popup");

    /*
    const wait = document.createElement("p")
    wait.textContent = "Attendez ! Nous avons besoin d'une confirmation de votre part."
    */

    // Text
    const p = document.createElement("p");
    p.textContent = text;

    // Ok button
    const ok = document.createElement("button");
    ok.textContent = "Confirmer";
    ok.classList.add("ok-button");
    ok.addEventListener("click", () => {
        body.removeChild(Gdiv);
        okHandler();
    });

    // No button
    const no = document.createElement("button");
    no.textContent = "Annuler";
    no.classList.add("no-button");
    no.addEventListener("click", () => {
        body.removeChild(Gdiv);
        noHandler();
    });

    Sdiv.append(p, ok, no);
    Gdiv.append(Sdiv);
    body.append(Gdiv);
}

/** ANCHOR - To ask something to the user
 * @param {string} text - The text to dispay
 * @param {Function} okHandler - To handle the final result (input.value as parameter)
 * @param {string} type - Type of input (default to text)
 */
export function Pinput(text, okHandler, type = "text") {
    const body = document.body;

    const Gdiv = document.createElement("div");
    Gdiv.classList.add("popup");
    Gdiv.style.display = "block";
    const Sdiv = document.createElement("div");
    Sdiv.classList.add("interieur-popup");

    // Text
    const p = document.createElement("p");
    p.textContent = text;

    // Input
    const input = document.createElement("input");
    input.type = type;

    // Ok button
    const ok = document.createElement("button");
    ok.textContent = "Confirmer";
    ok.classList.add("ok-button");
    ok.addEventListener("click", () => {
        body.removeChild(Gdiv);
        okHandler(input.value);
    });

    Sdiv.append(p, input, ok);
    Gdiv.append(Sdiv);
    body.append(Gdiv);
}

/**ANCHOR - To logout the user
 *
 */
export function Plogout() {
    Pconfirm("Vous allez vous déconnecter. Confirmez-vous ?", () => {
        fetch("https://api.thoth-edu.fr/user/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: localStorage.getItem("jwt-token") }),
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (data.status) {
                    setTimeout((window.location = `https://professeur.thoth-edu.fr/`), 5000);
                    Palert(
                        "Vous avez bien été déconnecté ! Vous allez maintenant être redirigé vers la page de connexion.",
                        () => {
                            window.location = `https://professeur.thoth-edu.fr/`;
                        }
                    );
                }
            })
            .catch((error) => Palert("Erreur lors de l'envoi des données :" + error));
    });
}
