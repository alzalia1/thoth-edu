/** ANCHOR - To alert the user about smth
 * @param {string} text - Text to display
 * @param {Function} okHandler - Function to handle the ok button (nothing by default)
 */
export function Palert(text, okHandler = () => {}) {
    const body = document.body;

    const outsideDiv = document.createElement("div");
    outsideDiv.classList.add("popup");
    outsideDiv.style.display = "block";
    const insideDiv = document.createElement("div");
    insideDiv.classList.add("interieur-popup");

    // Text
    const p = document.createElement("p");
    p.textContent = text;

    // Ok button
    const ok = document.createElement("button");
    ok.textContent = "Ok";
    ok.classList.add("ok-button");
    ok.addEventListener("click", () => {
        body.removeChild(outsideDiv);
        okHandler();
    });

    insideDiv.append(p, ok);
    outsideDiv.append(insideDiv);
    body.append(outsideDiv);
}

/** ANCHOR - To show a bad error !
 * @param {string} error - Error that occured
 */
export function Perror(error = "Non spécifié") {
    const nowTime = new Date();
    const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    };

    const now = nowTime.toLocaleString("fr-FR", options);

    const body = document.body;

    const Gdiv = document.createElement("div");
    Gdiv.classList.add("popup");
    Gdiv.style.display = "block";
    const Sdiv = document.createElement("div");
    Sdiv.classList.add("interieur-popup");

    // Title
    const title = document.createElement("h2");
    title.textContent = "Oh non ! Le site semble avoir un dysfonctionnement :/";

    // Explain
    const explain = document.createElement("p");
    explain.textContent =
        "Si vous avez le temps, vous avez deux façons de rapporter cette erreur :";

    const ul = document.createElement("ul");

    const githubLi = document.createElement("li");
    const githubA = document.createElement("a");
    githubA.target = "_blank";
    githubA.textContent = "Via l'onglet 'Issues' de notre GitHub (Requiert un compte)";
    githubA.href = "https://github.com/alzalia1/thoth-edu/issues";
    githubLi.appendChild(githubA);

    const mailLi = document.createElement("li");
    const mailA = document.createElement("a");
    mailA.textContent = "Par mail à notre support technique (Recommandé)";
    mailA.href = `mailto:error@thoth-edu.fr?subject=Erreur sur la page &body=Message d'erreur: %0D%0A%0D%0A${error}%0D%0A%0D%0APage concernée : ${window.location} %0D%0A%0D%0ASurvenu au ${now}%0D%0A%0D%0ADescription de votre situation :%0D%0A`;
    mailLi.appendChild(mailA);

    ul.append(mailLi, githubLi);

    const explain2 = document.createElement("p");
    explain2.textContent =
        "Ci dessous le message d'erreur auto-généré, que vous pouvez joindre à votre post GitHub (ou au mail s'il ne s'y trouve pas d'office). N'hésitez pas à le compléter de vos commentaires ! (Et à renseigner les catégories 'Non spécifié' si possible)";

    // Text
    const p = document.createElement("textarea");
    p.value = error + `\nPage concernée : ${window.location}\nSurvenu au ${now}`;
    p.cols = 45;
    const copy = document.createElement("button");
    copy.textContent = "Copier";
    copy.addEventListener("click", () => {
        navigator.clipboard.writeText(p.value);
    });

    // Ok button
    const ok = document.createElement("button");
    ok.textContent = "Ok";
    ok.classList.add("ok-button");
    ok.addEventListener("click", () => {
        body.removeChild(Gdiv);
    });

    Sdiv.append(title, explain, ul, explain2, p, copy, ok);
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
                    setTimeout((window.location = `https://professeur.thoth-edu.fr/login`), 5000);
                    Palert(
                        "Vous avez bien été déconnecté ! Vous allez maintenant être redirigé vers la page de connexion.",
                        () => {
                            window.location = `https://professeur.thoth-edu.fr/`;
                        }
                    );
                }
            })
            .catch((error) => Perror("Error on user/logout : " + error));
    });
}

export let userCheckInProgress = false;
export let userCheckTimeoutId = null;
/** ANCHOR - To check and refresh the user's token
 */
export async function Puser_check() {
    // So it doesn't go mad with a hundred test a second
    if (userCheckInProgress) {
        return;
    }
    userCheckInProgress = true;

    // Actually o check the user's token and refresh it if ok
    await fetch("https://api.thoth-edu.fr/user/check", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: localStorage.getItem("jwt-token") }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.status == "fail") {
                throw Error("not-connected");
            } else {
                localStorage.setItem("jwt-token", data.new);
            }
        })
        .catch((error) => {
            if (error.message == "not-connected") {
                Palert(
                    "Oups ! Il semblerait que vous ne soyez pas, ou plus, connecté.e. Vous allez être transféré.e vers la page de connexion.",
                    () => {
                        window.location.href = `https://professeur.thoth-edu.fr/login`;
                    }
                );
                setTimeout(() => {
                    window.location.href = `https://professeur.thoth-edu.fr/login`;
                }, 5000);
            } else {
                Perror("Error on user/check : " + error);
            }
        })
        .finally(() => {
            userCheckInProgress = false;
            if (userCheckTimeoutId !== null) {
                clearTimeout(userCheckTimeoutId);
            }
            userCheckTimeoutId = setTimeout(() => {
                Puser_check();
            }, 1800000);
        });
}
